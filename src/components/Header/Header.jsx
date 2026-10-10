import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  Search,
  Settings2,
  Ticket,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import {
  useTranslation,
} from "react-i18next";

import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../context/ProjectsContext";
import { useTickets } from "../../context/TicketsContext";
import { useNotifications } from "../../context/NotificationsContext";

import LanguageSwitcher from "../UI/LanguageSwitcher/LanguageSwitcher";

import "./Header.css";

const interfaceLabels = {
  en: {
    notifications: "Notifications",
    profile: "Profile",
    projects: "Project",
    tickets: "Ticket",
    users: "User",
    page: "Page",
    noResults: "No matching results",
    emptyHint:
      "Try another name, project, ticket or page.",
    searching: "Searching users...",
    searchResults: "Search results",
    suggestions: "Quick navigation",
    keyboardHint:
      "Use ↑ ↓ to navigate · Enter to open · Esc to close",
    userSearchError:
      "User search is temporarily unavailable.",
  },

  de: {
    notifications: "Benachrichtigungen",
    profile: "Profil",
    projects: "Projekt",
    tickets: "Ticket",
    users: "Benutzer",
    page: "Seite",
    noResults: "Keine passenden Ergebnisse",
    emptyHint:
      "Versuche einen anderen Namen, ein Projekt, Ticket oder eine Seite.",
    searching: "Benutzer werden gesucht...",
    searchResults: "Suchergebnisse",
    suggestions: "Schnellnavigation",
    keyboardHint:
      "↑ ↓ navigieren · Enter öffnen · Esc schließen",
    userSearchError:
      "Die Benutzersuche ist vorübergehend nicht verfügbar.",
  },

  fa: {
    notifications: "اعلان‌ها",
    profile: "پروفایل",
    projects: "پروژه",
    tickets: "تیکت",
    users: "کاربر",
    page: "صفحه",
    noResults: "نتیجه‌ای پیدا نشد",
    emptyHint:
      "نام، پروژه، تیکت یا صفحه دیگری را جستجو کنید.",
    searching: "در حال جستجوی کاربران...",
    searchResults: "نتایج جستجو",
    suggestions: "دسترسی سریع",
    keyboardHint:
      "حرکت: ↑ ↓ · بازکردن: Enter · بستن: Esc",
    userSearchError:
      "جستجوی کاربران موقتاً در دسترس نیست.",
  },
};

