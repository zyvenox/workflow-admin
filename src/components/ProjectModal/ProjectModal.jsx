import {
  CalendarDays,
  CircleDollarSign,
  FileText,
  LoaderCircle,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import "./ProjectModal.css";

const defaultValues = {
  name: "",
  client: "",
  manager: "",
  status: "planning",
  priority: "medium",
  budget: "",
  deadline: "",
  progress: 0,
  description: "",
};

function ProjectModal({ isOpen, mode, project, onClose, onSubmit }) {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t("projects.form.validation.name")),

        client: z.string().trim().min(2, t("projects.form.validation.client")),

        manager: z
          .string()
          .trim()
          .min(2, t("projects.form.validation.manager")),

        status: z.enum(["planning", "in-progress", "review", "completed"], {
          error: t("projects.form.validation.status"),
        }),

        priority: z.enum(["low", "medium", "high"], {
          error: t("projects.form.validation.priority"),
        }),

        budget: z.coerce
          .number()
          .positive(t("projects.form.validation.budget")),

        deadline: z.string().min(1, t("projects.form.validation.deadline")),

        progress: z.coerce
          .number()
          .int(t("projects.form.validation.progressInteger"))
          .min(0, t("projects.form.validation.progressMin"))
          .max(100, t("projects.form.validation.progressMax")),

        description: z
          .string()
          .trim()
          .min(10, t("projects.form.validation.description")),
      }),
    [t],
  );

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && project) {
      reset({
        name: project.name || "",
        client: project.client || "",
        manager: project.manager || "",
        status: project.status || "planning",
        priority: project.priority || "medium",
        budget: project.budget ?? "",
        deadline: project.deadline || "",
        progress: project.progress ?? 0,
        description: project.description || "",
      });

      return;
    }

    reset(defaultValues);
  }, [isOpen, mode, project, reset]);

  const submitHandler = async (values) => {
    await onSubmit({
      ...values,
      budget: Number(values.budget),
      progress: Number(values.progress),
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="project-modal__backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="project-modal__header">
          <div>
            <span className="project-modal__eyebrow">
              {mode === "edit"
                ? t("projects.form.editEyebrow")
                : t("projects.form.createEyebrow")}
            </span>

            <h2 id="project-modal-title">
              {mode === "edit"
                ? t("projects.form.editTitle")
                : t("projects.form.createTitle")}
            </h2>
          </div>

          <button
            className="project-modal__close"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t("common.close")}
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="project-form"
          onSubmit={handleSubmit(submitHandler)}
          noValidate
        >
          <div className="project-form__grid">
            <div className="project-form__field">
              <label htmlFor="project-name">
                {t("projects.form.fields.name")}
                <span>*</span>
              </label>

              <div
                className={`project-form__input ${
                  errors.name ? "project-form__input--error" : ""
                }`}
              >
                <FileText size={16} />

                <input
                  id="project-name"
                  type="text"
                  placeholder={t("projects.form.placeholders.name")}
                  {...register("name")}
                />
              </div>

              {errors.name && <small>{errors.name.message}</small>}
            </div>

            <div className="project-form__field">
              <label htmlFor="project-client">
                {t("projects.form.fields.client")}
                <span>*</span>
              </label>

              <div
                className={`project-form__input ${
                  errors.client ? "project-form__input--error" : ""
                }`}
              >
                <UserRound size={16} />

                <input
                  id="project-client"
                  type="text"
                  placeholder={t("projects.form.placeholders.client")}
                  {...register("client")}
                />
              </div>

              {errors.client && <small>{errors.client.message}</small>}
            </div>

            <div className="project-form__field">
              <label htmlFor="project-manager">
                {t("projects.form.fields.manager")}
                <span>*</span>
              </label>

              <div
                className={`project-form__input ${
                  errors.manager ? "project-form__input--error" : ""
                }`}
              >
                <UserRound size={16} />

                <input
                  id="project-manager"
                  type="text"
                  placeholder={t("projects.form.placeholders.manager")}
                  {...register("manager")}
                />
              </div>

              {errors.manager && <small>{errors.manager.message}</small>}
            </div>

            <div className="project-form__field">
              <label htmlFor="project-budget">
                {t("projects.form.fields.budget")}
                <span>*</span>
              </label>

              <div
                className={`project-form__input ${
                  errors.budget ? "project-form__input--error" : ""
                }`}
              >
                <CircleDollarSign size={16} />

                <input
                  id="project-budget"
                  type="number"
                  min="1"
                  step="100"
                  placeholder={t("projects.form.placeholders.budget")}
                  {...register("budget")}
                />
              </div>

              {errors.budget && <small>{errors.budget.message}</small>}
            </div>

            <div className="project-form__field">
              <label htmlFor="project-status">
                {t("projects.form.fields.status")}
                <span>*</span>
              </label>

              <div className="project-form__input">
                <FileText size={16} />

                <select id="project-status" {...register("status")}>
                  <option value="planning">
                    {t("projects.status.planning")}
                  </option>

                  <option value="in-progress">
                    {t("projects.status.inProgress")}
                  </option>

                  <option value="review">{t("projects.status.review")}</option>

                  <option value="completed">
                    {t("projects.status.completed")}
                  </option>
                </select>
              </div>

              {errors.status && <small>{errors.status.message}</small>}
            </div>

            <div className="project-form__field">
              <label htmlFor="project-priority">
                {t("projects.form.fields.priority")}
                <span>*</span>
              </label>

              <div className="project-form__input">
                <FileText size={16} />

                <select id="project-priority" {...register("priority")}>
                  <option value="low">{t("projects.priority.low")}</option>

                  <option value="medium">
                    {t("projects.priority.medium")}
                  </option>

                  <option value="high">{t("projects.priority.high")}</option>
                </select>
              </div>
            </div>

            <div className="project-form__field">
              <label htmlFor="project-deadline">
                {t("projects.form.fields.deadline")}
                <span>*</span>
              </label>

              <div
                className={`project-form__input ${
                  errors.deadline ? "project-form__input--error" : ""
                }`}
              >
                <CalendarDays size={16} />

                <input
                  id="project-deadline"
                  type="date"
                  {...register("deadline")}
                />
              </div>

              {errors.deadline && <small>{errors.deadline.message}</small>}
            </div>

            <div className="project-form__field">
              <label htmlFor="project-progress">
                {t("projects.form.fields.progress")}
              </label>

              <div
                className={`project-form__input ${
                  errors.progress ? "project-form__input--error" : ""
                }`}
              >
                <FileText size={16} />

                <input
                  id="project-progress"
                  type="number"
                  min="0"
                  max="100"
                  {...register("progress")}
                />
              </div>

              {errors.progress && <small>{errors.progress.message}</small>}
            </div>

            <div className="project-form__field project-form__field--full">
              <label htmlFor="project-description">
                {t("projects.form.fields.description")}
                <span>*</span>
              </label>

              <div
                className={`project-form__textarea ${
                  errors.description ? "project-form__textarea--error" : ""
                }`}
              >
                <textarea
                  id="project-description"
                  rows="4"
                  placeholder={t("projects.form.placeholders.description")}
                  {...register("description")}
                />
              </div>

              {errors.description && (
                <small>{errors.description.message}</small>
              )}
            </div>
          </div>

          <div className="project-modal__footer">
            <button
              className="project-button project-button--secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("projects.form.cancel")}
            </button>

            <button
              className="project-button project-button--primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="project-button__spinner" size={16} />

                  {t("projects.form.saving")}
                </>
              ) : (
                <>
                  <Save size={16} />

                  {mode === "edit"
                    ? t("projects.form.saveChanges")
                    : t("projects.form.create")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;
