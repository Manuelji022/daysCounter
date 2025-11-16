import en from './en.json';
import es from './es.json';

type Language = 'en' | 'es';
type TranslationsKey = typeof en;

const translations: Record<Language, TranslationsKey> = {
    en,
    es
}

class I18n {
    private currentLanguage: Language;

    constructor() {
        this.currentLanguage = this.detectLanguage();
    }

    private detectLanguage(): Language {
        // Check if we're in a browser environment
        if (typeof navigator !== 'undefined') {
            // Get browser's preferred language
            const browserLang = navigator.language || (navigator as any).userLanguage;
            
            // Check if browser language starts with 'es' (covers es, es-ES, es-MX, etc.)
            if (browserLang && browserLang.toLowerCase().startsWith('es')) {
                return 'es';
            }
            
            // Check navigator.languages array for Spanish preference
            if (navigator.languages) {
                for (const lang of navigator.languages) {
                    if (lang.toLowerCase().startsWith('es')) {
                        return 'es';
                    }
                }
            }
        }
        
        // Default to English if Spanish is not detected or not in browser environment
        return 'en';
    }

    setLanguage(language: Language) {
        this.currentLanguage = language;
    }

    getLanguage(): Language {
        return this.currentLanguage;
    }

    t(key: keyof TranslationsKey): string {
        return translations[this.currentLanguage][key] || key;
    }
}

export const i18n = new I18n();