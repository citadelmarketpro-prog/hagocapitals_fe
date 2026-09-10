"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashNav from "@/components/DashNav";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

// ─── Option lists ────────────────────────────────────────────────────────────

const ID_TYPES = [
 { value: "passport", label: "Passport" },
 { value: "national_id", label: "National ID" },
 { value: "drivers_license", label: "Driver's Licence" },
 { value: "residence_permit", label: "Residence Permit" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "NGN", "GHS", "ZAR"];

const EMPLOYMENT_STATUSES = [
 "Employed (full-time)", "Employed (part-time)", "Self-employed",
 "Business owner", "Retired", "Student", "Unemployed",
];

const INCOME_SOURCES = [
 "Salary / Wages", "Business income", "Investments / Trading",
 "Rental income", "Pension", "Freelancing", "Family support", "Other",
];

const INDUSTRIES = [
 "Finance & Banking", "Technology", "Healthcare", "Education",
 "Real Estate", "Retail & Commerce", "Energy", "Manufacturing",
 "Government", "Arts & Media", "Other",
];

const EDUCATION_LEVELS = [
 "No formal education", "Primary school", "Secondary school",
 "Vocational / Technical", "Bachelor's degree", "Master's degree",
 "Doctoral degree",
];

const ANNUAL_AMOUNTS = [
 "Under $10,000", "$10,000 – $25,000", "$25,000 – $50,000",
 "$50,000 – $100,000", "$100,000 – $250,000", "Over $250,000",
];

const NET_WORTHS = [
 "Under $10,000", "$10,000 – $50,000", "$50,000 – $100,000",
 "$100,000 – $500,000", "$500,000 – $1,000,000", "Over $1,000,000",
];

// ─── Form state type ─────────────────────────────────────────────────────────

interface KycForm {
 // step 1
 title: string;
 first_name: string;
 last_name: string;
 date_of_birth: string;
 // step 2
 street_address: string;
 city: string;
 province: string;
 zipcode: string;
 phone: string;
 id_type: string;
 id_front: File | null;
 id_back: File | null;
 // step 3
 currency: string;
 employment_status: string;
 income_source: string;
 industry: string;
 education_level: string;
 annual_income: string;
 net_worth: string;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function KycPage() {
 const router = useRouter();
 const { user, refreshUser } = useAuth();
 const [step, setStep] = useState(1); // 1 | 2 | 3
 const [submitting, setSubmitting] = useState(false);
 const [error, setError] = useState("");

 const [form, setForm] = useState<KycForm>({
 title: "", first_name: "", last_name: "", date_of_birth: "",
 street_address: "", city: "", province: "", zipcode: "",
 phone: "", id_type: "", id_front: null, id_back: null,
 currency: "", employment_status: "", income_source: "",
 industry: "", education_level: "", annual_income: "", net_worth: "",
 });

 function set(key: keyof KycForm, value: string | File | null) {
 setForm((prev) => ({ ...prev, [key]: value }));
 }

 // ── Guard: redirect away only if KYC is already pending review or approved.
 // "not_submitted" and "rejected" are both allowed to (re)submit here.
 const kycLocked = user?.kyc_status === "submitted" || user?.kyc_status === "under_review" || user?.kyc_status === "approved";

 useEffect(() => {
 if (kycLocked) {
 router.replace("/dashboard");
 }
 }, [kycLocked, router]);

 if (kycLocked) return null;

 // ── Validation per step ──────────────────────────────────────────────────

 function step1Valid() {
 return form.first_name.trim() && form.last_name.trim() && form.date_of_birth;
 }

 function step2Valid() {
 return (
 form.street_address.trim() && form.city.trim() &&
 form.province.trim() && form.zipcode.trim() &&
 form.phone.trim() && form.id_type &&
 form.id_front && form.id_back
 );
 }

 function step3Valid() {
 return (
 form.currency && form.employment_status &&
 form.income_source && form.industry &&
 form.education_level && form.annual_income && form.net_worth
 );
 }

 // ── Submit ───────────────────────────────────────────────────────────────

 async function handleSubmit() {
 if (submitting) return;
 setError("");
 setSubmitting(true);

 try {
 const fd = new FormData();
 const textFields: Array<[string, string]> = [
 ["title", form.title],
 ["first_name", form.first_name],
 ["last_name", form.last_name],
 ["date_of_birth", form.date_of_birth],
 ["street_address", form.street_address],
 ["city", form.city],
 ["province", form.province],
 ["zipcode", form.zipcode],
 ["phone", form.phone],
 ["id_type", form.id_type],
 ["currency", form.currency],
 ["employment_status", form.employment_status],
 ["income_source", form.income_source],
 ["industry", form.industry],
 ["education_level", form.education_level],
 ["annual_income", form.annual_income],
 ["net_worth", form.net_worth],
 ];
 textFields.forEach(([k, v]) => { if (v) fd.append(k, v); });
 if (form.id_front) fd.append("id_front", form.id_front);
 if (form.id_back) fd.append("id_back", form.id_back);

 await api.patchForm("/api/auth/kyc/", fd);
 await refreshUser(); // update kyc_status in AuthContext so the guard clears
 router.push("/dashboard");
 } catch (err) {
 setError(err instanceof ApiError ? err.detail : "Submission failed. Please try again.");
 } finally {
 setSubmitting(false);
 }
 }

 const currentStepValid = step === 1 ? step1Valid() : step === 2 ? step2Valid() : step3Valid();

 return (
 <div className="min-h-screen bg-[#f5f5f0]">
 <DashNav />

 {/* ── Hero banner ── */}
 <div
 className="relative overflow-hidden px-6 py-10 md:py-14"
 style={{ backgroundColor: "#34d399" }}
 >
 <div className="max-w-275 mx-auto flex items-center justify-between gap-8">
 {/* Text */}
 <div>
 <h1 className="text-[28px] md:text-[36px] font-black text-[#001011] leading-tight mb-2">
 Complete Your Profile
 </h1>
 <p className="text-[14px] text-[#2a3a10] max-w-105 leading-relaxed">
 Help us keep your account secure and personalized by providing your
 information below.
 </p>
 </div>

 {/* Decorative avatars + stats */}
 <div className="hidden md:flex items-center gap-6 relative shrink-0">
 {/* Overlapping avatars */}
 <div className="flex items-center">
 <div className="w-14 h-14 rounded-full border-[3px] border-[#34d399] overflow-hidden shadow-lg z-30">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src="/images/avatar_1.png" alt="Trader" className="w-full h-full object-cover" />
 </div>
 <div className="w-16 h-16 rounded-full border-[3px] border-[#34d399] overflow-hidden shadow-lg -ml-4 z-20">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src="/images/avatar_2.png" alt="Trader" className="w-full h-full object-cover" />
 </div>
 <div className="w-14 h-14 rounded-full border-[3px] border-[#34d399] overflow-hidden shadow-lg -ml-4 z-10">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src="/images/avatar_3.png" alt="Trader" className="w-full h-full object-cover" />
 </div>
 </div>
 {/* Stats card */}
 <div className="bg-[#001011]/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/20">
 <div className="flex items-center gap-1.5 mb-0.5">
 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
 <polyline points="1,9 4,5 7,7 11,2" stroke="#001011" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
 <polyline points="8,2 11,2 11,5" stroke="#001011" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 <p className="text-[12px] font-semibold text-[#001011]/80">Verified users</p>
 </div>
 <p className="text-[28px] font-black text-[#001011] leading-none">118K+</p>
 <p className="text-[11px] text-[#001011]/60 mt-0.5">Trusted globally</p>
 </div>
 </div>
 </div>

 {/* Step progress pills */}
 <div className="max-w-275 mx-auto mt-6 flex items-center gap-2">
 {[1, 2, 3].map((s) => (
 <div key={s} className="flex items-center gap-2">
 <div
 className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
 s < step
 ? "bg-[#001011] text-[#34d399]"
 : s === step
 ? "bg-[#001011] text-white"
 : "bg-white/50 text-[#001011]"
 }`}
 >
 {s < step ? "✓" : s}
 </div>
 <span className={`text-[12px] font-medium hidden sm:block ${s === step ? "text-[#001011]" : "text-[#3a5010]"}`}>
 {s === 1 ? "Personal" : s === 2 ? "Address & ID" : "Financial"}
 </span>
 {s < 3 && <div className="w-8 h-px bg-[#001011]/30 mx-1" />}
 </div>
 ))}
 </div>
 </div>

 {/* ── Body ── */}
 <div className="max-w-275 mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

 {/* Form card */}
 <div className="bg-white shadow-sm">
 <div className="px-6 sm:px-10 py-8">

 {error && (
 <div className="mb-6 px-4 py-3 text-[13px] text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]">
 {error}
 </div>
 )}

 {step === 1 && <Step1 form={form} set={set} />}
 {step === 2 && <Step2 form={form} set={set} />}
 {step === 3 && <Step3 form={form} set={set} />}

 {/* Navigation buttons */}
 <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-[#f0f0ec]">
 {step > 1 && (
 <button
 type="button"
 onClick={() => setStep((s) => s - 1)}
 className="h-11 px-8 rounded-full border border-[#d4d4d4] text-[14px] font-medium text-[#001011] hover:bg-[#f5f5f5] transition-colors"
 >
 Back
 </button>
 )}
 {step < 3 ? (
 <button
 type="button"
 onClick={() => { if (currentStepValid) setStep((s) => s + 1); }}
 disabled={!currentStepValid}
 className="h-11 px-10 rounded-full text-[14px] font-bold text-white transition-all"
 style={{
 backgroundColor: "#06811d",
 opacity: currentStepValid ? 1 : 0.4,
 cursor: currentStepValid ? "pointer" : "not-allowed",
 }}
 >
 Next
 </button>
 ) : (
 <button
 type="button"
 onClick={handleSubmit}
 disabled={!currentStepValid || submitting}
 className="h-11 px-10 rounded-full text-[14px] font-bold text-white transition-all"
 style={{
 backgroundColor: "#06811d",
 opacity: currentStepValid && !submitting ? 1 : 0.4,
 cursor: currentStepValid && !submitting ? "pointer" : "not-allowed",
 }}
 >
 {submitting ? "Submitting…" : "Submit"}
 </button>
 )}
 </div>
 </div>
 </div>

 {/* Privacy sidebar */}
 <PrivacySidebar />
 </div>
 </div>
 );
}

// ─── Step 1 — Personal info ──────────────────────────────────────────────────

function Step1({ form, set }: { form: KycForm; set: (k: keyof KycForm, v: string) => void }) {
 const fields: Array<{ num: number; label: string; key: keyof KycForm; type?: string; placeholder?: string; isSelect?: boolean; options?: string[] }> = [
 { num: 1, label: "Title", key: "title", isSelect: true, options: ["Mr", "Mrs", "Ms", "Dr", "Prof"] },
 { num: 2, label: "First Name", key: "first_name", placeholder: "Enter first name" },
 { num: 3, label: "Last Name", key: "last_name", placeholder: "Enter last name" },
 { num: 4, label: "Date of Birth", key: "date_of_birth", type: "date" },
 ];

 return (
 <div className="flex flex-col gap-6">
 {fields.map(({ num, label, key, type, placeholder, isSelect, options }) => (
 <FieldRow key={key} num={num} label={label}>
 {isSelect ? (
 <KycSelect
 value={form[key] as string}
 onChange={(v) => set(key, v)}
 placeholder={`Select ${label.toLowerCase()}`}
 options={(options ?? []).map((o) => ({ value: o, label: o }))}
 />
 ) : (
 <KycInput
 type={type ?? "text"}
 placeholder={placeholder}
 value={form[key] as string}
 onChange={(v) => set(key, v)}
 />
 )}
 </FieldRow>
 ))}
 </div>
 );
}

// ─── Step 2 — Address & ID ────────────────────────────────────────────────────

function Step2({ form, set }: { form: KycForm; set: (k: keyof KycForm, v: string | File | null) => void }) {
 const frontRef = useRef<HTMLInputElement>(null);
 const backRef = useRef<HTMLInputElement>(null);

 return (
 <div className="flex flex-col gap-6">
 <FieldRow num={1} label="Street Address">
 <KycInput placeholder="123 Main Street" value={form.street_address} onChange={(v) => set("street_address", v)} />
 </FieldRow>
 <FieldRow num={2} label="City">
 <KycInput placeholder="Enter city" value={form.city} onChange={(v) => set("city", v)} />
 </FieldRow>
 <FieldRow num={3} label="Province / State">
 <KycInput placeholder="Enter province or state" value={form.province} onChange={(v) => set("province", v)} />
 </FieldRow>
 <FieldRow num={4} label="Zipcode">
 <KycInput placeholder="Enter zipcode" value={form.zipcode} onChange={(v) => set("zipcode", v)} />
 </FieldRow>
 <FieldRow num={5} label="Phone">
 <KycInput type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={(v) => set("phone", v)} />
 </FieldRow>
 <FieldRow num={6} label="Identification Type">
 <KycSelect
 value={form.id_type}
 onChange={(v) => set("id_type", v)}
 placeholder="Select identification type"
 options={ID_TYPES}
 />
 </FieldRow>

 {/* Upload boxes */}
 <FieldRow num={7} label="Upload ID Documents">
 <div className="grid grid-cols-2 gap-3">
 {/* Front */}
 <button
 type="button"
 onClick={() => frontRef.current?.click()}
 className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[#d4d4d4] bg-[#fafaf7] hover:border-[#06811d] hover:bg-[#eaf5f0] transition-all gap-1.5 rounded-2xl"
 >
 {form.id_front ? (
 <>
 <span className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#16a34a] text-[16px]">✓</span>
 <span className="text-[11px] font-medium text-[#16a34a] text-center px-2 truncate w-full">{form.id_front.name}</span>
 </>
 ) : (
 <>
 <UploadIcon />
 <span className="text-[12px] font-semibold text-[#555555]">Front of ID</span>
 <span className="text-[10px] text-[#aaaaaa]">JPG, PNG or PDF</span>
 </>
 )}
 </button>
 <input ref={frontRef} type="file" accept="image/*,.pdf" className="hidden"
 onChange={(e) => set("id_front", e.target.files?.[0] ?? null)} />

 {/* Back */}
 <button
 type="button"
 onClick={() => backRef.current?.click()}
 className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[#d4d4d4] bg-[#fafaf7] hover:border-[#06811d] hover:bg-[#eaf5f0] transition-all gap-1.5 rounded-2xl"
 >
 {form.id_back ? (
 <>
 <span className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#16a34a] text-[16px]">✓</span>
 <span className="text-[11px] font-medium text-[#16a34a] text-center px-2 truncate w-full">{form.id_back.name}</span>
 </>
 ) : (
 <>
 <UploadIcon />
 <span className="text-[12px] font-semibold text-[#555555]">Back of ID</span>
 <span className="text-[10px] text-[#aaaaaa]">JPG, PNG or PDF</span>
 </>
 )}
 </button>
 <input ref={backRef} type="file" accept="image/*,.pdf" className="hidden"
 onChange={(e) => set("id_back", e.target.files?.[0] ?? null)} />
 </div>
 </FieldRow>
 </div>
 );
}

// ─── Step 3 — Financial background ───────────────────────────────────────────

function Step3({ form, set }: { form: KycForm; set: (k: keyof KycForm, v: string) => void }) {
 return (
 <div className="flex flex-col gap-6">
 <FieldRow num={1} label="Currency">
 <KycSelect value={form.currency} onChange={(v) => set("currency", v)}
 placeholder="Select currency" options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
 </FieldRow>
 <FieldRow num={2} label="Status of Employment">
 <KycSelect value={form.employment_status} onChange={(v) => set("employment_status", v)}
 placeholder="Select employment status" options={EMPLOYMENT_STATUSES.map((s) => ({ value: s, label: s }))} />
 </FieldRow>
 <FieldRow num={3} label="Source of Income">
 <KycSelect value={form.income_source} onChange={(v) => set("income_source", v)}
 placeholder="Select income source" options={INCOME_SOURCES.map((s) => ({ value: s, label: s }))} />
 </FieldRow>
 <FieldRow num={4} label="Industry">
 <KycSelect value={form.industry} onChange={(v) => set("industry", v)}
 placeholder="Select industry" options={INDUSTRIES.map((s) => ({ value: s, label: s }))} />
 </FieldRow>
 <FieldRow num={5} label="Level of Education">
 <KycSelect value={form.education_level} onChange={(v) => set("education_level", v)}
 placeholder="Select education level" options={EDUCATION_LEVELS.map((s) => ({ value: s, label: s }))} />
 </FieldRow>
 <FieldRow num={6} label="Annual Amount (USD)">
 <KycSelect value={form.annual_income} onChange={(v) => set("annual_income", v)}
 placeholder="Select annual amount" options={ANNUAL_AMOUNTS.map((s) => ({ value: s, label: s }))} />
 </FieldRow>
 <FieldRow num={7} label="Estimated Net Worth (USD)">
 <KycSelect value={form.net_worth} onChange={(v) => set("net_worth", v)}
 placeholder="Select net worth" options={NET_WORTHS.map((s) => ({ value: s, label: s }))} />
 </FieldRow>
 </div>
 );
}

// ─── Reusable field components ───────────────────────────────────────────────

function FieldRow({ num, label, children }: { num: number; label: string; children: React.ReactNode }) {
 return (
 <div className="flex gap-4 items-start">
 <div className="w-7 h-7 rounded-full bg-[#06811d]/20 border border-[#06811d]/40 flex items-center justify-center text-[11px] font-bold text-[#06811d] shrink-0 mt-[30px]">
 {num}
 </div>
 <div className="flex-1">
 <label className="block text-[13px] font-semibold text-[#001011] mb-2">
 {label}
 </label>
 {children}
 </div>
 </div>
 );
}

function KycInput({
 type = "text",
 placeholder,
 value,
 onChange,
}: {
 type?: string;
 placeholder?: string;
 value: string;
 onChange: (v: string) => void;
}) {
 return (
 <input
 type={type}
 placeholder={placeholder}
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="w-full h-12 px-4 bg-[#f8f8f4] border border-[#e5e5e0] focus:border-[#06811d] focus:bg-white text-[14px] text-[#001011] placeholder-[#bbbbbb] outline-none transition-all"
 />
 );
}

function KycSelect({
 value,
 onChange,
 placeholder,
 options,
}: {
 value: string;
 onChange: (v: string) => void;
 placeholder: string;
 options: { value: string; label: string }[];
}) {
 return (
 <div className="relative">
 <select
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="w-full h-12 px-4 pr-10 bg-[#f8f8f4] border border-[#e5e5e0] focus:border-[#06811d] focus:bg-white text-[14px] text-[#001011] outline-none appearance-none transition-all cursor-pointer"
 >
 <option value="" disabled>{placeholder}</option>
 {options.map((o) => (
 <option key={o.value} value={o.value}>{o.label}</option>
 ))}
 </select>
 <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#888888]">
 <ChevronDownIcon />
 </div>
 </div>
 );
}

// ─── Privacy sidebar ─────────────────────────────────────────────────────────

const SECURITY_ITEMS = [
 {
 icon: "/icons/lock.svg",
 title: "SSL Encrypted",
 desc: "256-bit bank-grade encryption on all data",
 },
 {
 icon: "/icons/security-user.svg",
 title: "Identity Protected",
 desc: "Your documents are never shared with third parties",
 },
 {
 icon: "/icons/global.svg",
 title: "GDPR Compliant",
 desc: "Full compliance with global privacy regulations",
 },
 {
 icon: "/icons/24-support.svg",
 title: "24/7 Support",
 desc: "Our team is available around the clock to help",
 },
];

function PrivacySidebar() {
 return (
 <div className="lg:sticky lg:top-18 self-start space-y-4">
 {/* Main security card */}
 <div className="bg-white border border-[#e5e5e5] p-6">
 {/* Header */}
 <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#f0f0ec]">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <div className="w-10 h-10 rounded-xl bg-[#f5fce8] flex items-center justify-center shrink-0">
 <img src="/icons/lock-guard.png" alt="" className="w-5 h-5 object-contain" />
 </div>
 <div>
 <h3 className="text-[14px] font-bold text-[#001011] leading-tight">
 Privacy &amp; Security
 </h3>
 <p className="text-[11px] text-[#888888]">Bank-level protection</p>
 </div>
 </div>

 <ul className="flex flex-col gap-4">
 {SECURITY_ITEMS.map((item) => (
 <li key={item.title} className="flex items-start gap-3">
 <div className="w-8 h-8 rounded-lg bg-[#f5fce8] flex items-center justify-center shrink-0 mt-0.5">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src={item.icon} alt="" className="w-4 h-4 object-contain" style={{ filter: "invert(58%) sepia(47%) saturate(498%) hue-rotate(38deg) brightness(95%)" }} />
 </div>
 <div>
 <p className="text-[13px] font-semibold text-[#001011] leading-tight">{item.title}</p>
 <p className="text-[11px] text-[#888888] leading-snug mt-0.5">{item.desc}</p>
 </div>
 </li>
 ))}
 </ul>
 </div>

 {/* Terms note */}
 <div className="bg-[#f5fce8] border border-[#d4e8a0] p-4">
 <p className="text-[12px] text-[#445520] leading-relaxed">
 By submitting this form, you agree to our{" "}
 <span className="text-[#06811d] underline cursor-pointer font-medium">Terms of Service</span>
 {" "}and{" "}
 <span className="text-[#06811d] underline cursor-pointer font-medium">Privacy Policy</span>.
 </p>
 </div>
 </div>
 );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ChevronDownIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="4,6 8,10 12,6" />
 </svg>
 );
}

function UploadIcon() {
 return (
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#aaaaaa]">
 <polyline points="16,16 12,12 8,16" />
 <line x1="12" y1="12" x2="12" y2="21" />
 <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
 </svg>
 );
}
