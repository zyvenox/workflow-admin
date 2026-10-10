import {
  Bell,
  Check,
  Languages,
  Laptop,
  Mail,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

import settingsTranslations from "../../i18n/setting";

import "./Page.css";

const PREFERENCES_KEY = "workflow_preferences";

const defaultPreferences = {
  email: true,
  tickets: true,
  projects: true,
};

const getInitialPreferences = () => {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);

    if (!stored) {
      return defaultPreferences;
    }

    const parsed = JSON.parse(stored);

    return {
      ...defaultPreferences,
      ...parsed,
    };
  } catch {
    return defaultPreferences;
  }
};

function Page() {
  const { i18n } = useTranslation();

  const language = i18n.language?.split("-")[0] || "en";

  const text = settingsTranslations[language] || settingsTranslations.en;

  const { user, isDemoMode } = useAuth();

  const { theme, changeTheme } = useTheme();

  const [preferences, setPreferences] = useState(getInitialPreferences);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));

    setSaved(true);

    const timer = window.setTimeout(() => {
      setSaved(false);
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [preferences]);

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Demo User";

  const initials =
    (
      (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")
    ).toUpperCase() || "DU";

  const themes = [
    {
      value: "light",
      label: text.appearance.light,
      icon: Sun,
    },
    {
      value: "dark",
      label: text.appearance.dark,
      icon: Moon,
    },
    {
      value: "system",
      label: text.appearance.system,
      icon: Laptop,
    },
  ];

  return (
    <main className="settings-page">
      {/* HERO */}

      <section className="settings-hero">
        <div>
          <span className="settings-hero__eyebrow">{text.eyebrow}</span>

          <h1>{text.title}</h1>

          <p>{text.subtitle}</p>
        </div>

        <div
          className={`settings-save-indicator ${
            saved ? "settings-save-indicator--visible" : ""
          }`}
        >
          <Check size={14} />

          {text.saved}
        </div>
      </section>

      <div className="settings-layout">
        {/* PROFILE */}

        <section className="settings-section">
          <div className="settings-section__header">
            <div className="settings-section__icon">
              <UserRound size={18} />
            </div>

            <div>
              <span>{text.profile.eyebrow}</span>

              <h2>{text.profile.title}</h2>

              <p>{text.profile.description}</p>
            </div>
          </div>

          <div className="settings-profile">
            <div className="settings-profile__identity">
              {user?.image ? (
                <img src={user.image} alt={fullName} />
              ) : (
                <div className="settings-profile__avatar">{initials}</div>
              )}

              <div>
                <strong>{fullName}</strong>

                <span>@{user?.username || "demo"}</span>
              </div>
            </div>

            <div className="settings-profile__grid">
              <div className="settings-info">
                <span>{text.profile.name}</span>

                <strong>{fullName}</strong>
              </div>

              <div className="settings-info">
                <span>{text.profile.username}</span>

                <strong>{user?.username || "demo"}</strong>
              </div>

              <div className="settings-info">
                <span>{text.profile.email}</span>

                <strong>{user?.email || "demo@workflow.local"}</strong>
              </div>

              <div className="settings-info">
                <span>{text.profile.role}</span>

                <strong>{user?.role || "admin"}</strong>
              </div>
            </div>
          </div>
        </section>

        <div className="settings-two-column">
          {/* APPEARANCE */}

          <section className="settings-section">
            <div className="settings-section__header">
              <div className="settings-section__icon">
                <Palette size={18} />
              </div>

              <div>
                <span>{text.appearance.eyebrow}</span>

                <h2>{text.appearance.title}</h2>

                <p>{text.appearance.description}</p>
              </div>
            </div>

            <div className="settings-theme-grid">
              {themes.map(({ value, label, icon: Icon }) => {
                const active = theme === value;

                return (
                  <button
                    key={value}
                    type="button"
                    className={`settings-theme ${
                      active ? "settings-theme--active" : ""
                    }`}
                    onClick={() => changeTheme(value)}
                  >
                    <span className="settings-theme__icon">
                      <Icon size={18} />
                    </span>

                    <span className="settings-theme__label">{label}</span>

                    {active && (
                      <span className="settings-theme__check">
                        <Check size={13} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* LANGUAGE */}

          <section className="settings-section">
            <div className="settings-section__header">
              <div className="settings-section__icon">
                <Languages size={18} />
              </div>

              <div>
                <span>{text.language.eyebrow}</span>

                <h2>{text.language.title}</h2>

                <p>{text.language.description}</p>
              </div>
            </div>

            <label className="settings-select-label">
              {text.language.label}

              <div className="settings-select-wrap">
                <Languages size={16} />

                <select value={language} onChange={handleLanguageChange}>
                  <option value="en">{text.language.english}</option>

                  <option value="de">{text.language.german}</option>

                  <option value="fa">{text.language.persian}</option>
                </select>
              </div>
            </label>
          </section>
        </div>

        {/* NOTIFICATIONS */}

        <section className="settings-section">
          <div className="settings-section__header">
            <div className="settings-section__icon">
              <Bell size={18} />
            </div>

            <div>
              <span>{text.notifications.eyebrow}</span>

              <h2>{text.notifications.title}</h2>

              <p>{text.notifications.description}</p>
            </div>
          </div>

          <div className="settings-preferences">
            <PreferenceRow
              icon={Mail}
              title={text.notifications.email}
              description={text.notifications.emailDescription}
              checked={preferences.email}
              onChange={() => togglePreference("email")}
            />

            <PreferenceRow
              icon={ShieldCheck}
              title={text.notifications.tickets}
              description={text.notifications.ticketsDescription}
              checked={preferences.tickets}
              onChange={() => togglePreference("tickets")}
            />

            <PreferenceRow
              icon={Monitor}
              title={text.notifications.projects}
              description={text.notifications.projectsDescription}
              checked={preferences.projects}
              onChange={() => togglePreference("projects")}
            />
          </div>
        </section>

        {/* SECURITY */}

        <section className="settings-section settings-security">
          <div className="settings-section__header">
            <div className="settings-section__icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <span>{text.security.eyebrow}</span>

              <h2>{text.security.title}</h2>

              <p>{text.security.description}</p>
            </div>
          </div>

          <div className="settings-security__card">
            <div className="settings-security__status">
              <span className="settings-security__dot" />

              <div>
                <strong>{text.security.mode}</strong>

                <p>{text.security.modeDescription}</p>
              </div>
            </div>

            <span
              className={`settings-security__badge ${
                isDemoMode ? "settings-security__badge--demo" : ""
              }`}
            >
              {isDemoMode ? "DEMO" : "ACTIVE"}
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

function PreferenceRow({ icon: Icon, title, description, checked, onChange }) {
  return (
    <label className="settings-preference">
      <div className="settings-preference__icon">
        <Icon size={17} />
      </div>

      <div className="settings-preference__content">
        <strong>{title}</strong>

        <span>{description}</span>
      </div>

      <input type="checkbox" checked={checked} onChange={onChange} />

      <span
        className={`settings-toggle ${
          checked ? "settings-toggle--active" : ""
        }`}
      >
        <span />
      </span>
    </label>
  );
}

export default Page;
