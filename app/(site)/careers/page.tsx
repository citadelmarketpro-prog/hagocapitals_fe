import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the HagoCapitals team. We're hiring engineers, designers, and financial professionals passionate about democratising investing. View open roles.",
  openGraph: {
    title: "Careers | HagoCapitals",
    description:
      "Join the HagoCapitals team. We're hiring engineers, designers, and financial professionals passionate about democratising investing.",
    url: "https://HagoCapitals.com/careers",
  },
  twitter: {
    title: "Careers | HagoCapitals",
    description:
      "Join the HagoCapitals team. We're hiring engineers, designers, and financial professionals passionate about democratising investing.",
  },
};

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeUp } from "@/components/ScrollReveal";

const LIFE_PHOTOS = [
  { src: "/images/team/team_3.jpg",   alt: "HagoCapitals team member at work" },
  { src: "/images/business-1.jpg",    alt: "HagoCapitals team collaborating" },
  { src: "/images/team/team_4.jpg",   alt: "HagoCapitals team member" },
  { src: "/images/team/team_5.jpg",   alt: "HagoCapitals team member" },
  { src: "/images/business-2.jpg",    alt: "HagoCapitals office" },
  { src: "/images/team/team_6.jpg",   alt: "HagoCapitals team member" },
];

const OPEN_ROLES = [
  { title: "Senior Frontend Engineer",      dept: "Engineering",  location: "Remote / Limassol, CY",  type: "Full-time" },
  { title: "Backend Engineer (Node.js)",    dept: "Engineering",  location: "Remote / London, UK",    type: "Full-time" },
  { title: "Product Designer (UI/UX)",      dept: "Design",       location: "Remote",                 type: "Full-time" },
  { title: "Compliance Officer",            dept: "Legal",        location: "Limassol, CY",            type: "Full-time" },
  { title: "Growth Marketing Manager",      dept: "Marketing",    location: "Remote / London, UK",    type: "Full-time" },
  { title: "Customer Support Specialist",   dept: "Support",      location: "Remote",                 type: "Full-time" },
];

const PERKS = [
  { title: "Remote-First Culture",   body: "Work from anywhere. We're a globally distributed team that trusts you to deliver." },
  { title: "Competitive Package",    body: "Market-rate salary, equity participation, and performance bonuses." },
  { title: "Health & Wellness",      body: "Comprehensive health insurance and a monthly wellness allowance." },
  { title: "Learning Budget",        body: "$2,000/year for conferences, courses, and books. We invest in your growth." },
  { title: "Flexible Hours",         body: "We measure output, not hours. Structure your day around how you work best." },
  { title: "Team Retreats",          body: "Annual company retreats where we come together to build, learn, and celebrate." },
];

const DEPT_COLORS: Record<string, string> = {
  Engineering: "bg-[#e8f0fe] text-[#1a4080]",
  Design:      "bg-[#fce8f3] text-[#8a1060]",
  Legal:       "bg-[#fef3e2] text-[#7a4a00]",
  Marketing:   "bg-[#edf4e5] text-[#3a6020]",
  Support:     "bg-[#f3e8fe] text-[#5a1080]",
};

export default function CareersPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-white border-b border-[#e5e5e5]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] pt-16 lg:pt-24 pb-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <p className="text-[12px] font-bold tracking-widest text-[#0c5c45] uppercase mb-4">
                We&apos;re hiring
              </p>
              <h1 className="text-[36px] lg:text-[56px] font-bold leading-[1.08] text-[#001011]">
                Build the future of social trading with us
              </h1>
              <p className="mt-5 text-[14px] lg:text-[15px] leading-[1.8] text-[#555555]">
                HagoCapitals is a fast-growing, globally distributed team passionate about
                making investing accessible to everyone. If you want to work on a product
                used by millions of people worldwide, we&apos;d love to hear from you.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-4/3">
              <Image
                src="/images/happy-business.jpg"
                alt="The HagoCapitals team at work"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Perks */}
      <section className="w-full bg-[#eaf5f0]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-14 lg:py-20">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-[#001011] mb-10">
            Why work at HagoCapitals?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((p, i) => (
              <div key={i} className="rounded-xl border border-[#e5e5e5] bg-white p-6 flex flex-col gap-2">
                <h3 className="text-[14px] font-bold text-[#001011]">{p.title}</h3>
                <p className="text-[13px] leading-[1.7] text-[#555555]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Life at HagoCapitals — photo gallery */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-14 lg:py-20">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-[#001011] mb-10">
            Life at HagoCapitals
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {LIFE_PHOTOS.map((p, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-square">
                <Image src={p.src} alt={p.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
        </section>

      {/* Open roles */}
      <section className="w-full bg-white border-t border-[#e5e5e5]">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-14 lg:py-20">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-[#001011] mb-10">
            Open positions
          </h2>
          <div className="flex flex-col divide-y divide-[#e5e5e5] border border-[#e5e5e5] rounded-2xl overflow-hidden">
            {OPEN_ROLES.map((r, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 bg-white hover:bg-[#fafaf6] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-full ${DEPT_COLORS[r.dept] ?? "bg-[#eaeadf] text-[#555555]"}`}>
                    {r.dept}
                  </span>
                  <span className="text-[14px] font-semibold text-[#001011]">{r.title}</span>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <span className="text-[12px] text-[#666666]">{r.location}</span>
                  <span className="text-[11px] text-[#888888]">{r.type}</span>
                  <button className="text-[12px] font-semibold text-[#0c5c45] hover:underline underline-offset-2">
                    Apply →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[13px] text-[#666666]">
            Don&apos;t see a role that fits? Send your CV to{" "}
            <a href="mailto:careers@HagoCapitals.com" className="text-[#0c5c45] hover:underline underline-offset-2">
              careers@HagoCapitals.com
            </a>{" "}
            and we&apos;ll keep you in mind for future openings.
          </p>
        </div>
      </FadeUp>
        </section>

      <Footer />
    </>
  );
}
