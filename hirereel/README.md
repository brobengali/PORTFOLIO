<div align="center">

# HireReel

**Showcase Your 2-Min Visume. Get Hired Fast.**

*Traditional 2-page PDF resumes don't convey energy, communication skills, or personality. HireReel transforms freelance hiring into an engaging, video-first experience powered by short-form video pitch reels, verified skill badges, and smart matching.*

[Explore Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Project Structure](#-project-structure) • [API Reference](#-api-reference)

</div>

## Why HireReel?

Hiring managers spend an average of 6 seconds scanning static PDFs, often missing stellar communicators or getting misled by keyword-stuffed resumes. Freelancers struggle to convey authentic passion and domain expertise through text alone.

**HireReel bridges this gap:**
- **For Freelancers:** Record a concise 2-minute video pitch ("Visume"), earn verified skill badges, and land contracts directly without cold cover letters.
- **For Clients & Recruiters:** Browse a TikTok/Reels-style vertical talent feed, evaluate personality and communication clarity in seconds, and hire top 1% vetted talent with milestone escrow protection.

---

## Key Features

### 1. In-Browser 2-Minute Visume Studio
- **Guided Prompt System:** 3-step dynamic guidance:
  - `0:00 - 0:30` • **Introduction:** Name, role, and high-level passion in tech/design.
  - `0:30 - 1:15` • **Core Skills & Top Project:** Walk through tools and solved challenges.
  - `1:15 - 2:00` • **Why Hire You:** Availability, communication strengths, and work style.
- **Webcam & Mic Capture:** Native browser `MediaStream` recording with live video preview, audio metering, timer, retake functionality, and instant preview.

### 2. Immersive Video Reel Discovery Feed
- **Vertical Feed Experience:** Smooth video reel carousel designed for fast candidate evaluation.
- **Instant Candidate Context:** Floating overlay displaying verified badge, hourly rate, rating, location, skill tags, and quick-action buttons (*Hire / Book Interview*, *View Portfolio*, *Share*).
- **Interactive Audio & Playback:** Sound toggling, play/pause controls, and direct profile navigation.

### 3. Smart Search & Multi-Facet Filtering
- **Granular Search Engine:** Filter talent by technical skills (React, Next.js, Python, Figma, UI/UX, AI/ML, etc.).
- **Parametric Filters:** Filter by experience level (`entry`, `intermediate`, `expert`), availability status, hourly rate brackets, languages, and verified status.
- **Sorting Options:** Sort by relevance, hourly rate (low to high / high to low), verified rating, or newest members.

### 4. Multi-Tier Trust & Verification
- **Verified Skill Audits:** Badge indicators for technical and design competency.
- **Identity & Portfolio Proof:** Verified GitHub repositories, live project links, and case studies.
- **Client Reviews & Performance Metrics:** Transparent ratings, job completion rates, total earnings, and response times.

### 5. Contract Management & Milestone Escrow
- **Dual Budget Types:** Support for fixed-price contracts and hourly agreements.
- **Milestone Protection:** Clients fund milestones into escrow; funds are safely released upon deliverable review and approval.
- **Deliverable Submissions:** Built-in review and revision cycles.

### 6. In-App Messaging & Meeting Scheduling
- **Direct Messaging:** Integrated chat threads between clients and freelancers with attachment support.
- **1-on-1 Interview Booker:** Propose and confirm video meeting slots with integrated call room links.

### 7. Viral Waitlist & Referral Engine
- **Early Access Waves:** Wave-based admission with dynamic queue position updates.
- **Referral Rewards:** Unique referral codes; each successful referral moves applicants up the queue.
- **Live Counters & Admin Export:** Real-time sign-up counts, capacity indicators, and exportable waitlist database (`waitlist.json`).

---

## Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Server & client components, API routes, fast SSR/SSG |
| **UI Library** | [React 19](https://react.dev/) | Modern concurrent UI architecture |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety across domain models & components |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS | High-performance CSS engine with modern CSS theme tokens |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth UI transitions and micro-interactions |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, clean icon set |
| **Auth (demo)** | Role session in the client | Role-based demo auth (`client`, `freelancer`, `admin`) — swap in NextAuth v5 for production |
| **Security** | [BcryptJS](https://github.com/dcodeIO/bcrypt.js) | Password hashing on signup |
| **Utilities** | `date-fns`, `uuid` | Date formatting and unique identifier generation |

---

## Project Structure

```text
hirereel/
├── public/
├── src/
│   ├── app/
│   │   ├── api/waitlist/     # Waitlist + referral API
│   │   ├── dashboard/
│   │   ├── discover/
│   │   ├── freelancer/[id]/
│   │   ├── messages/
│   │   ├── onboarding/
│   │   ├── projects/
│   │   ├── search/
│   │   ├── signup/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # SPA container & waitlist switcher
│   ├── components/
│   │   ├── sections/
│   │   ├── ui/
│   │   ├── video/
│   │   └── Navbar.tsx
│   ├── data/waitlist.json
│   ├── lib/
│   └── types/
├── package.json
└── tsconfig.json
```

---

## Quick Start

### Prerequisites

- **Node.js**: `v18.18.0` or later (Node 20+ recommended)
- **Package Manager**: `npm`, `pnpm`, `yarn`, or `bun`

### Installation & Running Locally

```bash
cd hirereel
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server at `http://localhost:3000` |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Runs the compiled production build |
| `npm run lint` | Lints the codebase with ESLint |
| `npm run rag:migrate` | Runs Django migrations for the RAG assistant backend |
| `npm run rag:dev` | Starts the RAG assistant backend at `http://localhost:8000` |

---

## RAG Assistant (`/assistant`)

The **Assistant** page integrates [Aditya-4698/rag-chatbot](https://github.com/Aditya-4698/rag-chatbot), a Django REST
RAG backend vendored under `services/rag-chatbot`. Users upload PDFs, which are chunked, embedded with `fastembed`
and stored in ChromaDB; questions are answered by Gemini with page-level sources. Next.js proxies `/api/rag/*` to
the Django API. **No sign-up is required**: on first use the proxy silently registers a private guest account on the
backend and keeps its DRF token in an httpOnly cookie, so each visitor gets an isolated document space for free and
no CORS setup or browser-visible token is needed.

### Running the backend

```bash
cd services/rag-chatbot
python -m venv .venv && .venv\Scripts\activate      # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env                              # set SECRET_KEY and GEMINI_API_KEY
python manage.py migrate
python manage.py runserver 8000
```

Without `DATABASE_URL`/`DB_*` the backend falls back to local SQLite. Docker users can run `docker compose up`
inside `services/rag-chatbot` instead (Postgres + Redis + Celery).

Set `RAG_API_URL` in the Next.js `.env` (default `http://localhost:8000`).

---

## API Reference

### Waitlist & Referral API (`/api/waitlist`)

- **`GET /api/waitlist`**: Retrieves waitlist counts and wave capacities. Append `?export=true` for admin data.
- **`POST /api/waitlist`**: Submits a new participant (body: `{ email, role, referredBy }`), returns their unique referral code and queue position.

### RAG Assistant proxy (`/api/rag/*`)

Forwards to the Django backend (`{RAG_API_URL}/api/<path>/`). A guest workspace is auto-provisioned on first call and
its token is stored in the `hirereel_rag_token` cookie (auth endpoints are internal and not exposed).

- **`GET /api/rag/health`** — backend liveness
- **`GET|POST /api/rag/documents`** (multipart `title`, `file`) · **`DELETE /api/rag/documents/:id`**
- **`POST /api/rag/chat`** (`{ question }` → `{ answer, sources[] }`) · **`GET /api/rag/chat/history`** · **`DELETE /api/rag/chat/:id`**

---

## Application Views & Navigation

| Route / View | Description |
|---|---|
| **Waitlist Mode** (`/?view=waitlist`) | Landing & pre-launch conversion page |
| **Home Hub** (`/?view=home`) | Hero, metrics, 3-step workflow, visume studio |
| **Discover Feed** (`/?view=discover` or `/discover`) | Vertical reel feed |
| **Talent Profile** (`/?view=profile&id=...` or `/freelancer/:id`) | Visume, portfolio, verification |
| **Contract Marketplace** (`/?view=projects` or `/projects`) | Fixed & hourly contracts |
| **Search & Filter** (`/search`) | Talent search with filter sidebar |
| **RAG Assistant** (`/assistant`) | Upload PDFs and chat with grounded, sourced answers |

---

## Roadmap

- [x] In-browser 2-minute webcam recording studio with guided prompts
- [x] Reels-style vertical talent feed with live sound controls
- [x] Viral waitlist engine with dynamic queue calculation & referral rewards
- [x] Multi-tier freelancer verification and portfolio showcases
- [x] Milestone escrow contract management architecture
- [ ] AI-powered speech-to-text transcription & closed captions for Visumes
- [ ] Integrated WebRTC video interview rooms
- [ ] Automated code sandbox skill assessments (GitHub integration)
- [ ] Stripe Connect escrow payments integration

---

## License

Distributed under the **MIT License**.
