"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════
   PHONE + COUNTRY CODE INPUT
   - Flag + dial-code dropdown (searchable), defaulting to the user's
     country via IP geolocation.
   - National number is capped at MAX_DIGITS and auto-formatted into a
     bracket/dash grouping as the user types, e.g. (100) 299-2923.
   - Reports the combined E.164-ish value ("+234...") to the parent via
     onChange — no translation strings here yet; this component was
     built while the broader site i18n pass is on hold, so labels are
     plain English for now.
════════════════════════════════════════════════════════════════ */

const MAX_DIGITS = 15;

// ISO2 → calling code. Intentionally the same country set/order as
// citadelsmarket's register page, so phone behaviour stays recognizable
// across the sibling apps.
const DIAL_CODES: Record<string, string> = {
  AF: "+93",  AL: "+355", DZ: "+213", AD: "+376", AO: "+244",
  AG: "+1",   AR: "+54",  AM: "+374", AU: "+61",  AT: "+43",
  AZ: "+994", BS: "+1",   BH: "+973", BD: "+880", BB: "+1",
  BY: "+375", BE: "+32",  BZ: "+501", BJ: "+229", BT: "+975",
  BO: "+591", BA: "+387", BW: "+267", BR: "+55",  BN: "+673",
  BG: "+359", BF: "+226", BI: "+257", CV: "+238", KH: "+855",
  CM: "+237", CA: "+1",   CF: "+236", TD: "+235", CL: "+56",
  CN: "+86",  CO: "+57",  KM: "+269", CG: "+242", CD: "+243",
  CR: "+506", HR: "+385", CU: "+53",  CY: "+357", CZ: "+420",
  DK: "+45",  DJ: "+253", DM: "+1",   DO: "+1",   EC: "+593",
  EG: "+20",  SV: "+503", GQ: "+240", ER: "+291", EE: "+372",
  SZ: "+268", ET: "+251", FJ: "+679", FI: "+358", FR: "+33",
  GA: "+241", GM: "+220", GE: "+995", DE: "+49",  GH: "+233",
  GR: "+30",  GD: "+1",   GT: "+502", GN: "+224", GW: "+245",
  GY: "+592", HT: "+509", HN: "+504", HU: "+36",  IS: "+354",
  IN: "+91",  ID: "+62",  IR: "+98",  IQ: "+964", IE: "+353",
  IL: "+972", IT: "+39",  JM: "+1",   JP: "+81",  JO: "+962",
  KZ: "+7",   KE: "+254", KI: "+686", KP: "+850", KR: "+82",
  KW: "+965", KG: "+996", LA: "+856", LV: "+371", LB: "+961",
  LS: "+266", LR: "+231", LY: "+218", LI: "+423", LT: "+370",
  LU: "+352", MG: "+261", MW: "+265", MY: "+60",  MV: "+960",
  ML: "+223", MT: "+356", MH: "+692", MR: "+222", MU: "+230",
  MX: "+52",  FM: "+691", MD: "+373", MC: "+377", MN: "+976",
  ME: "+382", MA: "+212", MZ: "+258", MM: "+95",  NA: "+264",
  NR: "+674", NP: "+977", NL: "+31",  NZ: "+64",  NI: "+505",
  NE: "+227", NG: "+234", NO: "+47",  OM: "+968", PK: "+92",
  PW: "+680", PA: "+507", PG: "+675", PY: "+595", PE: "+51",
  PH: "+63",  PL: "+48",  PT: "+351", QA: "+974", RO: "+40",
  RU: "+7",   RW: "+250", KN: "+1",   LC: "+1",   VC: "+1",
  WS: "+685", SM: "+378", ST: "+239", SA: "+966", SN: "+221",
  RS: "+381", SC: "+248", SL: "+232", SG: "+65",  SK: "+421",
  SI: "+386", SB: "+677", SO: "+252", ZA: "+27",  SS: "+211",
  ES: "+34",  LK: "+94",  SD: "+249", SR: "+597", SE: "+46",
  CH: "+41",  SY: "+963", TW: "+886", TJ: "+992", TZ: "+255",
  TH: "+66",  TL: "+670", TG: "+228", TO: "+676", TT: "+1",
  TN: "+216", TR: "+90",  TM: "+993", TV: "+688", UG: "+256",
  UA: "+380", AE: "+971", GB: "+44",  US: "+1",   UY: "+598",
  UZ: "+998", VU: "+678", VE: "+58",  VN: "+84",  YE: "+967",
  ZM: "+260", ZW: "+263",
};

const COUNTRY_CODES = Object.keys(DIAL_CODES);

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function countryName(iso2: string): string {
  return regionNames?.of(iso2) ?? iso2;
}

function flagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function formatNationalNumber(digits: string): string {
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}-${digits.slice(10)}`;
}

export default function PhoneCountryInput({
  onChange,
  error,
}: {
  /** Combined value, e.g. "+2341002992923" */
  onChange: (fullPhone: string) => void;
  error?: boolean;
}) {
  const [iso2, setIso2] = useState("US");
  const [digits, setDigits] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dialCode = DIAL_CODES[iso2] ?? "+?";

  // Auto-detect the user's country via IP so the dial code is pre-filled.
  useEffect(() => {
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const code = (data?.country_code || "").toUpperCase();
        if (code && DIAL_CODES[code]) setIso2(code);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    onChange(digits ? `${dialCode}${digits}` : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialCode, digits]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = COUNTRY_CODES.map((code) => ({
      code,
      name: countryName(code),
      dial: DIAL_CODES[code],
    }));
    if (!q) return list;
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q)
    );
  }, [search]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex h-[46px] border bg-white transition-colors ${
          error ? "border-[#dc2626]" : "border-[#e5e5e5] focus-within:border-[#06811d]"
        }`}
      >
        <button
          type="button"
          onClick={() => { setDropdownOpen((v) => !v); setSearch(""); }}
          className="flex items-center gap-1.5 px-3 border-r border-[#e5e5e5] hover:bg-[#fafafa] transition-colors shrink-0"
        >
          <span className="text-[16px] leading-none">{flagEmoji(iso2)}</span>
          <span className="text-[13px] text-[#555555] font-mono">{dialCode}</span>
          <ChevronDownIcon open={dropdownOpen} />
        </button>
        <input
          type="tel"
          inputMode="numeric"
          value={formatNationalNumber(digits)}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").slice(0, MAX_DIGITS);
            setDigits(raw);
          }}
          placeholder="(201) 555-0123"
          className="flex-1 min-w-0 px-4 text-[14px] text-[#001011] placeholder-[#aaaaaa] outline-none bg-transparent"
        />
      </div>

      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-full z-20 border border-[#e5e5e5] bg-white shadow-xl">
          <div className="p-2 border-b border-[#e5e5e5]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code"
              className="w-full h-[36px] px-3 text-[13px] border border-[#e5e5e5] outline-none focus:border-[#06811d]"
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filteredCountries.slice(0, 100).map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setIso2(c.code);
                  setDropdownOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] text-left transition-colors ${
                  c.code === iso2 ? "bg-[#06811d] text-white" : "hover:bg-[#fafafa] text-[#333333]"
                }`}
              >
                <span className="text-[15px] leading-none shrink-0">{flagEmoji(c.code)}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className={`font-mono text-[12px] shrink-0 ${c.code === iso2 ? "text-white" : "text-[#999999]"}`}>
                  {c.dial}
                </span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <p className="px-4 py-3 text-[13px] text-[#999999]">No countries found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="3,6 8,11 13,6" />
    </svg>
  );
}
