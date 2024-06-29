import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import moment from 'moment';

import TRANSLATIONS_EN from './translations/en';
import TRANSLATIONS_UA from './translations/ua';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: TRANSLATIONS_EN
            },
            ua: {
                translation: TRANSLATIONS_UA
            }
        },
        interpolation: {
            format: function(value, format, lng) {
                if (format === 'uppercase') return value.toUpperCase();
                if(value instanceof Date) return moment(value).format(format);
                return value;
            }
        }
    });

i18n.changeLanguage("ua");

export default i18n;