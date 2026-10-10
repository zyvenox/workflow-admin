import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Ticket,
  Users,
  X,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router";

import { useTranslation } from "react-i18next";

import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../context/NotificationsContext";

import "./Sidebar.css";

const navigationItems = [
  {
    labelKey: "navigation.dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    labelKey: "navigation.users",
    path: "/users",
    icon: Users,
  },
  {
    labelKey: "navigation.projects",
    path: "/projects",
    icon: BriefcaseBusiness,
  },
  {
    labelKey: "navigation.tickets",
    path: "/tickets",
    icon: Ticket,
  },
  {
    labelKey: "navigation.notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    labelKey: "navigation.analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

const notificationLabels = {
  en: "Notifications",
  de: "Benachrichtigungen",
  fa: "اعلان‌ها",
};

function Sidebar({
  isOpen,
  onClose,
}) {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const { unreadCount } = useNotifications();

  const language =
    i18n.language?.split("-")[0] || "en";

  const firstName =
    user?.firstName || "Alex";

  const lastName =
    user?.lastName || "Morgan";

  const roleKey =
    user?.role &&
    `users.roles.${user.role}`;

  const getNavigationLabel = (item) => {
    if (item.path === "/notifications") {
      return (
        notificationLabels[language] ||
        notificationLabels.en
      );
    }

    return t(item.labelKey);
  };

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });

    onClose?.();
  };

  return (
    <aside
      className={`sidebar ${
        isOpen ? "sidebar--open" : ""
      }`}
    >
      {/* Sidebar Header */}

      <div className="sidebar__top">
        <div className="brand">
          <div className="brand__logo">
            W
          </div>

          <div className="brand__content">
            <span className="brand__name">
              {t("app.name")}
            </span>

            <span className="brand__label">
              {t("app.adminPanel")}
            </span>
          </div>
        </div>

        <button
          className="sidebar__close"
          type="button"
          aria-label={t(
            "header.closeNavigation"
          )}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation */}

      <div className="sidebar__section">
        <span className="sidebar__section-title">
          {t("navigation.workspace")}
        </span>

        <nav className="sidebar__nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isNotifications =
              item.path === "/notifications";

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={
                  item.path === "/dashboard"
                }
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar__link ${
                    isActive
                      ? "sidebar__link--active"
                      : ""
                  }`
                }
              >
                <span className="sidebar__link-icon">
                  <Icon
                    size={19}
                    strokeWidth={2}
                  />
                </span>

                <span className="sidebar__link-label">
                  {getNavigationLabel(item)}
                </span>

                {isNotifications &&
                  unreadCount > 0 && (
                    <span
                      className="sidebar__notification-badge"
                      aria-label={`${unreadCount} unread notifications`}
                    >
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}

                <ChevronRight
                  className="sidebar__link-arrow"
                  size={16}
                  strokeWidth={1.8}
                />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}

      <div className="sidebar__bottom">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `sidebar__link ${
              isActive
                ? "sidebar__link--active"
                : ""
            }`
          }
        >
          <span className="sidebar__link-icon">
            <Settings
              size={19}
              strokeWidth={2}
            />
          </span>

          <span className="sidebar__link-label">
            {t("navigation.settings")}
          </span>

          <ChevronRight
            className="sidebar__link-arrow"
            size={16}
            strokeWidth={1.8}
          />
        </NavLink>

        <button
          className="sidebar__logout"
          type="button"
          onClick={handleLogout}
        >
          <span className="sidebar__link-icon">
            <LogOut
              size={19}
              strokeWidth={2}
            />
          </span>

          <span className="sidebar__link-label">
            {t("navigation.logout")}
          </span>
        </button>

        {/* User Profile */}

        <div className="sidebar__profile">
          <div className="sidebar__avatar">
            {firstName.charAt(0)}
          </div>

          <div className="sidebar__profile-info">
            <strong>
              {firstName} {lastName}
            </strong>

            <span>
              {roleKey
                ? t(roleKey, {
                    defaultValue: t(
                      "header.administrator"
                    ),
                  })
                : t("header.administrator")}
            </span>
          </div>

          <div className="sidebar__status" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;