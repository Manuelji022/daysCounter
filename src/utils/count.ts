// ui/count.ts
import { parseDateOnlyYMD, daysBetween } from "./dates"

function getInput(id: string): HTMLInputElement | null {
  const el = document.getElementById(id);
  return el instanceof HTMLInputElement ? el : null;
}

function showResult(){
    const resultBoxEl = document.getElementById("result-box")
    if (resultBoxEl) resultBoxEl.style.display = "flex"
}

function setResultText(text: string) {
  const el = document.getElementById('result');
  if (el) {
    el.textContent = text;
    el.setAttribute('aria-live', 'polite');
    showResult()
  }
}

function setErrorText(text: string) {
  const err = document.getElementById('error');
  if (err) {
    err.textContent = text;
  } else {
    // fallback
    console.error(text);
  }
}

// Simple pluralization helper (English + Spanish basic)
function daysLabel(count: number, locale: 'en' | 'es') {
  if (locale === 'es') return count === 1 ? 'día' : 'días';
  return count === 1 ? 'day' : 'days';
}


export function countDaysHandler(locale: 'en' | 'es' = 'en') {
  const startInput = getInput('option1');
  const endInput = getInput('option2');
  if (!startInput || !endInput) {
    setErrorText('Missing input elements');
    return;
  }

  const d1 = parseDateOnlyYMD(startInput.value);
  const d2 = parseDateOnlyYMD(endInput.value);

  if (!d1 || !d2) {
    setErrorText(locale === 'es' ? 'Formato de fecha no válido' : 'Invalid date format');
    setResultText('');
    return;
  }


  const diffDays = daysBetween(d1, d2, false);
  setErrorText('');
  setResultText(`${diffDays} ${daysLabel(diffDays, locale)}`);
}
