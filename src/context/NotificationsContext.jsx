import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useProjects } from "./ProjectsContext";
import { useTickets } from "./TicketsContext";

const STORAGE_KEY =
  "workflow_notifications_state";

const NotificationsContext =
  createContext(undefined);

function readStoredState() {
  try {
    const storedValue =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!storedValue) {
      return {
        readIds: [],
        dismissedIds: [],
      };
    }

    const parsedValue =
      JSON.parse(storedValue);

    return {
      readIds: Array.isArray(
        parsedValue.readIds
      )
        ? parsedValue.readIds
        : [],

      dismissedIds: Array.isArray(
        parsedValue.dismissedIds
      )
        ? parsedValue.dismissedIds
        : [],
    };
  } catch {
    return {
      readIds: [],
      dismissedIds: [],
    };
  }
}

function getDaysUntil(dateString) {
  if (!dateString) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const targetDate =
    new Date(
      `${dateString}T00:00:00`
    );

  if (
    Number.isNaN(
      targetDate.getTime()
    )
  ) {
    return null;
  }

  return Math.ceil(
    (
      targetDate.getTime() -
      today.getTime()
    ) /
      (1000 * 60 * 60 * 24)
  );
}

function buildNotifications(
  projects,
  tickets
) {
  const notifications = [];

  // Active urgent/high-priority tickets.
  tickets.forEach((ticket) => {
    const isActive =
      !["resolved", "closed"].includes(
        ticket.status
      );

    const isImportant =
      ["urgent", "high"].includes(
        ticket.priority
      );

    if (
      !isActive ||
      !isImportant
    ) {
      return;
    }

    notifications.push({
      id: `ticket:${ticket.id}:priority`,
      category: "tickets",
      kind: "ticketPriority",
      titleKey: "ticketPriorityTitle",
      messageKey: "ticketPriorityMessage",
      entityName: ticket.title,
      priority: ticket.priority,
      severity:
        ticket.priority === "urgent"
          ? "critical"
          : "high",
      date: ticket.createdAt || "",
    });
  });

  // Project deadline and progress alerts.
  projects.forEach((project) => {
    if (
      project.status === "completed"
    ) {
      return;
    }

    const daysUntil =
      getDaysUntil(
        project.deadline
      );

    if (
      daysUntil !== null &&
      daysUntil < 0
    ) {
      notifications.push({
        id: `project:${project.id}:overdue`,
        category: "projects",
        kind: "projectOverdue",
        titleKey: "projectOverdueTitle",
        messageKey: "projectOverdueMessage",
        entityName: project.name,
        date: project.deadline || "",
        severity: "critical",
      });
    } else if (
      daysUntil !== null &&
      daysUntil <= 7
    ) {
      notifications.push({
        id: `project:${project.id}:deadline`,
        category: "projects",
        kind: "projectDeadline",
        titleKey: "projectDeadlineTitle",
        messageKey: "projectDeadlineMessage",
        entityName: project.name,
        date: project.deadline || "",
        severity: "medium",
      });
    }

    const progress =
      Number(project.progress || 0);

    if (progress >= 75) {
      notifications.push({
        id: `project:${project.id}:progress`,
        category: "projects",
        kind: "projectProgress",
        titleKey: "projectProgressTitle",
        messageKey: "projectProgressMessage",
        entityName: project.name,
        progress,
        date: project.deadline || "",
        severity: "low",
      });
    }
  });

  const severityRank = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return notifications.sort(
    (a, b) =>
      severityRank[a.severity] -
      severityRank[b.severity]
  );
}

function NotificationsProvider({
  children,
}) {
  const {
    projects,
    loading: projectsLoading,
  } = useProjects();

  const {
    tickets,
    loading: ticketsLoading,
  } = useTickets();

  const [storedState, setStoredState] =
    useState(readStoredState);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(storedState)
    );
  }, [storedState]);

  const generatedNotifications =
    useMemo(
      () =>
        buildNotifications(
          projects,
          tickets
        ),
      [projects, tickets]
    );

  const notifications = useMemo(
    () =>
      generatedNotifications
        .filter(
          (notification) =>
            !storedState.dismissedIds.includes(
              notification.id
            )
        )
        .map((notification) => ({
          ...notification,
          read:
            storedState.readIds.includes(
              notification.id
            ),
        })),
    [
      generatedNotifications,
      storedState,
    ]
  );

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  const markAsRead = useCallback(
    (notificationId) => {
      setStoredState((current) => ({
        ...current,
        readIds: [
          ...new Set([
            ...current.readIds,
            notificationId,
          ]),
        ],
      }));
    },
    []
  );

  const markAllAsRead =
    useCallback(() => {
      setStoredState((current) => ({
        ...current,
        readIds: [
          ...new Set([
            ...current.readIds,
            ...generatedNotifications.map(
              (notification) =>
                notification.id
            ),
          ]),
        ],
      }));
    }, [generatedNotifications]);

  const dismissNotification =
    useCallback(
      (notificationId) => {
        setStoredState((current) => ({
          ...current,
          dismissedIds: [
            ...new Set([
              ...current.dismissedIds,
              notificationId,
            ]),
          ],
        }));
      },
      []
    );

  const dismissAllNotifications =
    useCallback(() => {
      setStoredState((current) => ({
        ...current,
        dismissedIds: [
          ...new Set([
            ...current.dismissedIds,
            ...generatedNotifications.map(
              (notification) =>
                notification.id
            ),
          ]),
        ],
      }));
    }, [generatedNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading:
        projectsLoading ||
        ticketsLoading,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      dismissAllNotifications,
    }),
    [
      notifications,
      unreadCount,
      projectsLoading,
      ticketsLoading,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      dismissAllNotifications,
    ]
  );

  return (
    <NotificationsContext.Provider
      value={value}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

function useNotifications() {
  const context =
    useContext(
      NotificationsContext
    );

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationsProvider."
    );
  }

  return context;
}

export {
  NotificationsContext,
  NotificationsProvider,
  useNotifications,
};