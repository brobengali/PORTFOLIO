import logging
import os
import time

from google import genai
from google.genai import errors as genai_errors

from config.exceptions import AIServiceError
from .prompts import build_rag_prompt
from .retrieval import retrieve_relevant_chunks


logger = logging.getLogger(__name__)


# Ordered fallback chain. Override with a comma-separated GEMINI_MODELS env var.
# When one model is overloaded (429/503) or missing (404) we move to the next.
DEFAULT_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
]

LLM_MODELS = [
    m.strip()
    for m in os.getenv("GEMINI_MODELS", ",".join(DEFAULT_MODELS)).split(",")
    if m.strip()
]

# Backwards compatibility: a single GEMINI_MODEL is tried first.
_single = os.getenv("GEMINI_MODEL")
if _single and _single not in LLM_MODELS:
    LLM_MODELS.insert(0, _single)

# Strategy: sweep the whole chain quickly (one attempt per model), then back off and sweep
# again. Overloaded (503) responses come back in ~1s and are intermittent, so cycling through
# every model several times succeeds far more often than hammering a single model.
MAX_ROUNDS = int(os.getenv("GEMINI_ROUNDS", "5"))
RETRY_BACKOFF_SECONDS = float(os.getenv("GEMINI_RETRY_BACKOFF", "2"))
TIME_BUDGET_SECONDS = float(os.getenv("GEMINI_TIME_BUDGET", "75"))

TRANSIENT_STATUS = {429, 500, 502, 503, 504}
SKIP_MODEL_STATUS = {400, 403, 404}

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None

if GEMINI_API_KEY:
    client = genai.Client(
        api_key=GEMINI_API_KEY
    )


def _generate_with_fallback(prompt, user_id):
    """
    Sweep every model in LLM_MODELS once per round. Models that reject the request outright
    (bad model / no access / quota) are dropped for the rest of the call; transient errors
    (overloaded, rate-limited) are retried in the next round after a growing backoff.
    Raises AIServiceError only when every model failed within the time budget.
    """
    last_error = None
    candidates = list(LLM_MODELS)
    started = time.monotonic()

    for round_no in range(1, MAX_ROUNDS + 1):
        for model in list(candidates):
            if time.monotonic() - started > TIME_BUDGET_SECONDS:
                break
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                )
                text = (response.text or "").strip()
                if not text:
                    raise AIServiceError("Empty response from model.")
                if round_no > 1 or model != LLM_MODELS[0]:
                    logger.info(
                        "Gemini answered with fallback model %s (round %s). user_id=%s",
                        model, round_no, user_id,
                    )
                return text, model

            except genai_errors.APIError as exc:
                last_error = exc
                status = getattr(exc, "code", None) or getattr(exc, "status_code", None)

                if status in SKIP_MODEL_STATUS or (status == 429 and "quota" in str(exc).lower()):
                    logger.warning(
                        "Gemini model %s unavailable for this key (%s); dropping it. user_id=%s",
                        model, status, user_id,
                    )
                    candidates.remove(model)
                    continue

                logger.warning(
                    "Gemini model %s transient error (%s) in round %s. user_id=%s",
                    model, status, round_no, user_id,
                )

            except AIServiceError as exc:
                last_error = exc

            except Exception as exc:  # network / SDK errors
                last_error = exc
                logger.warning(
                    "Gemini model %s unexpected error: %s. user_id=%s",
                    model, exc, user_id,
                )

        if not candidates or time.monotonic() - started > TIME_BUDGET_SECONDS:
            break

        if round_no < MAX_ROUNDS:
            delay = RETRY_BACKOFF_SECONDS * round_no
            logger.warning(
                "All Gemini models busy in round %s; retrying in %.1fs. user_id=%s",
                round_no, delay, user_id,
            )
            time.sleep(delay)

    logger.error(
        "All Gemini models failed after %.0fs: user_id=%s models=%s last_error=%s",
        time.monotonic() - started, user_id, LLM_MODELS, last_error,
    )
    raise AIServiceError(
        "AI service is temporarily unavailable. Please try again in a moment."
    ) from last_error


def generate_answer(question, user_id, n_results=5):
    """
    Generate an answer using retrieved document context.
    """

    chunks = retrieve_relevant_chunks(
        question=question,
        user_id=user_id,
        n_results=n_results,
    )

    if not chunks:
        return {
            "answer": (
                "I could not find relevant information "
                "in your documents."
            ),
            "sources": [],
        }

    context_parts = []
    sources = []

    for chunk in chunks:
        context_parts.append(
            chunk["content"]
        )

        metadata = chunk["metadata"]

        sources.append({
            "document_id": metadata.get("document_id"),
            "page": metadata.get("page"),
            "chunk_index": metadata.get("chunk_index"),
        })

    context = "\n\n".join(context_parts)

    prompt = build_rag_prompt(
        question=question,
        context=context,
    )

    if client is None:
        raise AIServiceError(
            "Gemini API key is not configured."
        )

    answer, model_used = _generate_with_fallback(prompt, user_id)

    return {
        "answer": answer,
        "sources": sources,
        "model": model_used,
    }
