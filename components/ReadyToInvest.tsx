import Link from "next/link";
import { FadeUp, CARD_HOVER } from "@/components/ScrollReveal";

const steps = [
  {
    title: "Create Your Account.",
    description: "Join now to unlock options-focused copy trading.",
    icon: "/icons/man.svg",
  },
  {
    title: "Find Your Match",
    description:
      "Explore leaders known for success in options—contracts, spreads, tickers—you name it.",
    icon: "/icons/crown.svg",
  },
  {
    title: "Copy and grow",
    description:
      "Replicate trades, refine strategies, and learn—all while staying in control.",
    icon: "/icons/chart.svg",
  },
];

export default function ReadyToInvest() {
  return (
    <section className="w-full bg-[#0a0a0a]">
      <div className="max-w-[1440px] mx-auto">

        {/* ── Centered heading ── */}
        <FadeUp className="text-center px-6 pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16 border-t border-white/10">
          <h2 className="text-[26px] sm:text-[38px] lg:text-[52px] font-extrabold text-white leading-tight">
            Ready to Invest Smarter?
          </h2>
        </FadeUp>

        {/* ── 3 step cards — each reveals independently as it scrolls in ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 lg:px-[72px]">
          {steps.map((step, i) => (
            <FadeUp
              key={i}
              delay={(i % 3) * 0.06}
              distance={24}
              duration={0.4}
              whileHover={CARD_HOVER}
              className="flex flex-col items-center text-center px-8 py-12 lg:py-16 rounded-2xl bg-white/4 hover:bg-white/7"
            >
              <div className="mb-8 w-12 h-12">
                <img src={step.icon} alt="" className="w-full h-full object-contain invert opacity-90" />
              </div>
              <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold text-white leading-snug mb-4">
                {step.title}
              </h3>
              <p className="text-[14px] lg:text-[15px] leading-[1.75] text-gray-400">
                {step.description}
              </p>
            </FadeUp>
          ))}
        </div>

        {/* ── CTA button ── */}
        <FadeUp delay={0.15} className="flex justify-center px-6 pt-12 pb-14 lg:pt-14 lg:pb-20">
          <Link
            href="/sign-up"
            className="btn-fx btn-fx-primary inline-flex items-center gap-2 h-12 px-8 text-[14px] font-bold"
          >
            Get started now →
          </Link>
        </FadeUp>

      </div>
    </section>
  );
}
