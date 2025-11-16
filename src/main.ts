import { i18n } from './i18n/i18n';
import { addMonthsUTC } from './utils/dates';
import { countDaysHandler } from './utils/count';

const startInput = document.getElementById('option1') as HTMLInputElement | null;
const endInput = document.getElementById('option2') as HTMLInputElement | null;
const locale: 'en' | 'es' = (navigator.language?.startsWith('es') ? 'es' : 'en');

function applyTranslations() {
    const subtitleEl = document.getElementById('subtitle');
    const submitEl = document.getElementById('submit');
    const subtitle2El = document.getElementById('subtitle2');
    const footerTextEl = document.getElementById('footerText');
    if (subtitleEl) {
        subtitleEl.textContent = i18n.t('subtitle');
    }

    if (submitEl) {
        submitEl.textContent = i18n.t('submit');
    }

    if (subtitle2El) {
        subtitle2El.textContent = i18n.t('subtitle2');
    }

    if (footerTextEl) {
        footerTextEl.textContent = i18n.t('footer');
    }

    document.documentElement.lang = i18n.getLanguage();


}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTranslations);
    document.addEventListener("DOMContentLoaded", hideResult)
} else {
    applyTranslations();
    hideResult();
}

function hideResult(){
    const resultBoxEl = document.getElementById("result-box")
    if (resultBoxEl) resultBoxEl.style.display = "none"
}


if (startInput && endInput) {
    const today = new Date();
    const ymdFromDate = (d: Date) =>
      `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
  
    startInput.value = ymdFromDate(new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())));
    endInput.value = ymdFromDate(addMonthsUTC(new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())), 1));
  
    const form = document.getElementById('form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      countDaysHandler(locale as 'en'|'es');
    });
  }


const clearButtonEl = document.getElementById("clear")
if (clearButtonEl) {
    clearButtonEl.textContent = i18n.t("clear")
    clearButtonEl.addEventListener("click", clearSelection)
}


function clearSelection() {
    const option1El = document.getElementById('option1');
    const option2El = document.getElementById('option2');
    if (option1El && option2El) {
        (option1El as HTMLInputElement).value = '';
        (option2El as HTMLInputElement).value = '';
    }
}