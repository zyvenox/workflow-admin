import {
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../hooks/useAuth";

import profileTranslations from "../../i18n/profile";

import "./Page.css";

function getProfileValues(user) {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    companyName: user?.companyName || "",
    jobTitle: user?.jobTitle || "",
    bio: user?.bio || "",
  };
}

function Page() {
  const { i18n } =
    useTranslation();

  const language =
    i18n.language?.split("-")[0] ||
    "en";

  const text =
    profileTranslations[
      language
    ] || profileTranslations.en;

  const {
    user,
    isDemoMode,
    updateProfile,
  } = useAuth();

  const [saved, setSaved] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  const {
    register,
    reset,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm({
    defaultValues:
      getProfileValues(user),
    mode: "onBlur",
  });

  useEffect(() => {
    reset(getProfileValues(user));
  }, [user, reset]);

  useEffect(() => {
    if (!saved) {
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        setSaved(false);
      }, 2500);

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [saved]);

  const fullName =
    [
      user?.firstName,
      user?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    user?.username ||
    "Demo User";

  const initials =
    (
      (user?.firstName?.[0] || "") +
      (user?.lastName?.[0] || "")
    ).toUpperCase() || "DU";

  const handleSave = async (
    values
  ) => {
    setSaveError("");
    setSaved(false);

    try {
      await updateProfile({
        ...values,
        firstName:
          values.firstName.trim(),
        lastName:
          values.lastName.trim(),
        email:
          values.email.trim(),
      });

      setSaved(true);
    } catch {
      setSaveError(text.error);
    }
  };

  return (
    <main className="profile-page">
      {/* Page header */}

      <header className="profile-hero">
        <div>
          <span className="profile-hero__eyebrow">
            {text.eyebrow}
          </span>

          <h1>{text.title}</h1>

          <p>{text.subtitle}</p>
        </div>

        {saved && (
          <div className="profile-save-status">
            <CheckCircle2 size={16} />
            {text.saved}
          </div>
        )}
      </header>

      <div className="profile-layout">
        {/* Main form */}

        <form
          className="profile-form"
          onSubmit={handleSubmit(
            handleSave
          )}
          noValidate
        >
          {/* Personal information */}

          <section className="profile-card">
            <div className="profile-card__header">
              <div className="profile-card__icon">
                <UserRound size={19} />
              </div>

              <div>
                <span>
                  {text.personal.eyebrow}
                </span>

                <h2>
                  {text.personal.title}
                </h2>

                <p>
                  {text.personal.description}
                </p>
              </div>
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <label htmlFor="profile-firstName">
                  {text.personal.firstName}
                  <span>*</span>
                </label>

                <input
                  id="profile-firstName"
                  className={
                    errors.firstName
                      ? "profile-input profile-input--error"
                      : "profile-input"
                  }
                  autoComplete="given-name"
                  placeholder={
                    text.personal.firstNamePlaceholder
                  }
                  {...register("firstName", {
                    required:
                      text.validation.firstName,
                  })}
                />

                {errors.firstName && (
                  <span className="profile-field__error">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className="profile-field">
                <label htmlFor="profile-lastName">
                  {text.personal.lastName}
                  <span>*</span>
                </label>

                <input
                  id="profile-lastName"
                  className={
                    errors.lastName
                      ? "profile-input profile-input--error"
                      : "profile-input"
                  }
                  autoComplete="family-name"
                  placeholder={
                    text.personal.lastNamePlaceholder
                  }
                  {...register("lastName", {
                    required:
                      text.validation.lastName,
                  })}
                />

                {errors.lastName && (
                  <span className="profile-field__error">
                    {errors.lastName.message}
                  </span>
                )}
              </div>

              <div className="profile-field">
                <label htmlFor="profile-email">
                  <Mail size={14} />
                  {text.personal.email}
                  <span>*</span>
                </label>

                <input
                  id="profile-email"
                  type="email"
                  className={
                    errors.email
                      ? "profile-input profile-input--error"
                      : "profile-input"
                  }
                  autoComplete="email"
                  placeholder={
                    text.personal.emailPlaceholder
                  }
                  {...register("email", {
                    required:
                      text.validation.email,
                    pattern: {
                      value:
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message:
                        text.validation.email,
                    },
                  })}
                />

                {errors.email && (
                  <span className="profile-field__error">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="profile-field">
                <label htmlFor="profile-phone">
                  <Phone size={14} />
                  {text.personal.phone}
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  className="profile-input"
                  autoComplete="tel"
                  placeholder={
                    text.personal.phonePlaceholder
                  }
                  {...register("phone")}
                />
              </div>

              <div className="profile-field profile-field--wide">
                <label htmlFor="profile-bio">
                  {text.personal.bio}
                </label>

                <textarea
                  id="profile-bio"
                  className="profile-textarea"
                  rows={4}
                  maxLength={300}
                  placeholder={
                    text.personal.bioPlaceholder
                  }
                  {...register("bio")}
                />
              </div>
            </div>
          </section>

          {/* Professional information */}

          <section className="profile-card">
            <div className="profile-card__header">
              <div className="profile-card__icon">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <span>
                  {text.work.eyebrow}
                </span>

                <h2>
                  {text.work.title}
                </h2>

                <p>
                  {text.work.description}
                </p>
              </div>
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <label htmlFor="profile-company">
                  {text.work.company}
                </label>

                <input
                  id="profile-company"
                  className="profile-input"
                  autoComplete="organization"
                  placeholder={
                    text.work.companyPlaceholder
                  }
                  {...register("companyName")}
                />
              </div>

              <div className="profile-field">
                <label htmlFor="profile-jobTitle">
                  {text.work.jobTitle}
                </label>

                <input
                  id="profile-jobTitle"
                  className="profile-input"
                  autoComplete="organization-title"
                  placeholder={
                    text.work.jobTitlePlaceholder
                  }
                  {...register("jobTitle")}
                />
              </div>
            </div>

            {saveError && (
              <div className="profile-form__error">
                {saveError}
              </div>
            )}

            <div className="profile-form__footer">
              <span className="profile-form__hint">
                * Required fields
              </span>

              <button
                type="submit"
                className="profile-save-button"
                disabled={
                  isSubmitting || !isDirty
                }
              >
                <Save size={16} />

                {isSubmitting
                  ? text.saving
                  : text.save}
              </button>
            </div>
          </section>
        </form>

        {/* Account summary */}

        <aside className="profile-sidebar">
          <section className="profile-card profile-account-card">
            <div className="profile-account-card__cover" />

            <div className="profile-account-card__body">
              <div className="profile-avatar">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={fullName}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <h2>{fullName}</h2>

              <p>
                {user?.email ||
                  "demo@workflow.local"}
              </p>

              <div className="profile-account-badges">
                <span className="profile-badge profile-badge--role">
                  <ShieldCheck size={13} />
                  {user?.role || "admin"}
                </span>

                <span className="profile-badge profile-badge--active">
                  <span />
                  {text.account.active}
                </span>
              </div>

              <div className="profile-account-details">
                <div>
                  <span>
                    {text.account.username}
                  </span>

                  <strong>
                    {user?.username || "demo"}
                  </strong>
                </div>

                <div>
                  <span>
                    {text.account.role}
                  </span>

                  <strong>
                    {user?.role || "admin"}
                  </strong>
                </div>

                <div>
                  <span>
                    {text.account.accountType}
                  </span>

                  <strong>
                    {isDemoMode
                      ? text.account.demo
                      : text.account.standard}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {isDemoMode && (
            <section className="profile-demo-note">
              <div className="profile-demo-note__icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>
                  {text.account.demo}
                </strong>

                <p>
                  {text.account.demoDescription}
                </p>
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}

export default Page;