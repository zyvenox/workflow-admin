import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  UserRound,
  Weight,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router";
import { useTranslation } from "react-i18next";
import { getUserById } from "../../services/api";
import "./Page.css";

const getRoleClass = (role) => {
  if (role === "admin") {
    return "details-role details-role--admin";
  }

  if (role === "moderator") {
    return "details-role details-role--moderator";
  }

  return "details-role details-role--user";
};

function UserDetails() {
  const { userId } = useParams();
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUserById(
          userId,
          controller.signal
        );

        if (!controller.signal.aborted) {
          setUser(data);
        }
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(t("userDetails.error.message"));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      controller.abort();
    };
  }, [userId, t]);

  const formatDate = (date) => {
    if (!date) {
      return t("userDetails.notAvailable");
    }

    return new Intl.DateTimeFormat(
      i18n.resolvedLanguage,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ).format(new Date(date));
  };

  if (loading) {
    return (
      <section className="user-details-page">
        <div className="user-details__topbar">
          <div className="details-skeleton details-skeleton--back" />
        </div>

        <div className="details-profile-card">
          <div className="details-skeleton details-skeleton--large-avatar" />

          <div className="details-profile-card__info">
            <div className="details-skeleton details-skeleton--title" />
            <div className="details-skeleton details-skeleton--subtitle" />
            <div className="details-skeleton details-skeleton--badge" />
          </div>
        </div>

        <div className="details-section-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              className="details-info-card details-info-card--skeleton"
              key={index}
            >
              <div className="details-skeleton details-skeleton--icon" />

              <div className="details-skeleton-group">
                <div className="details-skeleton details-skeleton--label" />
                <div className="details-skeleton details-skeleton--value" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !user) {
    return (
      <section className="user-details-page">
        <div className="user-details__error">
          <div className="user-details__error-icon">
            !
          </div>

          <h1>{t("userDetails.error.title")}</h1>

          <p>
            {error || t("userDetails.error.message")}
          </p>

          <Link
            className="user-details__back-button"
            to="/users"
          >
            <ArrowLeft size={16} />
            {t("userDetails.backToUsers")}
          </Link>
        </div>
      </section>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <section className="user-details-page">
      <div className="user-details__topbar">
        <Link
          className="user-details__back-link"
          to="/users"
        >
          <ArrowLeft size={16} />
          {t("userDetails.backToUsers")}
        </Link>

        <span className="user-details__breadcrumb">
          {t("userDetails.breadcrumb")}
          <strong>{user.firstName}</strong>
        </span>
      </div>

      <div className="details-profile-card">
        <div className="details-profile-card__avatar-wrapper">
          <img
            className="details-profile-card__avatar"
            src={user.image}
            alt={fullName}
          />

          <span className="details-profile-card__online" />
        </div>

        <div className="details-profile-card__info">
          <div className="details-profile-card__name-row">
            <div>
              <span className="details-profile-card__eyebrow">
                {t("userDetails.profile")}
              </span>

              <h1>{fullName}</h1>

              <p>
                @{user.username}
              </p>
            </div>

            <span className={getRoleClass(user.role)}>
              <ShieldCheck size={13} />
              {t(
                `users.roles.${user.role}`,
                {
                  defaultValue: user.role,
                }
              )}
            </span>
          </div>

          <div className="details-profile-card__contact">
            <a href={`mailto:${user.email}`}>
              <Mail size={15} />
              {user.email}
            </a>

            <a href={`tel:${user.phone}`}>
              <Phone size={15} />
              {user.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="details-section">
        <div className="details-section__header">
          <div>
            <span className="user-details__eyebrow">
              {t("userDetails.overview")}
            </span>

            <h2>{t("userDetails.personalInformation")}</h2>
          </div>
        </div>

        <div className="details-section-grid">
          <article className="details-info-card">
            <div className="details-info-card__icon">
              <UserRound size={18} />
            </div>

            <div className="details-info-card__content">
              <span>
                {t("userDetails.fields.username")}
              </span>

              <strong>
                @{user.username}
              </strong>
            </div>
          </article>

          <article className="details-info-card">
            <div className="details-info-card__icon">
              <CalendarDays size={18} />
            </div>

            <div className="details-info-card__content">
              <span>
                {t("userDetails.fields.birthDate")}
              </span>

              <strong>
                {formatDate(user.birthDate)}
              </strong>
            </div>
          </article>

          <article className="details-info-card">
            <div className="details-info-card__icon">
              <Ruler size={18} />
            </div>

            <div className="details-info-card__content">
              <span>
                {t("userDetails.fields.height")}
              </span>

              <strong>
                {user.height
                  ? `${user.height} cm`
                  : t("userDetails.notAvailable")}
              </strong>
            </div>
          </article>

          <article className="details-info-card">
            <div className="details-info-card__icon">
              <Weight size={18} />
            </div>

            <div className="details-info-card__content">
              <span>
                {t("userDetails.fields.weight")}
              </span>

              <strong>
                {user.weight
                  ? `${user.weight} kg`
                  : t("userDetails.notAvailable")}
              </strong>
            </div>
          </article>
        </div>
      </div>

      <div className="details-main-grid">
        <article className="details-panel">
          <div className="details-panel__header">
            <div className="details-panel__icon">
              <Building2 size={18} />
            </div>

            <div>
              <span>{t("userDetails.company")}</span>
              <h2>
                {user.company?.name ||
                  t("userDetails.notAvailable")}
              </h2>
            </div>
          </div>

          <div className="details-panel__rows">
            <div>
              <span>
                {t("userDetails.fields.department")}
              </span>

              <strong>
                {user.company?.department ||
                  t("userDetails.notAvailable")}
              </strong>
            </div>

            <div>
              <span>
                {t("userDetails.fields.jobTitle")}
              </span>

              <strong>
                {user.company?.title ||
                  t("userDetails.notAvailable")}
              </strong>
            </div>

            <div>
              <span>
                {t("userDetails.fields.companyAddress")}
              </span>

              <strong>
                {user.company?.address?.address ||
                  t("userDetails.notAvailable")}
              </strong>
            </div>
          </div>
        </article>

        <article className="details-panel">
          <div className="details-panel__header">
            <div className="details-panel__icon">
              <MapPin size={18} />
            </div>

            <div>
              <span>{t("userDetails.location")}</span>
              <h2>
                {user.address?.city ||
                  t("userDetails.notAvailable")}
              </h2>
            </div>
          </div>

          <div className="details-panel__rows">
            <div>
              <span>
                {t("userDetails.fields.address")}
              </span>

              <strong>
                {user.address?.address ||
                  t("userDetails.notAvailable")}
              </strong>
            </div>

            <div>
              <span>
                {t("userDetails.fields.city")}
              </span>

              <strong>
                {user.address?.city ||
                  t("userDetails.notAvailable")}
              </strong>
            </div>

            <div>
              <span>
                {t("userDetails.fields.state")}
              </span>

              <strong>
                {user.address?.state ||
                  t("userDetails.notAvailable")}
              </strong>
            </div>
          </div>
        </article>
      </div>

      <div className="details-footer-card">
        <div className="details-footer-card__icon">
          <BriefcaseBusiness size={18} />
        </div>

        <div>
          <span>{t("userDetails.accountStatus")}</span>

          <strong>
            {t("userDetails.activeAccount")}
          </strong>
        </div>

        <span className="details-footer-card__status">
          {t("userDetails.active")}
        </span>
      </div>
    </section>
  );
}

export default UserDetails;