import { i18n } from './i18n/i18n';

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

function showResult(){
    const resultBoxEl = document.getElementById("result-box")
    if (resultBoxEl) resultBoxEl.style.display = "flex"
}

const formEl = document.getElementById("form")
if (formEl) {
    formEl.addEventListener("submit", (e) => {
        e.preventDefault()
        countDays()}
    )
}



function countDays() {
    const option1El = document.getElementById('option1');
    const option2El = document.getElementById('option2');
    if (option1El && option2El) {
        
        const option1 = new Date((option1El as HTMLInputElement).value);
        const option2 = new Date((option2El as HTMLInputElement).value);
        if (isNaN(option1.getTime()) || isNaN(option2.getTime())) {
            alert('Invalid date');
            return;
        }
        const diffTime = Math.abs(option2.getTime() - option1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const resultEl = document.getElementById('result');
        if (resultEl) {
            resultEl.textContent = `${diffDays} ${i18n.t('days')}`;
            showResult()
        }
    }   
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