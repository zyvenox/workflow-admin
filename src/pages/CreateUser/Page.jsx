import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  CircleUserRound,
  LoaderCircle,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createUser } from "../../services/api";
import "./Page.css";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: "",
  role: "user",
  companyName: "",
  jobTitle: "",
};

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return (
    <span className="form-field__error">
      {message}
    </span>
  );
}

function CreateUser() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [submitError, setSubmitError] =
    useState("");

  const [createdUser, setCreatedUser] =
    useState(null);

  const schema = useMemo(
    () =>
      z.object({
        firstName: z
          .string()
          .trim()
          .min(
            2,
            t(
              "users.create.validation.firstName"
            )
          ),

        lastName: z
          .string()
          .trim()
          .min(
            2,
            t(
              "users.create.validation.lastName"
            )
          ),

        email: z.email({
          error: t(
            "users.create.validation.email"
          ),
        }),

        phone: z.union([
          z
            .string()
            .trim()
            .min(
              7,
              t(
                "users.create.validation.phone"
              )
            ),
          z.literal(""),
        ]),

        age: z
          .coerce
          .number()
          .int(
            t(
              "users.create.validation.ageInteger"
            )
          )
          .min(
            18,
            t(
              "users.create.validation.ageMin"
            )
          )
          .max(
            100,
            t(
              "users.create.validation.ageMax"
            )
          ),

        role: z.enum(
          ["admin", "moderator", "user"],
          {
            error: t(
              "users.create.validation.role"
            ),
          }
        ),

        companyName: z
          .string()
          .trim()
          .min(
            2,
            t(
              "users.create.validation.company"
            )
          ),

        jobTitle: z.union([
          z
            .string()
            .trim()
            .min(
              2,
              t(
                "users.create.validation.jobTitle"
              )
            ),
          z.literal(""),
        ]),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (values) => {
    setSubmitError("");
    setCreatedUser(null);

    try {
      const controller = new AbortController();

      const data = await createUser(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          age: values.age,
          role: values.role,
          company: {
            name: values.companyName,
            title:
              values.jobTitle ||
              "Team member",
          },
        },
        controller.signal
      );

      setCreatedUser(data);

      reset(defaultValues);
    } catch {
      setSubmitError(
        t("users.create.error.message")
      );
    }
  };

  if (createdUser) {
    return (
      <section className="create-user-page">
        <div className="create-user__success">
          <div className="create-user__success-icon">
            <Check size={28} strokeWidth={2.5} />
          </div>

          <span className="create-user__eyebrow">
            {t("users.create.success.eyebrow")}
          </span>

          <h1>
            {t("users.create.success.title")}
          </h1>

          <p>
            {t(
              "users.create.success.message",
              {
                name: `${createdUser.firstName} ${createdUser.lastName}`,
              }
            )}
          </p>

          <div className="create-user__success-user">
            <div className="create-user__success-avatar">
              {createdUser.firstName?.charAt(0)}
            </div>

            <div>
              <strong>
                {createdUser.firstName}{" "}
                {createdUser.lastName}
              </strong>

              <span>
                {createdUser.email}
              </span>
            </div>
          </div>

          <div className="create-user__success-actions">
            <button
              className="button button--primary"
              type="button"
              onClick={() => {
                setCreatedUser(null);
                reset(defaultValues);
              }}
            >
              {t(
                "users.create.success.createAnother"
              )}
            </button>

            <button
              className="button button--secondary"
              type="button"
              onClick={() =>
                navigate("/users")
              }
            >
              {t(
                "users.create.success.viewUsers"
              )}
            </button>
          </div>

          <div className="create-user__mock-note">
            {t(
              "users.create.success.mockNote"
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="create-user-page">
      <div className="create-user__topbar">
        <Link
          className="create-user__back"
          to="/users"
        >
          <ArrowLeft size={16} />
          {t("users.create.back")}
        </Link>
      </div>

      <div className="create-user__hero">
        <div>
          <span className="create-user__eyebrow">
            {t("users.create.eyebrow")}
          </span>

          <h1 className="create-user__title">
            {t("users.create.title")}
          </h1>

          <p className="create-user__subtitle">
            {t("users.create.subtitle")}
          </p>
        </div>
      </div>

      <form
        className="create-user-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="create-user-form__grid">
          <section className="form-card">
            <div className="form-card__header">
              <div className="form-card__icon">
                <CircleUserRound
                  size={18}
                />
              </div>

              <div>
                <h2>
                  {t(
                    "users.create.sections.personal.title"
                  )}
                </h2>

                <p>
                  {t(
                    "users.create.sections.personal.description"
                  )}
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="firstName">
                  {t(
                    "users.create.fields.firstName"
                  )}

                  <span>*</span>
                </label>

                <div
                  className={`form-input-wrapper ${
                    errors.firstName
                      ? "form-input-wrapper--error"
                      : ""
                  }`}
                >
                  <UserRound size={16} />

                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder={t(
                      "users.create.placeholders.firstName"
                    )}
                    {...register("firstName")}
                  />
                </div>

                <FieldError
                  message={
                    errors.firstName?.message
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="lastName">
                  {t(
                    "users.create.fields.lastName"
                  )}

                  <span>*</span>
                </label>

                <div
                  className={`form-input-wrapper ${
                    errors.lastName
                      ? "form-input-wrapper--error"
                      : ""
                  }`}
                >
                  <UserRound size={16} />

                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder={t(
                      "users.create.placeholders.lastName"
                    )}
                    {...register("lastName")}
                  />
                </div>

                <FieldError
                  message={
                    errors.lastName?.message
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">
                  {t(
                    "users.create.fields.email"
                  )}

                  <span>*</span>
                </label>

                <div
                  className={`form-input-wrapper ${
                    errors.email
                      ? "form-input-wrapper--error"
                      : ""
                  }`}
                >
                  <Mail size={16} />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t(
                      "users.create.placeholders.email"
                    )}
                    {...register("email")}
                  />
                </div>

                <FieldError
                  message={
                    errors.email?.message
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone">
                  {t(
                    "users.create.fields.phone"
                  )}

                  <small>
                    {t(
                      "users.create.optional"
                    )}
                  </small>
                </label>

                <div
                  className={`form-input-wrapper ${
                    errors.phone
                      ? "form-input-wrapper--error"
                      : ""
                  }`}
                >
                  <Phone size={16} />

                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={t(
                      "users.create.placeholders.phone"
                    )}
                    {...register("phone")}
                  />
                </div>

                <FieldError
                  message={
                    errors.phone?.message
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="age">
                  {t(
                    "users.create.fields.age"
                  )}

                  <span>*</span>
                </label>

                <div
                  className={`form-input-wrapper ${
                    errors.age
                      ? "form-input-wrapper--error"
                      : ""
                  }`}
                >
                  <UserRound size={16} />

                  <input
                    id="age"
                    type="number"
                    min="18"
                    max="100"
                    inputMode="numeric"
                    placeholder={t(
                      "users.create.placeholders.age"
                    )}
                    {...register("age")}
                  />
                </div>

                <FieldError
                  message={
                    errors.age?.message
                  }
                />
              </div>
            </div>
          </section>

          <section className="form-card">
            <div className="form-card__header">
              <div className="form-card__icon">
                <BriefcaseBusiness
                  size={18}
                />
              </div>

              <div>
                <h2>
                  {t(
                    "users.create.sections.work.title"
                  )}
                </h2>

                <p>
                  {t(
                    "users.create.sections.work.description"
                  )}
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field form-field--full">
                <label htmlFor="companyName">
                  {t(
                    "users.create.fields.company"
                  )}

                  <span>*</span>
                </label>

                <div
                  className={`form-input-wrapper ${
                    errors.companyName
                      ? "form-input-wrapper--error"
                      : ""
                  }`}
                >
                  <BriefcaseBusiness
                    size={16}
                  />

                  <input
                    id="companyName"
                    type="text"
                    autoComplete="organization"
                    placeholder={t(
                      "users.create.placeholders.company"
                    )}
                    {...register("companyName")}
                  />
                </div>

                <FieldError
                  message={
                    errors.companyName?.message
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="jobTitle">
                  {t(
                    "users.create.fields.jobTitle"
                  )}

                  <small>
                    {t(
                      "users.create.optional"
                    )}
                  </small>
                </label>

                <div
                  className={`form-input-wrapper ${
                    errors.jobTitle
                      ? "form-input-wrapper--error"
                      : ""
                  }`}
                >
                  <BriefcaseBusiness
                    size={16}
                  />

                  <input
                    id="jobTitle"
                    type="text"
                    autoComplete="organization-title"
                    placeholder={t(
                      "users.create.placeholders.jobTitle"
                    )}
                    {...register("jobTitle")}
                  />
                </div>

                <FieldError
                  message={
                    errors.jobTitle?.message
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="role">
                  {t(
                    "users.create.fields.role"
                  )}

                  <span>*</span>
                </label>

                <div
                  className={`form-input-wrapper ${
                    errors.role
                      ? "form-input-wrapper--error"
                      : ""
                  }`}
                >
                  <ShieldCheck size={16} />

                  <select
                    id="role"
                    {...register("role")}
                  >
                    <option value="user">
                      {t(
                        "users.roles.user"
                      )}
                    </option>

                    <option value="moderator">
                      {t(
                        "users.roles.moderator"
                      )}
                    </option>

                    <option value="admin">
                      {t(
                        "users.roles.admin"
                      )}
                    </option>
                  </select>
                </div>

                <FieldError
                  message={
                    errors.role?.message
                  }
                />
              </div>
            </div>
          </section>
        </div>

        {submitError && (
          <div className="form-submit-error">
            <div>!</div>

            <span>{submitError}</span>
          </div>
        )}

        <div className="create-user-form__footer">
          <div className="create-user-form__required">
            <span>*</span>

            {t(
              "users.create.required"
            )}
          </div>

          <div className="create-user-form__actions">
            <Link
              className="button button--secondary"
              to="/users"
            >
              {t("users.create.cancel")}
            </Link>

            <button
              className="button button--primary"
              type="submit"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    className="button__spinner"
                    size={16}
                  />

                  {t(
                    "users.create.saving"
                  )}
                </>
              ) : (
                <>
                  <Save size={16} />

                  {t(
                    "users.create.save"
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default CreateUser;