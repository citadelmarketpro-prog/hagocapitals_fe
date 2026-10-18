import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "./routing";

type Messages = Record<string, Record<string, string | Record<string, string>>>;

function mergeMessages(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };
  for (const ns of Object.keys(override)) {
    result[ns] = { ...(base[ns] ?? {}), ...override[ns] };
  }
  return result;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value ?? defaultLocale;
  const locale: Locale = (locales as readonly string[]).includes(raw)
    ? (raw as Locale)
    : defaultLocale;

  const enMessages: Messages = (await import(`../messages/en.json`)).default;

  if (locale === defaultLocale) {
    return { locale, messages: enMessages };
  }

  const localeMessages: Messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages: mergeMessages(enMessages, localeMessages),
  };
});
