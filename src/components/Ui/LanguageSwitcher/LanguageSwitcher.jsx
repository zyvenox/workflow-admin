import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const languages = [
  {
    code: "en",
    label: "English",
    shortLabel: "EN",
  },
  {
    code: "de",
    label: "Deutsch",
    shortLabel: "DE",
  },
  {
    code: "fa",
    label: "فارسی",
    shortLabel: "FA",
  },
];

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);

  const currentLanguage =
    languages.find((language) => language.code === i18n.resolvedLanguage) ||
    languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="language-switcher" ref={containerRef}>
      <button
        className={`language-switcher__trigger ${
          isOpen ? "language-switcher__trigger--open" : ""
        }`}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("header.language")}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Globe size={17} strokeWidth={1.9} />

        <span className="language-switcher__current">
          {currentLanguage.shortLabel}
        </span>

        <ChevronDown
          className="language-switcher__chevron"
          size={14}
          strokeWidth={2}
        />
      </button>

      {isOpen && (
        <div className="language-switcher__menu" role="menu">
          <div className="language-switcher__menu-header">
            <span>{t("header.language")}</span>
          </div>

          <div className="language-switcher__options">
            {languages.map((language) => {
              const isActive =
                language.code === currentLanguage.code;

              return (
                <button
                  key={language.code}
                  className={`language-switcher__option ${
                    isActive
                      ? "language-switcher__option--active"
                      : ""
                  }`}
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    handleLanguageChange(language.code)
                  }
                >
                  <span className="language-switcher__option-left">
                    <span className="language-switcher__code">
                      {language.shortLabel}
                    </span>

                    <span className="language-switcher__label">
                      {language.label}
                    </span>
                  </span>

                  {isActive && (
                    <Check size={16} strokeWidth={2.4} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;