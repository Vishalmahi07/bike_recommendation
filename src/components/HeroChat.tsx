"use client";

import { motion } from "framer-motion";
import { Bike, Sparkles } from "lucide-react";

// A preview of the bike-finder conversation. It shows the flow only;
// real recommendations come from the bike database in Week 2.
const userMessage =
  "Budget 2.5 to 3 lakh, 23–25 kmpl, good pickup, comfortable for pillion. I want a cafe racer. I'm 5'5\" and 70 kg.";

const followUp = "Got it. Two quick questions so I pick the right one:";

const chips = [
  ["Mostly city", "Mostly highway", "Both"],
  ["Pillion daily", "Weekends only"],
];

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function HeroChat() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.45, delayChildren: 0.3 }}
      className="relative w-full max-w-md rounded-3xl border border-line bg-surface/90 p-5 shadow-[0_30px_80px_-20px_#ff6b1a40] backdrop-blur"
    >
      <div className="mb-5 flex items-center gap-3 border-b border-line pb-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-background">
          <Bike size={18} strokeWidth={2.5} />
        </span>
        <div>
          <p className="text-sm font-semibold">RevMate</p>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Your riding buddy
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm leading-relaxed">
        <motion.div variants={item} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-surface-2 px-4 py-3">
          {userMessage}
        </motion.div>

        <motion.div variants={item} className="max-w-[90%] rounded-2xl rounded-bl-md border border-accent/30 bg-accent-soft px-4 py-3">
          {followUp}
        </motion.div>

        {chips.map((row, i) => (
          <motion.div variants={item} key={i} className="flex flex-wrap gap-2">
            {row.map((c, j) => (
              <span
                key={c}
                className={
                  "rounded-full border px-3 py-1.5 text-xs font-medium " +
                  (j === 0 ? "border-accent bg-accent text-background" : "border-line text-muted")
                }
              >
                {c}
              </span>
            ))}
          </motion.div>
        ))}

        <motion.div variants={item} className="flex items-center gap-2 pt-1 text-xs text-muted">
          <Sparkles size={14} className="text-accent" />
          Matching against every brand for your height and budget…
        </motion.div>
      </div>
    </motion.div>
  );
}
