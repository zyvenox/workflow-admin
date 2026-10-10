import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDollarSign,
  Ticket,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./Page.css";

const stats = [
  {
    titleKey: "dashboard.totalRevenue",
    value: "€48,250",
    change: "+12.8%",
    positive: true,
    icon: CircleDollarSign,
  },
  {
    titleKey: "dashboard.totalUsers",
    value: "1,248",
    change: "+8.4%",
    positive: true,
    icon: Users,
  },
  {
    titleKey: "dashboard.activeProjects",
    value: "86",
    change: "+5.2%",
    positive: true,
    icon: BriefcaseBusiness,
  },
  {
    titleKey: "dashboard.openTickets",
    value: "24",
    change: "-3.1%",
    positive: true,
    icon: Ticket,
  },
];

const projects = [
  {
    nameKey: "dashboard.projects.websiteRedesign",
    clientKey: "dashboard.clients.acme",
    statusKey: "dashboard.status.inProgress",
    statusClass: "in-progress",
    progress: 72,
  },
  {
    nameKey: "dashboard.projects.mobileApplication",
    clientKey: "dashboard.clients.nordtech",
    statusKey: "dashboard.status.review",
    statusClass: "review",
    progress: 88,
  },
  {
    nameKey: "dashboard.projects.crmIntegration",
    clientKey: "dashboard.clients.berlinWorks",
    statusKey: "dashboard.status.completed",
    statusClass: "completed",
    progress: 100,
  },
  {
    nameKey: "dashboard.projects.analyticsPlatform",
    clientKey: "dashboard.clients.novaSystems",
    statusKey: "dashboard.status.planning",
    statusClass: "planning",
    progress: 32,
  },
];

const chartDays = [
  "dashboard.days.mon",
  "dashboard.days.tue",
  "dashboard.days.wed",
  "dashboard.days.thu",
  "dashboard.days.fri",
  "dashboard.days.sat",
  "dashboard.days.sun",
];

function Dashboard() {
  const { t, i18n } = useTranslation();

  const currentDate = new Intl.DateTimeFormat(
    i18n.resolvedLanguage,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(new Date());

  return (
    <section className="dashboard-page">
      <div className="dashboard__hero">
        <div>
          <span className="dashboard__eyebrow">
            {t("dashboard.overview")}
          </span>

          <h1 className="dashboard__title">
            {t("dashboard.goodMorning")}
          </h1>

          <p className="dashboard__subtitle">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div className="dashboard__date">
          <span>{t("dashboard.today")}</span>

          <strong>{currentDate}</strong>
        </div>
      </div>

      <div className="dashboard__stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="stat-card" key={stat.titleKey}>
              <div className="stat-card__top">
                <div className="stat-card__icon">
                  <Icon size={20} strokeWidth={2} />
                </div>

                <span
                  className={`stat-card__change ${
                    stat.positive
                      ? "stat-card__change--positive"
                      : "stat-card__change--negative"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}

                  {stat.change}
                </span>
              </div>

              <div className="stat-card__content">
                <span>{t(stat.titleKey)}</span>

                <strong>{stat.value}</strong>
              </div>

              <p>{t("dashboard.vsLastMonth")}</p>
            </article>
          );
        })}
      </div>

      <div className="dashboard__grid">
        <article className="panel panel--chart">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">
                {t("dashboard.performance")}
              </span>

              <h2>{t("dashboard.revenueOverview")}</h2>
            </div>

            <button className="panel__select" type="button">
              {t("dashboard.last7Days")}
            </button>
          </div>

          <div className="fake-chart">
            <div className="fake-chart__grid">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="fake-chart__line">
              <span style={{ left: "3%", top: "76%" }} />
              <span style={{ left: "15%", top: "63%" }} />
              <span style={{ left: "28%", top: "68%" }} />
              <span style={{ left: "41%", top: "45%" }} />
              <span style={{ left: "54%", top: "52%" }} />
              <span style={{ left: "67%", top: "28%" }} />
              <span style={{ left: "80%", top: "36%" }} />
              <span style={{ left: "93%", top: "16%" }} />
            </div>

            <div className="fake-chart__labels">
              {chartDays.map((dayKey) => (
                <span key={dayKey}>{t(dayKey)}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">
                {t("dashboard.liveActivity")}
              </span>

              <h2>{t("dashboard.recentProjects")}</h2>
            </div>

            <button className="panel__link" type="button">
              {t("dashboard.viewAll")}
            </button>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <div className="project-row" key={project.nameKey}>
                <div className="project-row__main">
                  <div className="project-row__icon">
                    <BriefcaseBusiness size={16} />
                  </div>

                  <div>
                    <strong>{t(project.nameKey)}</strong>

                    <span>{t(project.clientKey)}</span>
                  </div>
                </div>

                <div className="project-row__meta">
                  <span
                    className={`project-status project-status--${project.statusClass}`}
                  >
                    {t(project.statusKey)}
                  </span>

                  <div className="project-progress">
                    <div className="project-progress__track">
                      <div
                        className="project-progress__value"
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>

                    <span>{project.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;