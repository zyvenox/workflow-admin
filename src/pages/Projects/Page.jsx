import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ProjectModal from "../../components/ProjectModal/ProjectModal";
import { useProjects } from "../../context/ProjectsContext";
import "./Page.css";

const statusOptions = [
  {
    value: "",
    labelKey:
      "projects.filters.allStatuses",
  },
  {
    value: "planning",
    labelKey:
      "projects.status.planning",
  },
  {
    value: "in-progress",
    labelKey:
      "projects.status.inProgress",
  },
  {
    value: "review",
    labelKey:
      "projects.status.review",
  },
  {
    value: "completed",
    labelKey:
      "projects.status.completed",
  },
];

const statusTranslationKeys = {
  planning:
    "projects.status.planning",
  "in-progress":
    "projects.status.inProgress",
  review:
    "projects.status.review",
  completed:
    "projects.status.completed",
};

const priorityTranslationKeys = {
  low: "projects.priority.low",
  medium:
    "projects.priority.medium",
  high: "projects.priority.high",
};

function Projects() {
  const { t, i18n } =
    useTranslation();

  const {
    projects,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("create");

  const [
    selectedProject,
    setSelectedProject,
  ] = useState(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState(null);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    actionError,
    setActionError,
  ] = useState("");

  const filteredProjects =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return projects.filter(
        (project) => {
          const searchableText =
            [
              project.name,
              project.client,
              project.manager,
            ]
              .join(" ")
              .toLowerCase();

          const matchesSearch =
            !query ||
            searchableText.includes(
              query
            );

          const matchesStatus =
            !status ||
            project.status === status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      projects,
      search,
      status,
    ]);

  const totalBudget =
    projects.reduce(
      (total, project) =>
        total +
        Number(project.budget || 0),
      0
    );

  const activeProjects =
    projects.filter(
      (project) =>
        project.status ===
          "in-progress" ||
        project.status ===
          "review"
    ).length;

  const completedProjects =
    projects.filter(
      (project) =>
        project.status ===
        "completed"
    ).length;

  const formatCurrency =
    (value) => {
      return new Intl.NumberFormat(
        i18n.resolvedLanguage,
        {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }
      ).format(value);
    };

  const formatDate = (
    value
  ) => {
    return new Intl.DateTimeFormat(
      i18n.resolvedLanguage,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ).format(new Date(value));
  };

  const closeProjectModal =
    () => {
      if (actionLoading) {
        return;
      }

      setModalOpen(false);
      setSelectedProject(null);
      setActionError("");
    };

  const openCreateModal =
    () => {
      setModalMode("create");
      setSelectedProject(null);
      setActionError("");
      setModalOpen(true);
    };

  const openEditModal = (
    project
  ) => {
    setModalMode("edit");
    setSelectedProject(project);
    setActionError("");
    setModalOpen(true);
  };

  const handleProjectSubmit =
    async (projectData) => {
      setActionError("");
      setActionLoading(true);

      try {
        if (
          modalMode === "edit" &&
          selectedProject
        ) {
          await editProject(
            selectedProject.id,
            projectData
          );
        } else {
          await addProject(
            projectData
          );
        }

        setModalOpen(false);
        setSelectedProject(null);
      } catch {
        setActionError(
          t(
            "projects.form.submitError"
          )
        );

        throw new Error(
          "Project action failed."
        );
      } finally {
        setActionLoading(false);
      }
    };

  const handleDelete =
    async () => {
      if (!deleteTarget) {
        return;
      }

      setActionError("");
      setActionLoading(true);

      try {
        await removeProject(
          deleteTarget.id
        );

        setDeleteTarget(null);
      } catch {
        setActionError(
          t(
            "projects.delete.error"
          )
        );
      } finally {
        setActionLoading(false);
      }
    };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setFilterOpen(false);
  };

  return (
    <section className="projects-page">
      <div className="projects-page__hero">
        <div>
          <span className="projects-page__eyebrow">
            {t(
              "projects.eyebrow"
            )}
          </span>

          <h1 className="projects-page__title">
            {t(
              "projects.title"
            )}
          </h1>

          <p className="projects-page__subtitle">
            {t(
              "projects.subtitle"
            )}
          </p>
        </div>

        <button
          className="projects-page__create"
          type="button"
          onClick={
            openCreateModal
          }
        >
          <Plus size={17} />

          {t(
            "projects.create"
          )}
        </button>
      </div>

      <div className="projects-stats">
        <article className="projects-stat">
          <div className="projects-stat__icon">
            <BriefcaseBusiness
              size={19}
            />
          </div>

          <div>
            <span>
              {t(
                "projects.stats.total"
              )}
            </span>

            <strong>
              {projects.length}
            </strong>
          </div>
        </article>

        <article className="projects-stat">
          <div className="projects-stat__icon">
            <CircleDollarSign
              size={19}
            />
          </div>

          <div>
            <span>
              {t(
                "projects.stats.budget"
              )}
            </span>

            <strong>
              {formatCurrency(
                totalBudget
              )}
            </strong>
          </div>
        </article>

        <article className="projects-stat">
          <div className="projects-stat__icon">
            <CalendarDays size={19} />
          </div>

          <div>
            <span>
              {t(
                "projects.stats.active"
              )}
            </span>

            <strong>
              {activeProjects}
            </strong>
          </div>
        </article>

        <article className="projects-stat">
          <div className="projects-stat__icon">
            <CheckCircle2
              size={19}
            />
          </div>

          <div>
            <span>
              {t(
                "projects.stats.completed"
              )}
            </span>

            <strong>
              {completedProjects}
            </strong>
          </div>
        </article>
      </div>

      <div className="projects-toolbar">
        <div className="projects-search">
          <Search size={17} />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder={t(
              "projects.searchPlaceholder"
            )}
            aria-label={t(
              "projects.searchPlaceholder"
            )}
          />

          {search && (
            <button
              className="projects-search__clear"
              type="button"
              onClick={() =>
                setSearch("")
              }
              aria-label={t(
                "common.clear"
              )}
            >
              ×
            </button>
          )}
        </div>

        <div className="projects-toolbar__actions">
          <div className="projects-filter">
            <button
              className={`projects-filter__button ${
                filterOpen
                  ? "projects-filter__button--active"
                  : ""
              } ${
                status
                  ? "projects-filter__button--selected"
                  : ""
              }`}
              type="button"
              onClick={() =>
                setFilterOpen(
                  (previous) =>
                    !previous
                )
              }
            >
              <span>
                {t(
                  "projects.filters.title"
                )}
              </span>

              {status && (
                <span className="projects-filter__dot" />
              )}
            </button>

            {filterOpen && (
              <div className="projects-filter__menu">
                {statusOptions.map(
                  (option) => (
                    <button
                      key={
                        option.value ||
                        "all"
                      }
                      className={`projects-filter__option ${
                        status ===
                        option.value
                          ? "projects-filter__option--active"
                          : ""
                      }`}
                      type="button"
                      onClick={() => {
                        setStatus(
                          option.value
                        );
                        setFilterOpen(
                          false
                        );
                      }}
                    >
                      {t(
                        option.labelKey
                      )}
                    </button>
                  )
                )}

                {(search ||
                  status) && (
                  <button
                    className="projects-filter__clear"
                    type="button"
                    onClick={
                      clearFilters
                    }
                  >
                    {t(
                      "projects.filters.clear"
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          <span className="projects-results">
            {t(
              "projects.results",
              {
                count:
                  filteredProjects.length,
              }
            )}
          </span>
        </div>
      </div>

      {actionError && (
        <div className="projects-action-error">
          <span>!</span>

          <p>{actionError}</p>

          <button
            type="button"
            onClick={() =>
              setActionError("")
            }
          >
            ×
          </button>
        </div>
      )}

      <div className="projects-card">
        <div className="projects-card__header">
          <div>
            <h2>
              {t(
                "projects.table.title"
              )}
            </h2>

            <span>
              {t(
                "projects.table.subtitle"
              )}
            </span>
          </div>

          <span className="projects-count">
            {filteredProjects.length}
          </span>
        </div>

        {loading ? (
          <div className="projects-loading">
            {Array.from(
              { length: 6 },
              (_, index) => (
                <div
                  className="project-skeleton-row"
                  key={index}
                >
                  <span className="project-skeleton project-skeleton--main" />

                  <span className="project-skeleton project-skeleton--short" />

                  <span className="project-skeleton project-skeleton--medium" />

                  <span className="project-skeleton project-skeleton--tiny" />

                  <span className="project-skeleton project-skeleton--action" />
                </div>
              )
            )}
          </div>
        ) : error ? (
          <div className="projects-state">
            <div className="projects-state__icon">
              !
            </div>

            <h3>
              {t(
                "projects.error.title"
              )}
            </h3>

            <p>{error}</p>
          </div>
        ) : filteredProjects.length ===
          0 ? (
          <div className="projects-state">
            <div className="projects-state__icon">
              <BriefcaseBusiness
                size={20}
              />
            </div>

            <h3>
              {t(
                "projects.empty.title"
              )}
            </h3>

            <p>
              {t(
                "projects.empty.message"
              )}
            </p>

            <button
              type="button"
              onClick={
                clearFilters
              }
            >
              {t(
                "projects.filters.clear"
              )}
            </button>
          </div>
        ) : (
          <div className="projects-table-wrapper">
            <div className="projects-table">
              <div className="projects-table__head">
                <span>
                  {t(
                    "projects.table.project"
                  )}
                </span>

                <span>
                  {t(
                    "projects.table.status"
                  )}
                </span>

                <span>
                  {t(
                    "projects.table.progress"
                  )}
                </span>

                <span>
                  {t(
                    "projects.table.budget"
                  )}
                </span>

                <span>
                  {t(
                    "projects.table.deadline"
                  )}
                </span>

                <span>
                  {t(
                    "projects.table.actions"
                  )}
                </span>
              </div>

              {filteredProjects.map(
                (project) => (
                  <div
                    className="projects-table__row"
                    key={project.id}
                  >
                    <div className="project-main-cell">
                      <div className="project-main-cell__icon">
                        <BriefcaseBusiness
                          size={16}
                        />
                      </div>

                      <div>
                        <strong>
                          {
                            project.name
                          }
                        </strong>

                        <span>
                          {
                            project.client
                          }
                          {" · "}
                          {
                            project.manager
                          }
                        </span>

                        <small
                          className={`project-priority project-priority--${project.priority}`}
                        >
                          {t(
                            priorityTranslationKeys[
                              project
                                .priority
                            ] ||
                              priorityTranslationKeys.medium
                          )}
                        </small>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`project-status project-status--${project.status}`}
                      >
                        {t(
                          statusTranslationKeys[
                            project.status
                          ] ||
                            statusTranslationKeys.planning
                        )}
                      </span>
                    </div>

                    <div className="project-progress-cell">
                      <div className="project-progress-cell__top">
                        <span>
                          {
                            project.progress
                          }
                          %
                        </span>
                      </div>

                      <div className="project-progress-cell__track">
                        <div
                          className="project-progress-cell__value"
                          style={{
                            width: `${project.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="project-budget">
                      {formatCurrency(
                        project.budget
                      )}
                    </div>

                    <div className="project-deadline">
                      <CalendarDays
                        size={14}
                      />

                      {formatDate(
                        project.deadline
                      )}
                    </div>

                    <div className="project-row-actions">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            project
                          )
                        }
                        aria-label={t(
                          "projects.actions.edit"
                        )}
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget(
                            project
                          )
                        }
                        aria-label={t(
                          "projects.actions.delete"
                        )}
                      >
                        <Trash2
                          size={15}
                        />
                      </button>

                      <button
                        type="button"
                        aria-label={t(
                          "projects.actions.more"
                        )}
                      >
                        <MoreHorizontal
                          size={15}
                        />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={modalOpen}
        mode={modalMode}
        project={selectedProject}
        onClose={
          closeProjectModal
        }
        onSubmit={
          handleProjectSubmit
        }
      />

      {deleteTarget && (
        <div
          className="delete-modal__backdrop"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
                event.currentTarget &&
              !actionLoading
            ) {
              setDeleteTarget(
                null
              );
            }
          }}
        >
          <div className="delete-modal">
            <div className="delete-modal__icon">
              <Trash2 size={20} />
            </div>

            <h2>
              {t(
                "projects.delete.title"
              )}
            </h2>

            <p>
              {t(
                "projects.delete.message",
                {
                  name:
                    deleteTarget.name,
                }
              )}
            </p>

            <div className="delete-modal__actions">
              <button
                className="delete-modal__cancel"
                type="button"
                onClick={() =>
                  setDeleteTarget(
                    null
                  )
                }
                disabled={
                  actionLoading
                }
              >
                {t(
                  "projects.delete.cancel"
                )}
              </button>

              <button
                className="delete-modal__confirm"
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  actionLoading
                }
              >
                {actionLoading
                  ? t(
                      "projects.delete.deleting"
                    )
                  : t(
                      "projects.delete.confirm"
                    )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;

