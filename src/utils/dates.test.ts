import { describe, it, expect } from 'vitest';
import { parseDateOnlyYMD, daysBetween, addMonthsUTC } from './dates';

describe('parseDateOnlyYMD', () => {
  it('correctly parses valid YYYY-MM-DD strings into UTC Date objects', () => {
    const result = parseDateOnlyYMD('2023-05-15');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getUTCFullYear()).toBe(2023);
    expect(result?.getUTCMonth()).toBe(4); // May is month 4 (0-indexed)
    expect(result?.getUTCDate()).toBe(15);
  });

  it('correctly parses leap year dates', () => {
    const result = parseDateOnlyYMD('2024-02-29');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getUTCFullYear()).toBe(2024);
    expect(result?.getUTCMonth()).toBe(1); // February
    expect(result?.getUTCDate()).toBe(29);
  });

  it('correctly parses end of year dates', () => {
    const result = parseDateOnlyYMD('2023-12-31');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getUTCFullYear()).toBe(2023);
    expect(result?.getUTCMonth()).toBe(11); // December
    expect(result?.getUTCDate()).toBe(31);
  });

  it('returns null for invalid date format (missing dash)', () => {
    const result = parseDateOnlyYMD('20230515');
    expect(result).toBeNull();
  });

  it('returns null for invalid date format (wrong separator)', () => {
    const result = parseDateOnlyYMD('2023/05/15');
    expect(result).toBeNull();
  });

  it('returns null for invalid date format (incomplete date)', () => {
    const result = parseDateOnlyYMD('2023-05');
    expect(result).toBeNull();
  });

  it('returns null for invalid date value (February 30)', () => {
    const result = parseDateOnlyYMD('2021-02-30');
    expect(result).toBeNull();
  });

  it('returns null for invalid date value (February 29 in non-leap year)', () => {
    const result = parseDateOnlyYMD('2023-02-29');
    expect(result).toBeNull();
  });

  it('returns null for invalid month (month 13)', () => {
    const result = parseDateOnlyYMD('2023-13-15');
    expect(result).toBeNull();
  });

  it('returns null for invalid month (month 0)', () => {
    const result = parseDateOnlyYMD('2023-00-15');
    expect(result).toBeNull();
  });

  it('returns null for invalid day (day 0)', () => {
    const result = parseDateOnlyYMD('2023-05-00');
    expect(result).toBeNull();
  });

  it('returns null for invalid day (day 32)', () => {
    const result = parseDateOnlyYMD('2023-05-32');
    expect(result).toBeNull();
  });

  it('returns null for invalid day (April 31)', () => {
    const result = parseDateOnlyYMD('2023-04-31');
    expect(result).toBeNull();
  });
});

describe('daysBetween', () => {
  it('correctly calculates the absolute number of days between two dates', () => {
    const date1 = new Date(Date.UTC(2023, 0, 1)); // Jan 1, 2023
    const date2 = new Date(Date.UTC(2023, 0, 11)); // Jan 11, 2023
    expect(daysBetween(date1, date2)).toBe(10);
  });

  it('returns absolute value when first date is after second date', () => {
    const date1 = new Date(Date.UTC(2023, 0, 11)); // Jan 11, 2023
    const date2 = new Date(Date.UTC(2023, 0, 1)); // Jan 1, 2023
    expect(daysBetween(date1, date2)).toBe(10);
  });

  it('returns 0 for the same date', () => {
    const date = new Date(Date.UTC(2023, 5, 15));
    expect(daysBetween(date, date)).toBe(0);
  });

  it('correctly calculates days across months', () => {
    const date1 = new Date(Date.UTC(2023, 0, 25)); // Jan 25, 2023
    const date2 = new Date(Date.UTC(2023, 1, 5)); // Feb 5, 2023
    expect(daysBetween(date1, date2)).toBe(11);
  });

  it('correctly calculates days across years', () => {
    const date1 = new Date(Date.UTC(2022, 11, 25)); // Dec 25, 2022
    const date2 = new Date(Date.UTC(2023, 0, 5)); // Jan 5, 2023
    expect(daysBetween(date1, date2)).toBe(11);
  });

  it('correctly handles leap year calculations', () => {
    const date1 = new Date(Date.UTC(2024, 1, 28)); // Feb 28, 2024
    const date2 = new Date(Date.UTC(2024, 2, 1)); // Mar 1, 2024
    expect(daysBetween(date1, date2)).toBe(2); // Includes Feb 29
  });

  it('returns negative value when allowNegative is true and first date is after', () => {
    const date1 = new Date(Date.UTC(2023, 0, 11));
    const date2 = new Date(Date.UTC(2023, 0, 1));
    expect(daysBetween(date1, date2, true)).toBe(-10);
  });

  it('returns positive value when allowNegative is true and second date is after', () => {
    const date1 = new Date(Date.UTC(2023, 0, 1));
    const date2 = new Date(Date.UTC(2023, 0, 11));
    expect(daysBetween(date1, date2, true)).toBe(10);
  });
});

