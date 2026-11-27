/**
 * Company facts used across the site. Everything that states how long CapLink
 * Markets has been operating (footer copyright, "since …" copy, "years in
 * operation" stats) derives from FOUNDED_YEAR, so it updates itself every
 * January instead of being hard-coded.
 */
export const FOUNDED_YEAR = 2014;

export function currentYear(): number {
  return new Date().getFullYear();
}

/** e.g. 12 in 2026, 13 in 2027. */
export function yearsInOperation(): number {
  return currentYear() - FOUNDED_YEAR;
}

/**
 * Values for translation placeholders ({startYear}, {currentYear}, {years}).
 * Passed as strings so next-intl doesn't number-format them (2014 → "2,014").
 */
export function companyYearParams() {
  return {
    startYear: String(FOUNDED_YEAR),
    currentYear: String(currentYear()),
    years: String(yearsInOperation()),
  };
}
