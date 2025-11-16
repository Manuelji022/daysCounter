import { describe, it, expect, beforeEach, vi } from 'vitest';
import { countDaysHandler } from './count';

describe('countDaysHandler', () => {
  beforeEach(() => {
    // Set up a clean DOM environment for each test
    document.body.innerHTML = `
      <input id="option1" type="text" value="" />
      <input id="option2" type="text" value="" />
      <div id="result"></div>
      <div id="error"></div>
      <div id="result-box" style="display: none;"></div>
    `;
  });

  it('correctly calculates and displays the day difference for valid dates', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');
    const errorEl = document.getElementById('error');
    const resultBoxEl = document.getElementById('result-box') as HTMLElement;

    startInput.value = '2023-01-01';
    endInput.value = '2023-01-11';

    countDaysHandler('en');

    expect(resultEl?.textContent).toBe('10 days');
    expect(errorEl?.textContent).toBe('');
    expect(resultBoxEl?.style.display).toBe('flex');
  });

  it('calculates absolute difference when end date is before start date', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');

    startInput.value = '2023-01-11';
    endInput.value = '2023-01-01';

    countDaysHandler('en');

    expect(resultEl?.textContent).toBe('10 days');
  });

  it('handles invalid date format in start date', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');
    const errorEl = document.getElementById('error');

    startInput.value = 'invalid-date';
    endInput.value = '2023-01-11';

    countDaysHandler('en');

    expect(errorEl?.textContent).toBe('Invalid date format');
    expect(resultEl?.textContent).toBe('');
  });

  it('handles invalid date format in end date', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');
    const errorEl = document.getElementById('error');

    startInput.value = '2023-01-01';
    endInput.value = '2023/01/11';

    countDaysHandler('en');

    expect(errorEl?.textContent).toBe('Invalid date format');
    expect(resultEl?.textContent).toBe('');
  });

  it('handles invalid date values (e.g., February 30)', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');
    const errorEl = document.getElementById('error');

    startInput.value = '2021-02-30';
    endInput.value = '2023-01-11';

    countDaysHandler('en');

    expect(errorEl?.textContent).toBe('Invalid date format');
    expect(resultEl?.textContent).toBe('');
  });

  it('applies correct pluralization for 1 day in English', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');

    startInput.value = '2023-01-01';
    endInput.value = '2023-01-02';

    countDaysHandler('en');

    expect(resultEl?.textContent).toBe('1 day');
  });

  it('applies correct pluralization for multiple days in English', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');

    startInput.value = '2023-01-01';
    endInput.value = '2023-01-06';

    countDaysHandler('en');

    expect(resultEl?.textContent).toBe('5 days');
  });

  it('applies correct pluralization for 0 days in English', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');

    startInput.value = '2023-01-01';
    endInput.value = '2023-01-01';

    countDaysHandler('en');

    expect(resultEl?.textContent).toBe('0 days');
  });

  it('applies correct pluralization for 1 day in Spanish', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');

    startInput.value = '2023-01-01';
    endInput.value = '2023-01-02';

    countDaysHandler('es');

    expect(resultEl?.textContent).toBe('1 día');
  });

  it('applies correct pluralization for multiple days in Spanish', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');

    startInput.value = '2023-01-01';
    endInput.value = '2023-01-06';

    countDaysHandler('es');

    expect(resultEl?.textContent).toBe('5 días');
  });

  it('displays error message in Spanish for invalid dates', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const errorEl = document.getElementById('error');

    startInput.value = 'invalid';
    endInput.value = '2023-01-11';

    countDaysHandler('es');

    expect(errorEl?.textContent).toBe('Formato de fecha no válido');
  });

  it('handles missing input elements gracefully', () => {
    document.body.innerHTML = ''; // Remove all elements
    
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    countDaysHandler('en');

    // Should set error text, which falls back to console.error when element is missing
    expect(consoleErrorSpy).toHaveBeenCalledWith('Missing input elements');
    
    consoleErrorSpy.mockRestore();
  });

  it('sets aria-live attribute on result element', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');

    startInput.value = '2023-01-01';
    endInput.value = '2023-01-11';

    countDaysHandler('en');

    expect(resultEl?.getAttribute('aria-live')).toBe('polite');
  });

  it('correctly handles leap year dates', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');

    startInput.value = '2024-02-28';
    endInput.value = '2024-03-01';

    countDaysHandler('en');

    expect(resultEl?.textContent).toBe('2 days'); // Includes Feb 29
  });

  it('handles dates spanning multiple years', () => {
    const startInput = document.getElementById('option1') as HTMLInputElement;
    const endInput = document.getElementById('option2') as HTMLInputElement;
    const resultEl = document.getElementById('result');

    startInput.value = '2022-12-25';
    endInput.value = '2023-01-05';

    countDaysHandler('en');

    expect(resultEl?.textContent).toBe('11 days');
  });
});
