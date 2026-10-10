import {
  Bell,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  CircleAlert,
  Clock3,
  Inbox,
  Ticket,
  Trash2,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useNotifications,
} from "../../context/NotificationsContext";

import notificationsTranslations from "../../i18n/notifications";

import "./Page.css";

function interpolate(template, values) {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key) => String(values[key] ?? "")
  );
}

function Page() {
  const { i18n } = useTranslation();

  const language =
    i18n.language?.split("-")[0] || "en";

  const text =
    notificationsTranslations[language] ||
    notificationsTranslations.en;

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    dismissAllNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState("all");

  const filteredNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => {
          if (
            filter === "unread" &&
            notification.read
          ) {
            return false;
          }

          if (
            ["tickets", "projects"].includes(filter) &&
            notification.category !== filter
          ) {
            return false;
          }

          return true;
        }
      ),
    [notifications, filter]
  );

  const criticalCount =
    notifications.filter(
      (notification) =>
        notification.severity === "critical"
    ).length;

  const projectAlertCount =
    notifications.filter(
      (notification) =>
        notification.category === "projects"
    ).length;

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const parsedDate =
      new Date(`${dateValue}T00:00:00`);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return dateValue;
    }

    return new Intl.DateTimeFormat(
      language,
      {
        dateStyle: "medium",
      }
    ).format(parsedDate);
  };

  const getMessage = (notification) => {
    const template =
      text.items[notification.messageKey] ||
      "";

    return interpolate(template, {
      name: notification.entityName,
      priority:
        text.priorities[
          notification.priority
        ] || notification.priority || "",
      date: formatDate(notification.date),
      progress: notification.progress ?? "",
    });
  };

  const filters = [
    {
      id: "all",
      label: text.all,
      count: notifications.length,
    },
    {
      id: "unread",
      label: text.unread,
      count: unreadCount,
    },
    {
      id: "tickets",
      label: text.tickets,
      count: notifications.filter(
        (item) =>
          item.category === "tickets"
      ).length,
    },
    {
      id: "projects",
      label: text.projects,
      count: projectAlertCount,
    },
  ];

  if (loading) {
    return (
      <main className="notifications-page">
        <div className="notifications-skeleton">
          <div className="notifications-skeleton__heading" />

          <div className="notifications-skeleton__stats">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="notifications-skeleton__stat"
                />
              )
            )}
          </div>

          <div className="notifications-skeleton__list">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="notifications-skeleton__item"
                />
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="notifications-page">
      {/* Header */}

      <header className="notifications-hero">
        <div>
          <span className="notifications-hero__eyebrow">
            <Bell size={13} />
            {text.eyebrow}
          </span>

          <h1>{text.title}</h1>

          <p>{text.subtitle}</p>
        </div>

        <div className="notifications-hero__actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="notifications-button notifications-button--secondary"
              onClick={markAllAsRead}
            >
              <CheckCheck size={16} />
              {text.markAllRead}
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              className="notifications-button notifications-button--danger"
              onClick={dismissAllNotifications}
            >
              <Trash2 size={15} />
              {text.dismissAll}
            </button>
          )}
        </div>
      </header>

      {/* Statistics */}

      <section className="notifications-stats">
        <article className="notifications-stat">
          <div className="notifications-stat__icon notifications-stat__icon--blue">
            <Inbox size={19} />
          </div>

          <div>
            <span>{text.stats.total}</span>
            <strong>{notifications.length}</strong>
          </div>
        </article>

        <article className="notifications-stat">
          <div className="notifications-stat__icon notifications-stat__icon--violet">
            <Bell size={19} />
          </div>

          <div>
            <span>{text.stats.unread}</span>
            <strong>{unreadCount}</strong>
          </div>
        </article>

        <article className="notifications-stat">
          <div className="notifications-stat__icon notifications-stat__icon--red">
            <CircleAlert size={19} />
          </div>

          <div>
            <span>{text.stats.urgent}</span>
            <strong>{criticalCount}</strong>
          </div>
        </article>

        <article className="notifications-stat">
          <div className="notifications-stat__icon notifications-stat__icon--green">
            <BriefcaseBusiness size={19} />
          </div>

          <div>
            <span>{text.stats.projects}</span>
            <strong>{projectAlertCount}</strong>
          </div>
        </article>
      </section>

      {/* Notification list */}

      <section className="notifications-panel">
        <div className="notifications-toolbar">
          <div className="notifications-filter-list">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`notifications-filter ${
                  filter === item.id
                    ? "notifications-filter--active"
                    : ""
                }`}
                onClick={() =>
                  setFilter(item.id)
                }
              >
                {item.label}

                <span>{item.count}</span>
              </button>
            ))}
          </div>

          <span className="notifications-toolbar__count">
            {filteredNotifications.length}
          </span>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <div className="notifications-empty__icon">
              <Inbox size={25} />
            </div>

            <h2>{text.items.emptyTitle}</h2>

            <p>{text.items.emptyMessage}</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map(
              (notification) => {
                const Icon =
                  notification.category ===
                  "tickets"
                    ? Ticket
                    : BriefcaseBusiness;

                const title =
                  text.items[
                    notification.titleKey
                  ] || text.title;

                return (
                  <article
                    key={notification.id}
                    className={[
                      "notification-item",
                      `notification-item--${notification.severity}`,
                      notification.read
                        ? "notification-item--read"
                        : "notification-item--unread",
                    ].join(" ")}
                  >
                    <div className="notification-item__icon">
                      <Icon size={19} />
                    </div>

                    <div className="notification-item__body">
                      <div className="notification-item__heading">
                        <div className="notification-item__title-wrap">
                          <h3>{title}</h3>

                          {!notification.read && (
                            <span className="notification-item__unread-dot" />
                          )}
                        </div>

                        <span
                          className={`notification-item__severity notification-item__severity--${notification.severity}`}
                        >
                          {
                            text.severity[
                              notification.severity
                            ]
                          }
                        </span>
                      </div>

                      <p>{getMessage(notification)}</p>

                      <div className="notification-item__meta">
                        <span>
                          {notification.category ===
                          "tickets"
                            ? text.labels.tickets
                            : text.labels.projects}
                        </span>

                        <span className="notification-item__meta-dot" />

                        <span>
                          {text.labels.relevantDate}:
                          {" "}
                          {formatDate(notification.date)}
                        </span>
                      </div>

                      <div className="notification-item__actions">
                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                          >
                            <Check size={14} />
                            {text.actions.markRead}
                          </button>
                        )}

                        <button
                          type="button"
                          className="notification-item__dismiss"
                          onClick={() =>
                            dismissNotification(
                              notification.id
                            )
                          }
                        >
                          <Trash2 size={14} />
                          {text.actions.dismiss}
                        </button>
                      </div>
                    </div>

                    <div className="notification-item__status">
                      {notification.read ? (
                        <CheckCircleIcon />
                      ) : (
                        <Clock3 size={15} />
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function CheckCircleIcon() {
  return (
    <Check
      size={15}
      aria-label="Read"
    />
  );
}

export default Page;