describe('addMonthsUTC', () => {
  it('correctly adds months to a date', () => {
    const base = new Date(Date.UTC(2023, 0, 15)); // Jan 15, 2023
    const result = addMonthsUTC(base, 3);
    expect(result.getUTCFullYear()).toBe(2023);
    expect(result.getUTCMonth()).toBe(3); // April
    expect(result.getUTCDate()).toBe(15);
  });

  it('correctly handles month rollover to next year', () => {
    const base = new Date(Date.UTC(2023, 10, 15)); // Nov 15, 2023
    const result = addMonthsUTC(base, 3);
    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(1); // February
    expect(result.getUTCDate()).toBe(15);
  });

  it('preserves the day when possible', () => {
    const base = new Date(Date.UTC(2023, 0, 31)); // Jan 31, 2023
    const result = addMonthsUTC(base, 1);
    expect(result.getUTCFullYear()).toBe(2023);
    expect(result.getUTCMonth()).toBe(1); // February
    expect(result.getUTCDate()).toBe(28); // Feb only has 28 days in 2023
  });

  it('handles day clamping when target month has fewer days', () => {
    const base = new Date(Date.UTC(2023, 0, 31)); // Jan 31, 2023
    const result = addMonthsUTC(base, 2);
    expect(result.getUTCFullYear()).toBe(2023);
    expect(result.getUTCMonth()).toBe(2); // March
    expect(result.getUTCDate()).toBe(31); // March has 31 days
  });

  it('handles day clamping in leap year February', () => {
    const base = new Date(Date.UTC(2024, 0, 31)); // Jan 31, 2024
    const result = addMonthsUTC(base, 1);
    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(1); // February
    expect(result.getUTCDate()).toBe(29); // 2024 is a leap year
  });

  it('correctly handles negative months (subtracting)', () => {
    const base = new Date(Date.UTC(2023, 5, 15)); // June 15, 2023
    const result = addMonthsUTC(base, -3);
    expect(result.getUTCFullYear()).toBe(2023);
    expect(result.getUTCMonth()).toBe(2); // March
    expect(result.getUTCDate()).toBe(15);
  });

  it('correctly handles negative months with year rollback', () => {
    const base = new Date(Date.UTC(2023, 1, 15)); // Feb 15, 2023
    const result = addMonthsUTC(base, -3);
    expect(result.getUTCFullYear()).toBe(2022);
    expect(result.getUTCMonth()).toBe(10); // November
    expect(result.getUTCDate()).toBe(15);
  });

  it('handles adding 0 months', () => {
    const base = new Date(Date.UTC(2023, 5, 15)); // June 15, 2023
    const result = addMonthsUTC(base, 0);
    expect(result.getUTCFullYear()).toBe(2023);
    expect(result.getUTCMonth()).toBe(5);
    expect(result.getUTCDate()).toBe(15);
  });

  it('handles adding 12 months', () => {
    const base = new Date(Date.UTC(2023, 5, 15)); // June 15, 2023
    const result = addMonthsUTC(base, 12);
    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(5); // June
    expect(result.getUTCDate()).toBe(15);
  });
});