function Header({
  onMenuClick,
}) {
  const { t, i18n } =
    useTranslation();

  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    projects,
  } = useProjects();

  const {
    tickets,
  } = useTickets();

  const {
    unreadCount,
  } = useNotifications();

  const language =
    i18n.language?.split("-")[0] ||
    "en";

  const labels =
    interfaceLabels[language] ||
    interfaceLabels.en;

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isSearchOpen, setIsSearchOpen] =
    useState(false);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [remoteUsers, setRemoteUsers] =
    useState([]);

  const [
    isSearchingUsers,
    setIsSearchingUsers,
  ] = useState(false);

  const [
    userSearchFailed,
    setUserSearchFailed,
  ] = useState(false);

  const searchWrapRef = useRef(null);
  const searchInputRef = useRef(null);

  const firstName =
    user?.firstName || "Alex";

  const lastName =
    user?.lastName || "Morgan";

  const role =
    user?.role
      ? t(`users.roles.${user.role}`, {
          defaultValue: t(
            "header.administrator"
          ),
        })
      : t("header.administrator");

  /*
   * Searchable application pages.
   */

  const pageItems = useMemo(
    () => [
      {
        id: "page-dashboard",
        label: t("navigation.dashboard"),
        path: "/dashboard",
        type: "page",
        keywords: "home overview main",
        icon: LayoutDashboard,
      },
      {
        id: "page-users",
        label: t("navigation.users"),
        path: "/users",
        type: "page",
        keywords: "team members people",
        icon: Users,
      },
      {
        id: "page-projects",
        label: t("navigation.projects"),
        path: "/projects",
        type: "page",
        keywords: "portfolio work tasks",
        icon: BriefcaseBusiness,
      },
      {
        id: "page-tickets",
        label: t("navigation.tickets"),
        path: "/tickets",
        type: "page",
        keywords: "support requests issues",
        icon: Ticket,
      },
      {
        id: "page-notifications",
        label: labels.notifications,
        path: "/notifications",
        type: "page",
        keywords: "alerts unread activity",
        icon: Bell,
      },
      {
        id: "page-analytics",
        label: t("navigation.analytics"),
        path: "/analytics",
        type: "page",
        keywords: "reports statistics charts",
        icon: BarChart3,
      },
      {
        id: "page-settings",
        label: t("navigation.settings"),
        path: "/settings",
        type: "page",
        keywords: "preferences theme language",
        icon: Settings2,
      },
      {
        id: "page-profile",
        label: labels.profile,
        path: "/profile",
        type: "page",
        keywords: "account personal information",
        icon: UserRound,
      },
    ],
    [t, labels]
  );

  /*
   * Search users through DummyJSON.
   * Requests are cancelled when the query changes.
   */

  useEffect(() => {
    const query =
      searchQuery.trim();

    if (query.length < 2) {
      setRemoteUsers([]);
      setIsSearchingUsers(false);
      setUserSearchFailed(false);
      return;
    }

    let isCurrentRequest = true;

    const controller =
      new AbortController();

    setRemoteUsers([]);
    setIsSearchingUsers(true);
    setUserSearchFailed(false);

    const timeoutId =
      window.setTimeout(
        async () => {
          try {
            const response =
              await fetch(
                `https://dummyjson.com/users/search?q=${encodeURIComponent(
                  query
                )}&limit=5`,
                {
                  signal:
                    controller.signal,
                }
              );

            if (!response.ok) {
              throw new Error(
                "User search failed."
              );
            }

            const data =
              await response.json();

            if (!isCurrentRequest) {
              return;
            }

            const results =
              Array.isArray(data.users)
                ? data.users
                : [];

            setRemoteUsers(
              results.map(
                (person) => ({
                  id: `user-${person.id}`,
                  label: [
                    person.firstName,
                    person.lastName,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  detail:
                    person.email ||
                    person.username ||
                    "",
                  path: `/users/${person.id}`,
                  type: "user",
                  icon: UserRound,
                })
              )
            );
          } catch (error) {
            if (
              error.name !== "AbortError" &&
              isCurrentRequest
            ) {
              setRemoteUsers([]);
              setUserSearchFailed(true);
            }
          } finally {
            if (isCurrentRequest) {
              setIsSearchingUsers(false);
            }
          }
        },
        250
      );

    return () => {
      isCurrentRequest = false;

      window.clearTimeout(
        timeoutId
      );

      controller.abort();
    };
  }, [searchQuery]);

  /*
   * Combine page, project, ticket and user results.
   */

  const searchResults = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();

    const matches = (value) =>
      String(value || "")
        .toLowerCase()
        .includes(query);

    const matchingPages =
      pageItems.filter((item) => {
        if (!query) {
          return true;
        }

        return (
          matches(item.label) ||
          matches(item.path) ||
          matches(item.keywords)
        );
      });

    if (!query) {
      return matchingPages.slice(0, 5);
    }

    const matchingProjects =
      projects
        .filter((project) =>
          [
            project.name,
            project.client,
            project.manager,
            project.status,
          ].some(matches)
        )
        .slice(0, 4)
        .map((project) => ({
          id: `project-result-${project.id}`,
          label: project.name,
          detail: project.client,
          path: "/projects",
          type: "project",
          icon: BriefcaseBusiness,
        }));

    const matchingTickets =
      tickets
        .filter((ticket) =>
          [
            ticket.title,
            ticket.requester,
            ticket.assignee,
            ticket.status,
            ticket.priority,
            ticket.id,
          ].some(matches)
        )
        .slice(0, 4)
        .map((ticket) => ({
          id: `ticket-result-${ticket.id}`,
          label: ticket.title,
          detail: ticket.requester,
          path: "/tickets",
          type: "ticket",
          icon: FileText,
        }));

    return [
      ...matchingPages,
      ...matchingProjects,
      ...matchingTickets,
      ...remoteUsers,
    ].slice(0, 8);
  }, [
    searchQuery,
    pageItems,
    projects,
    tickets,
    remoteUsers,
  ]);

  /*
   * Open and close the search panel.
   */

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);

    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSelectedIndex(0);
  }, []);

  /*
   * Ctrl + K and Cmd + K shortcuts.
   */

  useEffect(() => {
    const handleGlobalKeyDown = (
      event
    ) => {
      const isSearchShortcut =
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        event.preventDefault();
        openSearch();
      }

      if (event.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener(
      "keydown",
      handleGlobalKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleGlobalKeyDown
      );
    };
  }, [openSearch, closeSearch]);

  /*
   * Close the search panel when clicking outside.
   */

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(
          event.target
        )
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
   * Keep the selected keyboard result valid.
   */

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (
      selectedIndex >=
      searchResults.length
    ) {
      setSelectedIndex(
        Math.max(
          searchResults.length - 1,
          0
        )
      );
    }
  }, [
    selectedIndex,
    searchResults.length,
  ]);

  const handleResultSelect = useCallback(
    (item) => {
      navigate(item.path);

      setSearchQuery("");
      setIsSearchOpen(false);
      setSelectedIndex(0);
    },
    [navigate]
  );

  const handleSearchKeyDown = (
    event
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      searchInputRef.current?.blur();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setSelectedIndex((current) =>
        Math.min(
          current + 1,
          searchResults.length - 1
        )
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex((current) =>
        Math.max(current - 1, 0)
      );

      return;
    }

    if (
      event.key === "Enter" &&
      searchResults[selectedIndex]
    ) {
      event.preventDefault();

      handleResultSelect(
        searchResults[selectedIndex]
      );
    }
  };

  const getResultTypeLabel = (
    type
  ) => {
    return labels[type] ||
      labels.page;
  };

  return (
    <header className="header">
      <div className="header__left">
        <button
          className="header__menu"
          type="button"
          aria-label={t(
            "header.openNavigation"
          )}
          onClick={onMenuClick}
        >
          <Menu size={21} />
        </button>

        {/* GLOBAL SEARCH */}

        <div
          className="header__search-wrap"
          ref={searchWrapRef}
        >
          <div
            className={`header__search ${
              isSearchOpen
                ? "header__search--active"
                : ""
            }`}
            onClick={openSearch}
          >
            <Search
              size={18}
              strokeWidth={2}
            />

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              placeholder={t(
                "header.search"
              )}
              aria-label={t(
                "header.search"
              )}
              aria-expanded={isSearchOpen}
              aria-controls="header-search-results"
              onFocus={() =>
                setIsSearchOpen(true)
              }
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              onKeyDown={
                handleSearchKeyDown
              }
            />

            {searchQuery ? (
              <button
                className="header__search-clear"
                type="button"
                aria-label="Clear search"
                onClick={(event) => {
                  event.stopPropagation();
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                <X size={14} />
              </button>
            ) : (
              <span className="header__shortcut">
                Ctrl K
              </span>
            )}
          </div>

          {isSearchOpen && (
            <div
              id="header-search-results"
              className="header__search-panel"
              role="listbox"
              aria-label={labels.searchResults}
            >
              <div className="header__search-panel-heading">
                <span>
                  {searchQuery.trim()
                    ? labels.searchResults
                    : labels.suggestions}
                </span>

                <span className="header__search-result-count">
                  {searchResults.length}
                </span>
              </div>

              {searchResults.length > 0 ? (
                <div className="header__search-results">
                  {searchResults.map(
                    (item, index) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected={
                            selectedIndex === index
                          }
                          className={`header__search-result ${
                            selectedIndex === index
                              ? "header__search-result--selected"
                              : ""
                          }`}
                          onMouseEnter={() =>
                            setSelectedIndex(index)
                          }
                          onClick={() =>
                            handleResultSelect(
                              item
                            )
                          }
                        >
                          <span className="header__search-result-icon">
                            <Icon
                              size={17}
                              strokeWidth={1.9}
                            />
                          </span>

                          <span className="header__search-result-content">
                            <strong>
                              {item.label}
                            </strong>

                            {item.detail && (
                              <span>
                                {item.detail}
                              </span>
                            )}
                          </span>

                          <span className="header__search-result-type">
                            {getResultTypeLabel(
                              item.type
                            )}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="header__search-empty">
                  <span className="header__search-empty-icon">
                    {isSearchingUsers ? (
                      <LoaderCircle
                        size={20}
                        className="header__search-spinner"
                      />
                    ) : (
                      <Search size={20} />
                    )}
                  </span>

                  <strong>
                    {labels.noResults}
                  </strong>

                  <p>{labels.emptyHint}</p>
                </div>
              )}

              {isSearchingUsers && (
                <div className="header__search-loading">
                  <LoaderCircle
                    size={13}
                    className="header__search-spinner"
                  />

                  {labels.searching}
                </div>
              )}

              {userSearchFailed &&
                searchQuery.trim().length >= 2 && (
                  <div className="header__search-network-error">
                    {labels.userSearchError}
                  </div>
                )}

              <div className="header__search-footer">
                <span>
                  {labels.keyboardHint}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HEADER ACTIONS */}

      <div className="header__actions">
        <LanguageSwitcher />

        <button
          className="header__icon-button"
          type="button"
          aria-label={t(
            "header.settings"
          )}
          title={t("header.settings")}
          onClick={() =>
            navigate("/settings")
          }
        >
          <Settings2
            size={19}
            strokeWidth={1.9}
          />
        </button>

        <button
          className="header__notification"
          type="button"
          aria-label={`${labels.notifications}${
            unreadCount > 0
              ? `: ${unreadCount} unread`
              : ""
          }`}
          title={labels.notifications}
          onClick={() =>
            navigate("/notifications")
          }
        >
          <Bell
            size={19}
            strokeWidth={1.9}
          />

          {unreadCount > 0 && (
            <span className="header__notification-badge">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>

        <div className="header__divider" />

        <button
          className="header__profile"
          type="button"
          onClick={() =>
            navigate("/profile")
          }
          aria-label={labels.profile}
          title={labels.profile}
        >
          {user?.image ? (
            <img
              className="header__avatar"
              src={user.image}
              alt=""
            />
          ) : (
            <div className="header__avatar">
              {firstName.charAt(0)}
            </div>
          )}

          <div className="header__profile-info">
            <strong>
              {firstName} {lastName}
            </strong>

            <span>{role}</span>
          </div>

          <ChevronDown
            size={16}
            strokeWidth={2}
          />
        </button>
      </div>
    </header>
  );
}

export default Header;