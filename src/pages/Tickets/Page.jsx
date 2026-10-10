import {
  AlertCircle,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  Clock3,
  Edit3,
  Inbox,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import TicketModal from "../../components/TicketModal/TicketModal";

import ticketsTranslations from "../../i18n/tickets";

import { useTickets } from "../../context/TicketsContext";

import "./Page.css";

const statusOptions = [
  "open",
  "in-progress",
  "waiting",
  "resolved",
  "closed",
];

const priorityOptions = [
  "low",
  "medium",
  "high",
  "urgent",
];

function Page() {
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
    tickets,
    loading,
    error,
    addTicket,
    editTicket,
    removeTicket,
  } = useTickets();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [priority, setPriority] =
    useState("all");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("create");

  const [selectedTicket, setSelectedTicket] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  const filteredTickets =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return tickets.filter(
        (ticket) => {
          const matchesSearch =
            !normalizedSearch ||
            ticket.title
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            ticket.requester
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            ticket.assignee
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesStatus =
            status === "all" ||
            ticket.status === status;

          const matchesPriority =
            priority === "all" ||
            ticket.priority === priority;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
          );
        }
      );
    }, [
      tickets,
      search,
      status,
      priority,
  ]);

  const totalTickets =
    tickets.length;

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "open"
    ).length;

  const inProgressTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        "in-progress"
    ).length;

  const resolvedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
          "resolved" ||
        ticket.status === "closed"
    ).length;

  const formatDate = (date) => {
    try {
      return new Intl.DateTimeFormat(
        language,
        {
          dateStyle: "medium",
        }
      ).format(
        new Date(`${date}T00:00:00`)
      );
    } catch {
      return date;
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedTicket(null);
    setActionError("");
    setModalOpen(true);
  };

  const openEditModal = (ticket) => {
    setModalMode("edit");
    setSelectedTicket(ticket);
    setActionError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (actionLoading) {
      return;
    }

    setModalOpen(false);
    setSelectedTicket(null);
  };

  const handleTicketSubmit =
    async (values) => {
      setActionError("");

      try {
        if (
          modalMode === "edit" &&
          selectedTicket
        ) {
          await editTicket(
            selectedTicket.id,
            values
          );
        } else {
          await addTicket(values);
        }

        setModalOpen(false);
        setSelectedTicket(null);
      } catch (submitError) {
        setActionError(
          submitError.message ||
            "Unable to save ticket."
        );
      }
    };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setActionLoading(true);
    setActionError("");

    try {
      await removeTicket(
        deleteTarget.id
      );

      setDeleteTarget(null);
    } catch (deleteError) {
      setActionError(
        deleteError.message ||
          "Unable to delete ticket."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="tickets-page">
      <section className="tickets-hero">
        <div>
          <span className="tickets-hero__eyebrow">
            {text.eyebrow}
          </span>

          <h1>{text.title}</h1>

          <p>{text.subtitle}</p>
        </div>

        <button
          type="button"
          className="tickets-create-button"
          onClick={openCreateModal}
        >
          <CirclePlus size={18} />
          {text.create}
        </button>
      </section>

      <section className="tickets-stats">
        <article className="tickets-stat-card">
          <div className="tickets-stat-card__icon">
            <Inbox size={18} />
          </div>

          <div>
            <span>
              {text.total}
            </span>

            <strong>
              {totalTickets}
            </strong>
          </div>
        </article>

        <article className="tickets-stat-card">
          <div className="tickets-stat-card__icon">
            <CircleAlert size={18} />
          </div>

          <div>
            <span>{text.open}</span>

            <strong>
              {openTickets}
            </strong>
          </div>
        </article>

        <article className="tickets-stat-card">
          <div className="tickets-stat-card__icon">
            <Clock3 size={18} />
          </div>

          <div>
            <span>
              {text.inProgress}
            </span>

            <strong>
              {inProgressTickets}
            </strong>
          </div>
        </article>

        <article className="tickets-stat-card">
          <div className="tickets-stat-card__icon">
            <CircleCheck size={18} />
          </div>

          <div>
            <span>
              {text.resolved}
            </span>

            <strong>
              {resolvedTickets}
            </strong>
          </div>
        </article>
      </section>

      <section className="tickets-panel">
        <div className="tickets-toolbar">
          <div className="tickets-search">
            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={text.search}
            />

            {search && (
              <button
                type="button"
                className="tickets-search__clear"
                onClick={() =>
                  setSearch("")
                }
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="tickets-filters">
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
            >
              <option value="all">
                {text.allStatuses}
              </option>

              {statusOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {
                      text.statuses[
                        item
                      ]
                    }
                  </option>
                )
              )}
            </select>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value
                )
              }
            >
              <option value="all">
                {text.allPriorities}
              </option>

              {priorityOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {
                      text.priorities[
                        item
                      ]
                    }
                  </option>
                )
              )}
            </select>

            {(search ||
              status !== "all" ||
              priority !== "all") && (
              <button
                type="button"
                className="tickets-clear-button"
                onClick={
                  clearFilters
                }
              >
                {text.clear}
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <div className="tickets-action-error">
            <AlertCircle size={17} />

            <span>
              {actionError}
            </span>
          </div>
        )}

        {error && (
          <div className="tickets-error-state">
            <AlertCircle size={20} />

            <div>
              <strong>
                {text.errorTitle}
              </strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="tickets-table-wrap">
          {loading ? (
            <div className="tickets-loading">
              {Array.from({
                length: 5,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="tickets-loading__row"
                  >
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                )
              )}
            </div>
          ) : filteredTickets.length ===
            0 ? (
            <div className="tickets-empty">
              <div className="tickets-empty__icon">
                <Inbox size={24} />
              </div>

              <h3>
                {text.noTickets}
              </h3>

              <p>
                {text.noTicketsText}
              </p>
            </div>
          ) : (
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>
                    {text.tableTicket}
                  </th>

                  <th>
                    {text.tableRequester}
                  </th>

                  <th>
                    {text.tableStatus}
                  </th>

                  <th>
                    {text.tablePriority}
                  </th>

                  <th>
                    {text.tableAssignee}
                  </th>

                  <th>
                    {text.tableDate}
                  </th>

                  <th>
                    {text.tableActions}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map(
                  (ticket) => (
                    <tr
                      key={ticket.id}
                    >
                      <td>
                        <div className="ticket-title-cell">
                          <strong>
                            {
                              ticket.title
                            }
                          </strong>

                          <span>
                            #
                            {ticket.id.replace(
                              "ticket-",
                              ""
                            )}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="ticket-person">
                          {
                            ticket.requester
                          }
                        </span>
                      </td>

                      <td>
                        <span
                          className={`ticket-badge ticket-badge--status-${ticket.status}`}
                        >
                          {
                            text.statuses[
                              ticket.status
                            ]
                          }
                        </span>
                      </td>

                      <td>
                        <span
                          className={`ticket-badge ticket-badge--priority-${ticket.priority}`}
                        >
                          {
                            text.priorities[
                              ticket.priority
                            ]
                          }
                        </span>
                      </td>

                      <td>
                        <span className="ticket-assignee">
                          {
                            ticket.assignee
                          }
                        </span>
                      </td>

                      <td>
                        <time>
                          {formatDate(
                            ticket.createdAt
                          )}
                        </time>
                      </td>

                      <td>
                        <div className="ticket-actions">
                          <button
                            type="button"
                            title={text.edit}
                            onClick={() =>
                              openEditModal(
                                ticket
                              )
                            }
                          >
                            <Edit3
                              size={15}
                            />
                          </button>

                          <button
                            type="button"
                            title={
                              text.delete
                            }
                            className="ticket-action--danger"
                            onClick={() =>
                              setDeleteTarget(
                                ticket
                              )
                            }
                          >
                            <Trash2
                              size={15}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading &&
          filteredTickets.length >
            0 && (
            <div className="tickets-results">
              <span>
                {filteredTickets.length}{" "}
                {text.results}
              </span>
            </div>
          )}
      </section>

      <TicketModal
        isOpen={modalOpen}
        mode={modalMode}
        ticket={selectedTicket}
        onClose={closeModal}
        onSubmit={
          handleTicketSubmit
        }
      />

      {deleteTarget && (
        <div
          className="ticket-delete__backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget &&
              !actionLoading
            ) {
              setDeleteTarget(null);
            }
          }}
        >
          <div className="ticket-delete">
            <div className="ticket-delete__icon">
              <Trash2 size={22} />
            </div>

            <h3>
              {text.confirmDelete}
            </h3>

            <p>
              {text.deleteText}
            </p>

            <div className="ticket-delete__actions">
              <button
                type="button"
                className="ticket-delete__cancel"
                onClick={() =>
                  setDeleteTarget(
                    null
                  )
                }
                disabled={
                  actionLoading
                }
              >
                {text.cancelDelete}
              </button>

              <button
                type="button"
                className="ticket-delete__confirm"
                onClick={
                  handleDelete
                }
                disabled={
                  actionLoading
                }
              >
                {actionLoading ? (
                  <>
                    <Clock3
                      size={16}
                    />

                    {
                      text.deleting
                    }
                  </>
                ) : (
                  <>
                    <Trash2
                      size={16}
                    />

                    {
                      text.confirmDeleteButton
                    }
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Page;