import { useMemo, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import LanguageSwitcher from "../../components/UI/LanguageSwitcher/LanguageSwitcher";
import "./Page.css";

const defaultValues = {
  username: "",
  password: "",
};

function Login() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated } =
    useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const schema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .trim()
          .min(
            3,
            t("auth.validation.username")
          ),

        password: z
          .string()
          .min(
            6,
            t("auth.validation.password")
          ),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const handleDemoAccount = () => {
    setValue("username", "emilys", {
      shouldValidate: true,
    });

    setValue("password", "emilyspass", {
      shouldValidate: true,
    });

    setSubmitError("");
  };

  const onSubmit = async (values) => {
    setSubmitError("");

    try {
      await login(
        values.username,
        values.password
      );

      const from =
        location.state?.from;

      const destination =
        from?.pathname
          ? `${from.pathname}${from.search || ""}${from.hash || ""}`
          : "/dashboard";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      if (error.status === 401) {
        setSubmitError(
          t("auth.error.invalidCredentials")
        );
      } else {
        setSubmitError(
          t("auth.error.generic")
        );
      }
    }
  };

  return (
    <main className="login-page">
      <div className="login-page__glow login-page__glow--one" />
      <div className="login-page__glow login-page__glow--two" />

      <div className="login-page__topbar">
        <div className="login-brand">
          <div className="login-brand__logo">
            W
          </div>

          <div>
            <strong>
              {t("app.name")}
            </strong>

            <span>
              {t("app.adminPanel")}
            </span>
          </div>
        </div>

        <LanguageSwitcher />
      </div>

      <div className="login-page__content">
        <section className="login-visual">
          <div className="login-visual__badge">
            <ShieldCheck size={14} />

            {t("auth.secureAccess")}
          </div>

          <h1>
            {t("auth.visualTitle")}
          </h1>

          <p>
            {t("auth.visualSubtitle")}
          </p>

          <div className="login-visual__dashboard">
            <div className="mini-sidebar">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="mini-dashboard">
              <div className="mini-dashboard__top">
                <span />
                <span />
              </div>

              <div className="mini-dashboard__cards">
                <span />
                <span />
                <span />
              </div>

              <div className="mini-dashboard__chart">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card__header">
            <span className="login-card__eyebrow">
              {t("auth.eyebrow")}
            </span>

            <h2>
              {t("auth.title")}
            </h2>

            <p>
              {t("auth.subtitle")}
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit(
              onSubmit
            )}
            noValidate
          >
            <div className="login-field">
              <label htmlFor="username">
                {t("auth.fields.username")}
              </label>

              <div
                className={`login-input ${
                  errors.username
                    ? "login-input--error"
                    : ""
                }`}
              >
                <UserRound size={17} />

                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder={t(
                    "auth.placeholders.username"
                  )}
                  {...register(
                    "username"
                  )}
                />
              </div>

              {errors.username && (
                <span className="login-field__error">
                  {
                    errors.username
                      .message
                  }
                </span>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="password">
                {t("auth.fields.password")}
              </label>

              <div
                className={`login-input ${
                  errors.password
                    ? "login-input--error"
                    : ""
                }`}
              >
                <LockKeyhole
                  size={17}
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder={t(
                    "auth.placeholders.password"
                  )}
                  {...register(
                    "password"
                  )}
                />

                <button
                  className="login-input__toggle"
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? t(
                          "auth.hidePassword"
                        )
                      : t(
                          "auth.showPassword"
                        )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="login-field__error">
                  {
                    errors.password
                      .message
                  }
                </span>
              )}
            </div>

            {submitError && (
              <div className="login-error">
                <div>!</div>

                <span>
                  {submitError}
                </span>
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="login-submit__spinner" />

                  {t(
                    "auth.signingIn"
                  )}
                </>
              ) : (
                <>
                  <LogIn size={17} />

                  {t("auth.signIn")}

                  <ArrowRight
                    className="login-submit__arrow"
                    size={16}
                  />
                </>
              )}
            </button>

            <div className="login-demo">
              <div className="login-demo__icon">
                <ShieldCheck
                  size={15}
                />
              </div>

              <div>
                <strong>
                  {t(
                    "auth.demo.title"
                  )}
                </strong>

                <span>
                  {t(
                    "auth.demo.credentials"
                  )}
                </span>

                <button
                  type="button"
                  
                  onClick={
                    handleDemoAccount
                  }
                >
                  {t(
                    "auth.demo.useAccount"
                  )}
                </button>
              </div>
            </div>

            <button
              className="login-reset"
              type="button"
              onClick={() => {
                reset(defaultValues);
                setSubmitError("");
              }}
            >
              {t("auth.clearForm")}
            </button>
          </form>
        </section>
      </div>

      <p className="login-page__footer">
        {t("auth.footer")}
      </p>
    </main>
  );
}

export default Login;