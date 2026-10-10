import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Download,
  FolderKanban,
  Headphones,
  TicketCheck,
  TrendingUp,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import { useProjects } from "../../context/ProjectsContext";
import { useTickets } from "../../context/TicketsContext";

import analyticsTranslations from "../../i18n/analytics";

import "./Page.css";

const periodOptions = [
  {
    value: "7",
    key: "days7",
  },
  {
    value: "30",
    key: "days30",
  },
  {
    value: "90",
    key: "days90",
  },
];

const revenueSeries = {
  7: [
    4200,
    6100,
    5400,
    7600,
    7200,
    9100,
    10400,
  ],

  30: [
    6200,
    7800,
    9200,
    8600,
    11800,
    12600,
    14100,
    15400,
    14900,
    17100,
    18400,
    19800,
  ],

  90: [
    8200,
    10400,
    9800,
    12600,
    14100,
    13300,
    15800,
    17600,
    19100,
    18400,
    21300,
    23800,
  ],
};

function Page() {
  const { i18n } =
    useTranslation();

  const language =
    i18n.language?.split("-")[0] ||
    "en";

  const text =
    analyticsTranslations[
      language
    ] || analyticsTranslations.en;

  const {
    projects,
    loading: projectsLoading,
  } = useProjects();

  const {
    tickets,
    loading: ticketsLoading,
  } = useTickets();

  const [period, setPeriod] =
    useState("30");

  const [exporting, setExporting] =
    useState(false);

  const loading =
    projectsLoading ||
    ticketsLoading;

  const totalBudget =
    useMemo(() => {
      return projects.reduce(
        (total, project) =>
          total +
          Number(project.budget || 0),
        0
      );
    }, [projects]);

  const activeProjects =
    useMemo(() => {
      return projects.filter(
        (project) =>
          project.status ===
            "planning" ||
          project.status ===
            "in-progress" ||
          project.status ===
            "review"
      ).length;
    }, [projects]);

  const resolvedTickets =
    useMemo(() => {
      return tickets.filter(
        (ticket) =>
          ticket.status ===
            "resolved" ||
          ticket.status ===
            "closed"
      ).length;
    }, [tickets]);

  const averageProgress =
    useMemo(() => {
      if (!projects.length) {
        return 0;
      }

      const totalProgress =
        projects.reduce(
          (total, project) =>
            total +
            Number(
              project.progress || 0
            ),
          0
        );

      return Math.round(
        totalProgress /
          projects.length
      );
    }, [projects]);

  const resolvedRate =
    tickets.length
      ? Math.round(
          (resolvedTickets /
            tickets.length) *
            100
        )
      : 0;

  const projectStatusData =
    useMemo(() => {
      return [
        {
          key: "planning",
          value: projects.filter(
            (project) =>
              project.status ===
              "planning"
          ).length,
        },
        {
          key: "inProgress",
          value: projects.filter(
            (project) =>
              project.status ===
              "in-progress"
          ).length,
        },
        {
          key: "review",
          value: projects.filter(
            (project) =>
              project.status ===
              "review"
          ).length,
        },
        {
          key: "completed",
          value: projects.filter(
            (project) =>
              project.status ===
              "completed"
          ).length,
        },
      ];
    }, [projects]);

  const ticketPriorityData =
    useMemo(() => {
      return [
        {
          key: "urgent",
          value: tickets.filter(
            (ticket) =>
              ticket.priority ===
              "urgent"
          ).length,
        },
        {
          key: "high",
          value: tickets.filter(
            (ticket) =>
              ticket.priority ===
              "high"
          ).length,
        },
        {
          key: "medium",
          value: tickets.filter(
            (ticket) =>
              ticket.priority ===
              "medium"
          ).length,
        },
        {
          key: "low",
          value: tickets.filter(
            (ticket) =>
              ticket.priority ===
              "low"
          ).length,
        },
      ];
    }, [tickets]);

  const topProjects =
    useMemo(() => {
      return [...projects]
        .sort(
          (a, b) =>
            Number(b.progress || 0) -
            Number(a.progress || 0)
        )
        .slice(0, 4);
    }, [projects]);

  const chartData =
    revenueSeries[period];

  const chartWidth = 720;
  const chartHeight = 280;

  const chartPadding = {
    top: 30,
    right: 26,
    bottom: 42,
    left: 50,
  };

  const maxValue =
    Math.max(...chartData);

  const minValue =
    Math.min(...chartData);

  const range =
    Math.max(
      maxValue - minValue,
      1
    );

  const chartPoints =
    chartData.map(
      (value, index) => {
        const x =
          chartPadding.left +
          (index /
            (chartData.length - 1)) *
            (chartWidth -
              chartPadding.left -
              chartPadding.right);

        const y =
          chartPadding.top +
          (1 -
            (value - minValue) /
              range) *
            (chartHeight -
              chartPadding.top -
              chartPadding.bottom);

        return {
          x,
          y,
          value,
        };
      }
    );

  const linePoints =
    chartPoints
      .map(
        (point) =>
          `${point.x},${point.y}`
      )
      .join(" ");

  const areaPoints = [
    `${chartPadding.left},${
      chartHeight -
      chartPadding.bottom
    }`,
    ...chartPoints.map(
      (point) =>
        `${point.x},${point.y}`
    ),
    `${
      chartWidth -
      chartPadding.right
    },${
      chartHeight -
      chartPadding.bottom
    }`,
  ].join(" ");

  const formatCurrency = (
    value
  ) => {
    return new Intl.NumberFormat(
      language,
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
    try {
      return new Intl.DateTimeFormat(
        language,
        {
          dateStyle: "medium",
        }
      ).format(
        new Date(
          `${value}T00:00:00`
        )
      );
    } catch {
      return value;
    }
  };

  const handleExport = () => {
    setExporting(true);

    const rows = [
      [
        "Project",
        "Client",
        "Status",
        "Priority",
        "Budget",
        "Progress",
        "Deadline",
      ],
      ...projects.map(
        (project) => [
          project.name,
          project.client,
          project.status,
          project.priority,
          project.budget,
          project.progress,
          project.deadline,
        ]
      ),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(cell ?? "").replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob =
      new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "workflow-analytics-report.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    window.setTimeout(() => {
      setExporting(false);
    }, 500);
  };

  if (loading) {
    return (
      <main className="analytics-page">
        <div className="analytics-loading">
          <div className="analytics-loading__hero" />

          <div className="analytics-loading__cards">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="analytics-loading__card"
              />
            ))}
          </div>

          <div className="analytics-loading__content">
            <div className="analytics-loading__large" />

            <div className="analytics-loading__side" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="analytics-page">
      {/* HERO */}

      <section className="analytics-hero">
        <div>
          <span className="analytics-hero__eyebrow">
            {text.eyebrow}
          </span>

          <h1>{text.title}</h1>

          <p>{text.subtitle}</p>
        </div>

        <div className="analytics-hero__actions">
          <div className="analytics-period">
            <CalendarDays size={15} />

            <span>
              {text.period}
            </span>

            <select
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target.value
                )
              }
              aria-label={text.period}
            >
              {periodOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {text[option.key]}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            type="button"
            className="analytics-export"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download size={16} />

            {exporting
              ? text.exporting
              : text.export}
          </button>
        </div>
      </section>

      {/* METRICS */}

      <section className="analytics-metrics">
        <article className="analytics-metric">
          <div className="analytics-metric__icon analytics-metric__icon--violet">
            <CircleDollarSign
              size={19}
            />
          </div>

          <div className="analytics-metric__body">
            <span>
              {
                text.metrics
                  .portfolioValue
              }
            </span>

            <strong>
              {formatCurrency(
                totalBudget
              )}
            </strong>

            <small>
              <TrendingUp
                size={12}
              />
              Portfolio value
            </small>
          </div>
        </article>

        <article className="analytics-metric">
          <div className="analytics-metric__icon analytics-metric__icon--blue">
            <FolderKanban
              size={19}
            />
          </div>

          <div className="analytics-metric__body">
            <span>
              {
                text.metrics
                  .activeProjects
              }
            </span>

            <strong>
              {activeProjects}
            </strong>

            <small>
              <ArrowUpRight
                size={12}
              />
              {projects.length} total
            </small>
          </div>
        </article>

        <article className="analytics-metric">
          <div className="analytics-metric__icon analytics-metric__icon--green">
            <TicketCheck
              size={19}
            />
          </div>

          <div className="analytics-metric__body">
            <span>
              {
                text.metrics
                  .resolvedTickets
              }
            </span>

            <strong>
              {resolvedTickets}
            </strong>

            <small>
              <CheckCircle2
                size={12}
              />
              {resolvedRate}% rate
            </small>
          </div>
        </article>

        <article className="analytics-metric">
          <div className="analytics-metric__icon analytics-metric__icon--orange">
            <Activity size={19} />
          </div>

          <div className="analytics-metric__body">
            <span>
              {
                text.metrics
                  .averageProgress
              }
            </span>

            <strong>
              {averageProgress}%
            </strong>

            <small>
              <TrendingUp
                size={12}
              />
              Across all projects
            </small>
          </div>
        </article>
      </section>

      {/* MAIN ANALYTICS GRID */}

      <section className="analytics-grid">
        {/* PERFORMANCE CHART */}

        <article className="analytics-card analytics-card--chart">
          <div className="analytics-card__header">
            <div>
              <span className="analytics-card__eyebrow">
                {text.overview.budget}
              </span>

              <h2>
                {text.overview.title}
              </h2>

              <p>
                {text.overview.subtitle}
              </p>
            </div>

            <div className="analytics-card__trend">
              <TrendingUp size={15} />

              <span>
                +18.6%
              </span>
            </div>
          </div>

          <div className="analytics-chart">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label={
                text.overview.title
              }
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="analyticsArea"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6366f1"
                    stopOpacity="0.2"
                  />

                  <stop
                    offset="100%"
                    stopColor="#6366f1"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3].map(
                (row) => {
                  const y =
                    chartPadding.top +
                    (row / 3) *
                      (chartHeight -
                        chartPadding.top -
                        chartPadding.bottom);

                  return (
                    <line
                      key={row}
                      x1={
                        chartPadding.left
                      }
                      x2={
                        chartWidth -
                        chartPadding.right
                      }
                      y1={y}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 7"
                    />
                  );
                }
              )}

              <polygon
                points={areaPoints}
                fill="url(#analyticsArea)"
              />

              <polyline
                points={linePoints}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartPoints.map(
                (point, index) => (
                  <g key={index}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="#ffffff"
                      stroke="#6366f1"
                      strokeWidth="3"
                    />

                    <text
                      x={point.x}
                      y={
                        chartHeight -
                        16
                      }
                      textAnchor="middle"
                      fontSize="10"
                      fill="#94a3b8"
                    >
                      {index + 1}
                    </text>
                  </g>
                )
              )}
            </svg>

            <div className="analytics-chart__current">
              <span>
                {text.overview.budget}
              </span>

              <strong>
                {formatCurrency(
                  chartData[
                    chartData.length -
                      1
                  ]
                )}
              </strong>
            </div>
          </div>
        </article>

        {/* PROJECT STATUS */}

        <article className="analytics-card analytics-card--status">
          <div className="analytics-card__header">
            <div>
              <span className="analytics-card__eyebrow">
                Projects
              </span>

              <h2>
                {
                  text.projectStatus
                    .title
                }
              </h2>

              <p>
                {
                  text.projectStatus
                    .subtitle
                }
              </p>
            </div>

            <FolderKanban
              size={19}
              className="analytics-card__header-icon"
            />
          </div>

          <div className="analytics-donut-wrap">
            <div
              className="analytics-donut"
              style={{
                "--planning":
                  projectStatusData[0]
                    .value,
                "--in-progress":
                  projectStatusData[1]
                    .value,
                "--review":
                  projectStatusData[2]
                    .value,
                "--completed":
                  projectStatusData[3]
                    .value,
                "--total":
                  Math.max(
                    projects.length,
                    1
                  ),
              }}
            >
              <div className="analytics-donut__center">
                <strong>
                  {projects.length}
                </strong>

                <span>
                  Total
                </span>
              </div>
            </div>

            <div className="analytics-legend">
              {projectStatusData.map(
                (item) => (
                  <div
                    key={item.key}
                    className="analytics-legend__item"
                  >
                    <span
                      className={`analytics-legend__dot analytics-legend__dot--${item.key}`}
                    />

                    <span>
                      {
                        text
                          .projectStatus[
                          item.key
                        ]
                      }
                    </span>

                    <strong>
                      {item.value}
                    </strong>
                  </div>
                )
              )}
            </div>
          </div>
        </article>

        {/* TICKET PRIORITIES */}

        <article className="analytics-card">
          <div className="analytics-card__header">
            <div>
              <span className="analytics-card__eyebrow">
                Support
              </span>

              <h2>
                {text.tickets.title}
              </h2>

              <p>
                {text.tickets.subtitle}
              </p>
            </div>

            <Headphones
              size={19}
              className="analytics-card__header-icon"
            />
          </div>

          <div className="analytics-priority-list">
            {ticketPriorityData.map(
              (item) => {
                const percentage =
                  tickets.length
                    ? Math.round(
                        (item.value /
                          tickets.length) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={item.key}
                    className="analytics-priority"
                  >
                    <div className="analytics-priority__top">
                      <span
                        className={`analytics-priority__dot analytics-priority__dot--${item.key}`}
                      />

                      <span>
                        {
                          text.tickets[
                            item.key
                          ]
                        }
                      </span>

                      <strong>
                        {item.value}
                      </strong>
                    </div>

                    <div className="analytics-priority__track">
                      <span
                        className={`analytics-priority__bar analytics-priority__bar--${item.key}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </article>

        {/* TOP PROJECTS */}

        <article className="analytics-card analytics-card--projects">
          <div className="analytics-card__header">
            <div>
              <span className="analytics-card__eyebrow">
                Delivery
              </span>

              <h2>
                {
                  text.topProjects
                    .title
                }
              </h2>

              <p>
                {
                  text.topProjects
                    .subtitle
                }
              </p>
            </div>

            <TrendingUp
              size={19}
              className="analytics-card__header-icon"
            />
          </div>

          {topProjects.length ===
          0 ? (
            <div className="analytics-card__empty">
              {
                text.topProjects
                  .noProjects
              }
            </div>
          ) : (
            <div className="analytics-project-list">
              {topProjects.map(
                (project) => (
                  <div
                    key={project.id}
                    className="analytics-project"
                  >
                    <div className="analytics-project__top">
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
                        </span>
                      </div>

                      <b>
                        {
                          project.progress
                        }
                        %
                      </b>
                    </div>

                    <div className="analytics-project__progress">
                      <span
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>

                    <div className="analytics-project__meta">
                      <span>
                        <CircleDollarSign
                          size={13}
                        />

                        {formatCurrency(
                          project.budget
                        )}
                      </span>

                      <span>
                        <CalendarDays
                          size={13}
                        />

                        {formatDate(
                          project.deadline
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </article>
      </section>

      {/* INSIGHTS */}

      <section className="analytics-insights">
        <div className="analytics-insights__header">
          <div>
            <span className="analytics-card__eyebrow">
              <SparkleIcon />
              Intelligence
            </span>

            <h2>
              {text.insights.title}
            </h2>
          </div>
        </div>

        <div className="analytics-insights__grid">
          <div className="analytics-insight">
            <div className="analytics-insight__icon">
              <CircleDollarSign
                size={17}
              />
            </div>

            <p>
              {
                text.insights
                  .budgetInsight
              }
            </p>
          </div>

          <div className="analytics-insight">
            <div className="analytics-insight__icon">
              <Headphones
                size={17}
              />
            </div>

            <p>
              {
                text.insights
                  .supportInsight
              }
            </p>
          </div>

          <div className="analytics-insight">
            <div className="analytics-insight__icon">
              <CheckCircle2
                size={17}
              />
            </div>

            <p>
              {
                text.insights
                  .deliveryInsight
              }
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default Page;