"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FREELANCERS } from "@/lib/demo-data";
import { ReelPlayer } from "@/components/video/ReelPlayer";

export function DiscoverSection() {
  const [index, setIndex] = useState(0);
  const talent = FREELANCERS[index];

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-10">
      <p className="chip mb-6">
        Vertical talent feed · {index + 1}/{FREELANCERS.length}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={talent.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <ReelPlayer talent={talent} active />
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          className="btn-outline px-5 py-2 text-sm"
          onClick={() => setIndex((i) => (i - 1 + FREELANCERS.length) % FREELANCERS.length)}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn-primary px-5 py-2 text-sm"
          onClick={() => setIndex((i) => (i + 1) % FREELANCERS.length)}
        >
          Next reel
        </button>
      </div>
    </div>
  );
}
