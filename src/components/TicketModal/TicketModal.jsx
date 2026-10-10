import {
  FileText,
  LoaderCircle,
  Save,
  UserRound,
  X,
} from "lucide-react";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import ticketsTranslations from "../../i18n/tickets";

import "./TicketModal.css";

const defaultValues = {
  title: "",
  requester: "",
  category: "technical",
  priority: "medium",
  status: "open",
  assignee: "",
  description: "",
};

const categoryOptions = [
  "technical",
  "billing",
  "account",
  "support",
  "other",
];

const priorityOptions = [
  "low",
  "medium",
  "high",
  "urgent",
];

const statusOptions = [
  "open",
  "in-progress",
  "waiting",
  "resolved",
  "closed",
];

function TicketModal({
  isOpen,
  mode,
  ticket,
  onClose,
  onSubmit,
}) {
  const { i18n } =
    useTranslation();

  const language =
    i18n.language?.split("-")[0] ||
    "en";

  const text =
    ticketsTranslations[
      language
    ] || ticketsTranslations.en;

  const {
    register,
    reset,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (
      mode === "edit" &&
      ticket
    ) {
      reset({
        title: ticket.title || "",
        requester:
          ticket.requester || "",
        category:
          ticket.category ||
          "technical",
        priority:
          ticket.priority ||
          "medium",
        status:
          ticket.status || "open",
        assignee:
          ticket.assignee || "",
        description:
          ticket.description || "",
      });

      return;
    }

    reset(defaultValues);
  }, [
    isOpen,
    mode,
    ticket,
    reset,
  ]);

  const submitHandler =
    async (values) => {
      await onSubmit(values);
    };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="ticket-modal__backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div
        className="ticket-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="ticket-modal__header">
          <div>
            <span className="ticket-modal__eyebrow">
              {mode === "edit"
                ? text.editEyebrow
                : text.createEyebrow}
            </span>

            <h2 id="ticket-modal-title">
              {mode === "edit"
                ? text.editTitle
                : text.createTitle}
            </h2>
          </div>

          <button
            type="button"
            className="ticket-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="ticket-form"
          onSubmit={handleSubmit(
            submitHandler
          )}
          noValidate
        >
          <div className="ticket-form__grid">
            <div className="ticket-field ticket-field--wide">
              <label>
                <FileText size={15} />
                {text.fields.title}
              </label>

              <input
                type="text"
                placeholder={
                  text.placeholders.title
                }
                {...register("title", {
                  required:
                    text.validation.title,
                })}
              />

              {errors.title && (
                <span className="ticket-field__error">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="ticket-field">
              <label>
                <UserRound size={15} />
                {text.fields.requester}
              </label>

              <input
                type="text"
                placeholder={
                  text.placeholders.requester
                }
                {...register(
                  "requester",
                  {
                    required:
                      text.validation
                        .requester,
                  }
                )}
              />

              {errors.requester && (
                <span className="ticket-field__error">
                  {
                    errors.requester
                      .message
                  }
                </span>
              )}
            </div>

            <div className="ticket-field">
              <label>
                {text.fields.assignee}
              </label>

              <input
                type="text"
                placeholder={
                  text.placeholders.assignee
                }
                {...register(
                  "assignee",
                  {
                    required:
                      text.validation
                        .assignee,
                  }
                )}
              />

              {errors.assignee && (
                <span className="ticket-field__error">
                  {
                    errors.assignee
                      .message
                  }
                </span>
              )}
            </div>

            <div className="ticket-field">
              <label>
                {text.fields.category}
              </label>

              <select
                {...register(
                  "category",
                  {
                    required:
                      text.validation
                        .category,
                  }
                )}
              >
                {categoryOptions.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {
                        text.categories[
                          category
                        ]
                      }
                    </option>
                  )
                )}
              </select>

              {errors.category && (
                <span className="ticket-field__error">
                  {
                    errors.category
                      .message
                  }
                </span>
              )}
            </div>

            <div className="ticket-field">
              <label>
                {text.fields.priority}
              </label>

              <select
                {...register(
                  "priority",
                  {
                    required:
                      text.validation
                        .priority,
                  }
                )}
              >
                {priorityOptions.map(
                  (priority) => (
                    <option
                      key={priority}
                      value={priority}
                    >
                      {
                        text.priorities[
                          priority
                        ]
                      }
                    </option>
                  )
                )}
              </select>

              {errors.priority && (
                <span className="ticket-field__error">
                  {
                    errors.priority
                      .message
                  }
                </span>
              )}
            </div>

            <div className="ticket-field">
              <label>
                {text.fields.status}
              </label>

              <select
                {...register(
                  "status",
                  {
                    required:
                      text.validation
                        .status,
                  }
                )}
              >
                {statusOptions.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {
                        text.statuses[
                          status
                        ]
                      }
                    </option>
                  )
                )}
              </select>

              {errors.status && (
                <span className="ticket-field__error">
                  {
                    errors.status
                      .message
                  }
                </span>
              )}
            </div>

            <div className="ticket-field ticket-field--wide">
              <label>
                <FileText size={15} />
                {text.fields.description}
              </label>

              <textarea
                rows="5"
                placeholder={
                  text.placeholders
                    .description
                }
                {...register(
                  "description",
                  {
                    required:
                      text.validation
                        .description,
                    minLength: {
                      value: 10,
                      message:
                        text.validation
                          .description,
                    },
                  }
                )}
              />

              {errors.description && (
                <span className="ticket-field__error">
                  {
                    errors.description
                      .message
                  }
                </span>
              )}
            </div>
          </div>

          <div className="ticket-modal__footer">
            <button
              type="button"
              className="ticket-button ticket-button--ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {text.cancel}
            </button>

            <button
              type="submit"
              className="ticket-button ticket-button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="ticket-button__spinner"
                  />

                  {text.saving}
                </>
              ) : (
                <>
                  <Save size={17} />

                  {text.save}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketModal;