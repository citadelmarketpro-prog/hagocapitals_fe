"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

/* ── Countries ────────────────────────────────────────────────────── */
const COUNTRIES = [
  "Australia", "Austria", "Belgium", "Brazil", "Canada", "China", "Cyprus",
  "Denmark", "Finland", "France", "Germany", "Greece", "Hong Kong", "India",
  "Indonesia", "Ireland", "Israel", "Italy", "Japan", "Luxembourg", "Malaysia",
  "Malta", "Mexico", "Netherlands", "New Zealand", "Nigeria", "Norway",
  "Poland", "Portugal", "Saudi Arabia", "Singapore", "South Africa",
  "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Turkey",
  "United Arab Emirates", "United Kingdom", "United States",
];

export default function ContactUsPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "United States",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
          CONTACT US — form
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white">
        <FadeUp>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] pt-[120px] lg:pt-[150px] pb-16 lg:pb-24">
          <div className="text-center mb-12">
            <h1 className="text-[32px] lg:text-[46px] font-bold text-[#001011]">
              Contact Us
            </h1>
            <p className="mt-3 text-[14px] lg:text-[15px] text-[#555555]">
              Have a question? Send us a message and our team will get back to you shortly.
            </p>
          </div>

          <div className="max-w-[600px] mx-auto rounded-2xl border border-[#e5e5e5] bg-[#f4f4ef] p-8 lg:p-10">
            {submitted ? (
              <div className="text-center py-8 flex flex-col gap-4">
                <div className="w-14 h-14 rounded-full bg-[#06811d]/20 border border-[#06811d] flex items-center justify-center mx-auto">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#06811d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4,11 9,16 18,7" />
                  </svg>
                </div>
                <p className="text-[16px] font-bold text-[#001011]">
                  Message sent!
                </p>
                <p className="text-[13px] text-[#555555]">
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* First / Last name */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First Name">
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Last Name">
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    />
                  </FormField>
                </div>

                {/* Company / Country */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Company">
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Country">
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className={`${inputCls} cursor-pointer`}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                {/* Phone */}
                <FormField label="Phone Number">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </FormField>

                {/* Message */}
                <FormField label="Free text Message">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className={`${inputCls} resize-y`}
                  />
                </FormField>

                <button
                  type="submit"
                  className="w-full h-[50px] rounded-full text-[14px] font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#06811d", color: "#ffffff" }}
                >
                  Send message
                  <ArrowRightIcon />
                </button>
              </form>
            )}
          </div>
        </div>
      </FadeUp>
      </section>

      <ReadyToInvest />
      <Footer />
    </>
  );
}

/* ── Form helpers ─────────────────────────────────────────────────── */
const inputCls =
  "w-full h-[42px] px-4 rounded-lg border border-[#d8d8d8] bg-white text-[13px] text-[#001011] placeholder-[#aaaaaa] outline-none focus:border-[#06811d] focus:ring-1 focus:ring-[#06811d]/40 transition-colors";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#444444]">
        {label}
      </label>
      {children}
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="7" x2="12" y2="7" />
      <polyline points="8,3 12,7 8,11" />
    </svg>
  );
}
