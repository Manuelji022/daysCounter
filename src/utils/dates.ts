const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Parse "YYYY-MM-DD" into a Date at UTC midnight. Returns null if invalid. */
export function parseDateOnlyYMD(value: string): Date | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    const day = Number(m[3]);
    // Basic validation of month/day ranges
    if (month < 0 || month > 11 || day < 1 || day > 31) return null;
    const d = new Date(Date.UTC(year, month, day));
    // Validate round-trip (e.g. invalid 2021-02-30)
    if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month || d.getUTCDate() !== day) {
      return null;
    }
    return d;
  }

/** Returns the integer number of days from a -> b.
 *  If allowNegative = false returns absolute number of days.
 *  Uses floor of difference in UTC-midnights (so same day => 0).
 */
export function daysBetween(a: Date, b: Date, allowNegative = false): number {
    const diffMs = b.getTime() - a.getTime();
    const diffDays = Math.floor(diffMs / MS_PER_DAY);
    return allowNegative ? diffDays : Math.abs(diffDays);
  }
  
  /** Add months to a date (preserving day when possible), returns new Date (UTC). */
  export function addMonthsUTC(base: Date, months: number): Date {
    const year = base.getUTCFullYear();
    const month = base.getUTCMonth();
    const day = base.getUTCDate();
    const targetMonth = month + months;
    const d = new Date(Date.UTC(year, targetMonth, 1)); // first day of target month
    const maxDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(day, maxDay));
    return d;
  }