import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import de from "./locales/de.json";
import fa from "./locales/fa.json";

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
  fa: {
    translation: fa,
  },
};

const supportedLanguages = ["en", "de", "fa"];

const setDocumentLanguage = (language) => {
  const isPersian = language === "fa";

  document.documentElement.lang = language;
  document.documentElement.dir = isPersian ? "rtl" : "ltr";
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",

    supportedLngs: supportedLanguages,

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

i18n.on("languageChanged", setDocumentLanguage);

setDocumentLanguage(i18n.resolvedLanguage || "en");

export default i18n;