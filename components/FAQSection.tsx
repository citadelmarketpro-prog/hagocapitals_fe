"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/ScrollReveal";

const faqs = [
  {
    question: "Do I need trading experience?",
    answer:
      "No, copy trading is designed for all experience levels. You simply select a trader to follow and HagoCapitals automatically mirrors their trades in your account—no prior market knowledge required.",
  },
  {
    question: "Can I stop copying anytime?",
    answer:
      "Yes. You can pause or stop copying any trader instantly from your dashboard. Any open positions can be kept, modified, or closed at your own discretion.",
  },
  {
    question: "Is my money safe?",
    answer:
      "Your funds always remain in your own linked brokerage account. HagoCapitals never holds or has direct access to your capital—we only execute trade signals on your behalf.",
  },
  {
    question: "What is the minimum investment?",
    answer:
      "You can start with as little as $100, though we recommend $500+ for better diversification across multiple traders and strategies.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) =>
    setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Centered header ── */}
        <FadeUp className="text-center px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16 border-t border-[#e8ead8]">
          <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-[#0a0a0a] leading-tight mb-4">
            Your Questions, answered
          </h2>
          <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#888888] leading-[1.7] max-w-[480px] mx-auto">
            Got questions about how copy trading works? We&apos;ve compiled answers to
            the most frequently asked questions.
          </p>
        </FadeUp>

        {/* ── FAQ accordion grid — each item reveals independently as it
             scrolls into view (mobile stacks single-column). ── */}
        <div className="px-6 lg:px-[72px] pb-14 lg:pb-20 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <FadeUp
                key={i}
                delay={(i % 2) * 0.06}
                distance={20}
                duration={0.35}
                className={[
                  "rounded-2xl overflow-hidden transition-colors duration-200",
                  isOpen
                    ? "bg-[#06811d]"
                    : "bg-[#eaf5f0]",
                ].join(" ")}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-6 text-left"
                >
                  <span
                    className={[
                      "text-[15px] sm:text-[16px] font-semibold leading-snug",
                      isOpen
                        ? "text-white"
                        : "text-[#06811d]",
                    ].join(" ")}
                  >
                    {faq.question}
                  </span>
                  <m.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    className={[
                      "shrink-0 text-[22px] font-light leading-none",
                      isOpen
                        ? "text-white"
                        : "text-[#06811d]",
                    ].join(" ")}
                  >
                    +
                  </m.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-[14px] leading-[1.75] text-[#c8dcd2]">
                          {faq.answer}
                        </p>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </FadeUp>
            );
          })}
        </div>

      </div>
    </section>
  );
}
