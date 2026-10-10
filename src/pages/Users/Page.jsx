import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import {
  Link,
  useSearchParams,
} from "react-router";
import { useTranslation } from "react-i18next";
import { getUsers } from "../../services/api";
import "./Page.css";

const PAGE_SIZE = 10;

const roleOptions = [
  {
    value: "",
    labelKey: "users.filters.allRoles",
  },
  {
    value: "admin",
    labelKey: "users.roles.admin",
  },
  {
    value: "moderator",
    labelKey: "users.roles.moderator",
  },
  {
    value: "user",
    labelKey: "users.roles.user",
  },
];

const getRoleClass = (role) => {
  if (role === "admin") {
    return "user-role user-role--admin";
  }

  if (role === "moderator") {
    return "user-role user-role--moderator";
  }

  return "user-role user-role--user";
};

function Users() {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const urlSearch = searchParams.get("q") || "";
  const urlRole = searchParams.get("role") || "";

  const currentPage = Math.max(
    Number(searchParams.get("page")) || 1,
    1
  );

  const [searchInput, setSearchInput] =
    useState(urlSearch);

  const [users, setUsers] = useState([]);

  const [totalUsers, setTotalUsers] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isFilterOpen, setIsFilterOpen] =
    useState(false);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const controller =
      new AbortController();

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUsers({
          limit: PAGE_SIZE,
          skip:
            (currentPage - 1) *
            PAGE_SIZE,
          search: urlSearch,
          role: urlRole,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setUsers(data.users || []);
          setTotalUsers(data.total || 0);
        }
      } catch (requestError) {
        if (
          requestError.name !==
          "AbortError"
        ) {
          setError(
            t("users.error.message")
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      controller.abort();
    };
  }, [
    currentPage,
    urlRole,
    urlSearch,
    t,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextParams =
        new URLSearchParams(
          searchParams
        );

      const normalizedSearch =
        searchInput.trim();

      if (normalizedSearch) {
        nextParams.set(
          "q",
          normalizedSearch
        );
      } else {
        nextParams.delete("q");
      }

      nextParams.set("page", "1");

      setSearchParams(nextParams);
    }, 450);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchInput]);

  const totalPages = Math.max(
    Math.ceil(
      totalUsers / PAGE_SIZE
    ),
    1
  );

  const paginationItems = useMemo(() => {
    const items = [];

    const start = Math.max(
      1,
      currentPage - 2
    );

    const end = Math.min(
      totalPages,
      currentPage + 2
    );

    for (
      let page = start;
      page <= end;
      page += 1
    ) {
      items.push(page);
    }

    return items;
  }, [
    currentPage,
    totalPages,
  ]);

  const setPage = (page) => {
    const safePage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    const nextParams =
      new URLSearchParams(
        searchParams
      );

    nextParams.set(
      "page",
      String(safePage)
    );

    setSearchParams(nextParams);
  };

  const handleRoleChange = (
    role
  ) => {
    const nextParams =
      new URLSearchParams(
        searchParams
      );

    if (role) {
      nextParams.set(
        "role",
        role
      );
    } else {
      nextParams.delete("role");
    }

    nextParams.set(
      "page",
      "1"
    );

    setSearchParams(nextParams);

    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchInput("");

    setSearchParams({});
  };

  const renderSkeletonRows = () => {
    return Array.from(
      { length: 7 },
      (_, index) => (
        <div
          className="users-skeleton-row"
          key={index}
        >
          <div className="users-skeleton-user">
            <span className="skeleton skeleton--avatar" />

            <div className="skeleton-group">
              <span className="skeleton skeleton--name" />
              <span className="skeleton skeleton--email" />
            </div>
          </div>

          <span className="skeleton skeleton--text" />

          <span className="skeleton skeleton--badge" />

          <span className="skeleton skeleton--text skeleton--short" />

          <span className="skeleton skeleton--action" />
        </div>
      )
    );
  };

  return (
    <section className="users-page">
      <div className="users-page__hero">
        <div>
          <span className="users-page__eyebrow">
            {t("users.eyebrow")}
          </span>

          <h1 className="users-page__title">
            {t("users.title")}
          </h1>

          <p className="users-page__subtitle">
            {t("users.subtitle")}
          </p>
        </div>

        <Link
          className="users-page__create"
          to="/users/new"
        >
          <Plus
            size={17}
            strokeWidth={2.4}
          />

          {t("users.createUser")}
        </Link>
      </div>

      <div className="users-toolbar">
        <div className="users-toolbar__search">
          <Search
            size={18}
            strokeWidth={2}
          />

          <input
            type="search"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(
                event.target.value
              )
            }
            placeholder={t(
              "users.searchPlaceholder"
            )}
            aria-label={t(
              "users.searchPlaceholder"
            )}
          />

          {searchInput && (
            <button
              className="users-toolbar__clear"
              type="button"
              onClick={() =>
                setSearchInput("")
              }
              aria-label={t(
                "common.clear"
              )}
            >
              ×
            </button>
          )}
        </div>

        <div className="users-toolbar__actions">
          <div className="users-filter">
            <button
              className={`users-filter__button ${
                isFilterOpen
                  ? "users-filter__button--active"
                  : ""
              } ${
                urlRole
                  ? "users-filter__button--selected"
                  : ""
              }`}
              type="button"
              onClick={() =>
                setIsFilterOpen(
                  (prev) => !prev
                )
              }
            >
              <SlidersHorizontal
                size={16}
              />

              {t(
                "users.filters.title"
              )}

              {urlRole && (
                <span className="users-filter__dot" />
              )}
            </button>

            {isFilterOpen && (
              <div className="users-filter__menu">
                <div className="users-filter__header">
                  {t(
                    "users.filters.title"
                  )}
                </div>

                {roleOptions.map(
                  (role) => (
                    <button
                      key={
                        role.value ||
                        "all"
                      }
                      className={`users-filter__option ${
                        urlRole ===
                        role.value
                          ? "users-filter__option--active"
                          : ""
                      }`}
                      type="button"
                      onClick={() =>
                        handleRoleChange(
                          role.value
                        )
                      }
                    >
                      {t(
                        role.labelKey
                      )}
                    </button>
                  )
                )}

                {(urlRole ||
                  urlSearch) && (
                  <button
                    className="users-filter__clear"
                    type="button"
                    onClick={
                      clearFilters
                    }
                  >
                    {t(
                      "users.filters.clear"
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            className="users-toolbar__settings"
            type="button"
            aria-label={t(
              "users.table.settings"
            )}
          >
            <MoreHorizontal
              size={18}
            />
          </button>
        </div>
      </div>

      <div className="users-card">
        <div className="users-card__header">
          <div>
            <h2>
              {t(
                "users.table.title"
              )}
            </h2>

            <span>
              {t(
                "users.table.showing",
                {
                  count:
                    users.length,
                  total:
                    totalUsers,
                }
              )}
            </span>
          </div>

          {urlRole && (
            <div className="users-card__active-filter">
              {t(
                "users.filters.active"
              )}

              :

              <strong>
                {roleOptions.find(
                  (role) =>
                    role.value ===
                    urlRole
                )
                  ? t(
                      roleOptions.find(
                        (role) =>
                          role.value ===
                          urlRole
                      ).labelKey
                    )
                  : urlRole}
              </strong>
            </div>
          )}
        </div>

        <div className="users-table-wrapper">
          <div className="users-table">
            <div className="users-table__head">
              <span>
                {t(
                  "users.table.user"
                )}
              </span>

              <span>
                {t(
                  "users.table.company"
                )}
              </span>

              <span>
                {t(
                  "users.table.role"
                )}
              </span>

              <span>
                {t(
                  "users.table.age"
                )}
              </span>

              <span>
                {t(
                  "users.table.actions"
                )}
              </span>
            </div>

            {loading ? (
              <div className="users-skeleton">
                {renderSkeletonRows()}
              </div>
            ) : error ? (
              <div className="users-state">
                <div className="users-state__icon users-state__icon--error">
                  !
                </div>

                <h3>
                  {t(
                    "users.error.title"
                  )}
                </h3>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={() =>
                    setSearchParams(
                      searchParams
                    )
                  }
                >
                  {t(
                    "common.tryAgain"
                  )}
                </button>
              </div>
            ) : users.length ===
              0 ? (
              <div className="users-state">
                <div className="users-state__icon">
                  <UsersRound
                    size={21}
                  />
                </div>

                <h3>
                  {t(
                    "users.empty.title"
                  )}
                </h3>

                <p>
                  {t(
                    "users.empty.message"
                  )}
                </p>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                >
                  {t(
                    "users.empty.clear"
                  )}
                </button>
              </div>
            ) : (
              users.map(
                (user) => (
                  <div
                    className="users-table__row"
                    key={user.id}
                  >
                    <div className="user-cell">
                      <img
                        className="user-cell__avatar"
                        src={user.image}
                        alt={`${user.firstName} ${user.lastName}`}
                      />

                      <div className="user-cell__identity">
                        <strong>
                          {
                            user.firstName
                          }{" "}
                          {
                            user.lastName
                          }
                        </strong>

                        <span>
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="company-cell">
                      <strong>
                        {user.company
                          ?.name ||
                          t(
                            "users.notAvailable"
                          )}
                      </strong>

                      <span>
                        {user.company
                          ?.title ||
                          t(
                            "users.notAvailable"
                          )}
                      </span>
                    </div>

                    <div>
                      <span
                        className={getRoleClass(
                          user.role
                        )}
                      >
                        {t(
                          `users.roles.${user.role}`,
                          {
                            defaultValue:
                              user.role,
                          }
                        )}
                      </span>
                    </div>

                    <div className="age-cell">
                      {user.age}
                    </div>

                    <div className="row-actions">
                      <Link
                        className="row-actions__button"
                        to={`/users/${user.id}`}
                        aria-label={t(
                          "users.actions.view"
                        )}
                      >
                        <Eye
                          size={16}
                        />
                      </Link>

                      <button
                        type="button"
                        aria-label={t(
                          "users.actions.more"
                        )}
                      >
                        <MoreHorizontal
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {!loading &&
          !error &&
          users.length > 0 && (
            <div className="users-pagination">
              <span className="users-pagination__info">
                {t(
                  "users.pagination.page",
                  {
                    current:
                      currentPage,
                    total:
                      totalPages,
                  }
                )}
              </span>

              <div className="users-pagination__controls">
                <button
                  type="button"
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    setPage(
                      currentPage -
                        1
                    )
                  }
                  aria-label={t(
                    "users.pagination.previous"
                  )}
                >
                  <ChevronLeft
                    size={17}
                  />
                </button>

                {paginationItems.map(
                  (page) => (
                    <button
                      key={page}
                      className={
                        page ===
                        currentPage
                          ? "users-pagination__page--active"
                          : ""
                      }
                      type="button"
                      onClick={() =>
                        setPage(page)
                      }
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      currentPage +
                        1
                    )
                  }
                  aria-label={t(
                    "users.pagination.next"
                  )}
                >
                  <ChevronRight
                    size={17}
                  />
                </button>
              </div>
            </div>
          )}
      </div>
    </section>
  );
}

export default Users;