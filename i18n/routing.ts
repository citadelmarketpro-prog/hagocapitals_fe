export const locales = [
  "en", "fr", "de", "es", "it", "pt", "nl", "pl", "ru", "ro",
  "sv", "no", "da", "fi", "el", "cs", "hu", "uk", "bg", "hr",
  "sr", "sk", "tr",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  pt: "Português",
  nl: "Nederlands",
  pl: "Polski",
  ru: "Русский",
  ro: "Română",
  sv: "Svenska",
  no: "Norsk",
  da: "Dansk",
  fi: "Suomi",
  el: "Ελληνικά",
  cs: "Čeština",
  hu: "Magyar",
  uk: "Українська",
  bg: "Български",
  hr: "Hrvatski",
  sr: "Српски",
  sk: "Slovenčina",
  tr: "Türkçe",
};
