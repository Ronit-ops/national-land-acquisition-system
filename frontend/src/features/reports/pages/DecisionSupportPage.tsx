import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  Flag,
  UserCheck,
  WalletCards,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  getAllBottlenecks,
  getAllDecisionIndicators,
  getDecisionSupportSummary,
} from "../utils/decisionSupportLookup";
import type {
  BottleneckItem,
  DecisionSupportIndicator,
} from "../types/report";

type SeverityFilter =
  | "ALL"
  | "CRITICAL"
  | "HIGH"
  | "WARNING"
  | "INFO";

type BottleneckPriority =
  | "ALL"
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatIndicatorValue(
  indicator: DecisionSupportIndicator,
): string {
  if (indicator.unit === "CURRENCY") {
    return formatCurrency(indicator.value);
  }

  if (indicator.unit === "PERCENTAGE") {
    return `${indicator.value}%`;
  }

  if (indicator.unit === "DAYS") {
    return `${indicator.value} days`;
  }

  return indicator.value.toLocaleString("en-IN");
}

function severityLabel(
  severity: DecisionSupportIndicator["severity"],
): string {
  return severity.replace("_", " ");
}

function priorityLabel(
  priority: BottleneckItem["priority"],
): string {
  return priority;
}

function severityClass(
  severity: DecisionSupportIndicator["severity"],
): string {
  return `decision-support__severity decision-support__severity--${severity.toLowerCase()}`;
}

function priorityClass(
  priority: BottleneckItem["priority"],
): string {
  return `decision-support__priority decision-support__priority--${priority.toLowerCase()}`;
}

function getIndicatorIcon(
  category: DecisionSupportIndicator["category"],
) {
  switch (category) {
    case "DELAY":
      return Clock3;

    case "COMPENSATION":
      return WalletCards;

    case "R_AND_R":
      return UserCheck;

    case "POSSESSION":
      return Flag;

    case "FIELD_VERIFICATION":
      return FileSearch;

    case "WORKLOAD":
      return AlertTriangle;

    case "DATA_QUALITY":
      return XCircle;

    default:
      return AlertTriangle;
  }
}

export default function DecisionSupportPage() {
  const [severityFilter, setSeverityFilter] =
    useState<SeverityFilter>("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState<BottleneckPriority>("ALL");

  const [selectedIndicator, setSelectedIndicator] =
    useState<DecisionSupportIndicator | null>(
      null,
    );

  const [selectedBottleneck, setSelectedBottleneck] =
    useState<BottleneckItem | null>(null);

  const summary =
    useMemo(
      () => getDecisionSupportSummary(),
      [],
    );

  const indicators =
    useMemo(
      () => getAllDecisionIndicators(),
      [],
    );

  const bottlenecks =
    useMemo(
      () => getAllBottlenecks(),
      [],
    );

  const filteredIndicators =
    useMemo(() => {
      if (severityFilter === "ALL") {
        return indicators;
      }

      return indicators.filter(
        (indicator) =>
          indicator.severity === severityFilter,
      );
    }, [indicators, severityFilter]);

  const filteredBottlenecks =
    useMemo(() => {
      if (priorityFilter === "ALL") {
        return bottlenecks;
      }

      return bottlenecks.filter(
        (bottleneck) =>
          bottleneck.priority ===
          priorityFilter,
      );
    }, [bottlenecks, priorityFilter]);

  return (
    <section className="decision-support">
      <header className="decision-support__header">
        <div>
          <div className="decision-support__eyebrow">
            GOVERNMENT DECISION SUPPORT
          </div>

          <h1 className="decision-support__title">
            Decision Support & Bottleneck Analysis
          </h1>

          <p className="decision-support__description">
            Review operational delays, workflow
            bottlenecks, pending dependencies and
            recommended follow-up actions across
            the available project reporting scope.
          </p>
        </div>

        <div className="decision-support__header-status">
          <span className="decision-support__status-dot" />
          Analysis based on current report data
        </div>
      </header>

      <div className="decision-support__notice">
        <AlertTriangle size={18} />

        <div>
          <strong>
            Decision-support information only
          </strong>

          <p>
            These indicators identify operational
            patterns and potential workflow issues.
            They do not constitute legal findings,
            ownership determinations, compensation
            approvals, possession decisions or other
            administrative decisions.
          </p>
        </div>
      </div>

      <div className="decision-support__metrics">
        <article className="decision-support__metric">
          <span className="decision-support__metric-label">
            Projects Analyzed
          </span>

          <strong>
            {summary.totalProjects}
          </strong>

          <small>
            Current reporting dataset
          </small>
        </article>

        <article className="decision-support__metric">
          <span className="decision-support__metric-label">
            Total Bottlenecks
          </span>

          <strong>
            {summary.totalBottlenecks}
          </strong>

          <small>
            Stage-level operational signals
          </small>
        </article>

        <article className="decision-support__metric decision-support__metric--critical">
          <span className="decision-support__metric-label">
            Critical Bottlenecks
          </span>

          <strong>
            {summary.criticalBottlenecks}
          </strong>

          <small>
            Requires immediate officer review
          </small>
        </article>

        <article className="decision-support__metric">
          <span className="decision-support__metric-label">
            High Priority
          </span>

          <strong>
            {summary.highPriorityBottlenecks}
          </strong>

          <small>
            Requires follow-up review
          </small>
        </article>

        <article className="decision-support__metric">
          <span className="decision-support__metric-label">
            Decision Indicators
          </span>

          <strong>
            {summary.totalIndicators}
          </strong>

          <small>
            Across all analyzed projects
          </small>
        </article>

        <article className="decision-support__metric decision-support__metric--review">
          <span className="decision-support__metric-label">
            Human Review Required
          </span>

          <strong>
            {summary.humanReviewRequired}
          </strong>

          <small>
            No automatic administrative action
          </small>
        </article>
      </div>

      <section className="decision-support__section">
        <div className="decision-support__section-header">
          <div>
            <h2>Decision Indicators</h2>

            <p>
              Explainable indicators generated from
              operational report data.
            </p>
          </div>

          <label className="decision-support__filter">
            <span>Severity</span>

            <select
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(
                  event.target
                    .value as SeverityFilter,
                )
              }
            >
              <option value="ALL">
                All severities
              </option>

              <option value="CRITICAL">
                Critical
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="WARNING">
                Warning
              </option>

              <option value="INFO">
                Info
              </option>
            </select>
          </label>
        </div>

        {filteredIndicators.length === 0 ? (
          <div className="decision-support__empty">
            No decision indicators match the
            selected severity.
          </div>
        ) : (
          <div className="decision-support__indicator-grid">
            {filteredIndicators.map(
              (indicator) => {
                const Icon =
                  getIndicatorIcon(
                    indicator.category,
                  );

                return (
                  <button
                    key={indicator.id}
                    type="button"
                    className="decision-support__indicator"
                    onClick={() =>
                      setSelectedIndicator(
                        indicator,
                      )
                    }
                  >
                    <div className="decision-support__indicator-top">
                      <span className="decision-support__indicator-icon">
                        <Icon size={18} />
                      </span>

                      <span
                        className={severityClass(
                          indicator.severity,
                        )}
                      >
                        {severityLabel(
                          indicator.severity,
                        )}
                      </span>
                    </div>

                    <div className="decision-support__indicator-title">
                      {indicator.title}
                    </div>

                    <div className="decision-support__indicator-value">
                      {formatIndicatorValue(
                        indicator,
                      )}
                    </div>

                    <p>
                      {indicator.description}
                    </p>

                    <div className="decision-support__indicator-footer">
                      <span>
                        {indicator.category.replace(
                          "_",
                          " ",
                        )}
                      </span>

                      {indicator.requiresHumanReview && (
                        <span className="decision-support__review-badge">
                          <UserCheck size={13} />
                          Human review
                        </span>
                      )}
                    </div>
                  </button>
                );
              },
            )}
          </div>
        )}
      </section>

      <section className="decision-support__section">
        <div className="decision-support__section-header">
          <div>
            <h2>Workflow Bottlenecks</h2>

            <p>
              Acquisition stages where recorded
              duration or delayed cases indicate
              potential operational attention.
            </p>
          </div>

          <label className="decision-support__filter">
            <span>Priority</span>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target
                    .value as BottleneckPriority,
                )
              }
            >
              <option value="ALL">
                All priorities
              </option>

              <option value="CRITICAL">
                Critical
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="LOW">
                Low
              </option>
            </select>
          </label>
        </div>

        {filteredBottlenecks.length === 0 ? (
          <div className="decision-support__empty">
            No bottlenecks match the selected
            priority.
          </div>
        ) : (
          <div className="decision-support__table-wrap">
            <table className="decision-support__table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Project</th>
                  <th>Stage</th>
                  <th>Current Duration</th>
                  <th>Expected</th>
                  <th>Delay</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {filteredBottlenecks.map(
                  (bottleneck) => (
                    <tr
                      key={bottleneck.id}
                      onClick={() =>
                        setSelectedBottleneck(
                          bottleneck,
                        )
                      }
                      className="decision-support__table-row"
                    >
                      <td>
                        <span
                          className={priorityClass(
                            bottleneck.priority,
                          )}
                        >
                          {priorityLabel(
                            bottleneck.priority,
                          )}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {
                            bottleneck.projectName
                          }
                        </strong>

                        <small>
                          {
                            bottleneck.district
                          }
                        </small>
                      </td>

                      <td>
                        {
                          bottleneck.stageLabel
                        }
                      </td>

                      <td>
                        {
                          bottleneck.daysInStage
                        }{" "}
                        days
                      </td>

                      <td>
                        {
                          bottleneck.expectedDays
                        }{" "}
                        days
                      </td>

                      <td>
                        <strong>
                          +{bottleneck.delayDays}
                        </strong>{" "}
                        days
                      </td>

                      <td>
                        {bottleneck.reason}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="decision-support__section">
        <div className="decision-support__section-header">
          <div>
            <h2>Operational Interpretation</h2>

            <p>
              How officers should use the generated
              indicators.
            </p>
          </div>
        </div>

        <div className="decision-support__guidance">
          <div>
            <CheckCircle2 size={19} />

            <div>
              <strong>
                Review the source records
              </strong>

              <p>
                Validate the underlying project,
                acquisition case and workflow data
                before taking administrative action.
              </p>
            </div>
          </div>

          <div>
            <ArrowUpRight size={19} />

            <div>
              <strong>
                Prioritize significant delays
              </strong>

              <p>
                Critical and high-priority signals
                should receive appropriate officer
                attention based on actual case
                circumstances.
              </p>
            </div>
          </div>

          <div>
            <UserCheck size={19} />

            <div>
              <strong>
                Keep humans in the decision loop
              </strong>

              <p>
                The system recommends what should be
                reviewed; an authorized officer makes
                the actual decision.
              </p>
            </div>
          </div>

          <div>
            <ArrowDownRight size={19} />

            <div>
              <strong>
                Record the resulting action
              </strong>

              <p>
                Future workflow integration should
                connect officer decisions back to the
                relevant case and audit trail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {selectedIndicator && (
        <div
          className="decision-support__modal-backdrop"
          role="presentation"
          onClick={() =>
            setSelectedIndicator(null)
          }
        >
          <aside
            className="decision-support__drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Decision indicator details"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="decision-support__drawer-header">
              <div>
                <span
                  className={severityClass(
                    selectedIndicator.severity,
                  )}
                >
                  {severityLabel(
                    selectedIndicator.severity,
                  )}
                </span>

                <h2>
                  {selectedIndicator.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedIndicator(null)
                }
                aria-label="Close indicator details"
              >
                ×
              </button>
            </div>

            <div className="decision-support__drawer-section">
              <span>Indicator value</span>

              <strong>
                {formatIndicatorValue(
                  selectedIndicator,
                )}
              </strong>
            </div>

            <div className="decision-support__drawer-section">
              <span>Description</span>

              <p>
                {selectedIndicator.description}
              </p>
            </div>

            <div className="decision-support__drawer-section">
              <span>Recommended action</span>

              <p>
                {
                  selectedIndicator.recommendedAction
                }
              </p>
            </div>

            <div className="decision-support__drawer-section">
              <span>Source references</span>

              <div className="decision-support__reference-list">
                {selectedIndicator.sourceReferences.map(
                  (reference) => (
                    <code key={reference}>
                      {reference}
                    </code>
                  ),
                )}
              </div>
            </div>

            <div className="decision-support__human-review">
              <UserCheck size={18} />

              <div>
                <strong>
                  Human review required
                </strong>

                <p>
                  This indicator must not be treated
                  as an automatic administrative or
                  legal decision.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {selectedBottleneck && (
        <div
          className="decision-support__modal-backdrop"
          role="presentation"
          onClick={() =>
            setSelectedBottleneck(null)
          }
        >
          <aside
            className="decision-support__drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Bottleneck details"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="decision-support__drawer-header">
              <div>
                <span
                  className={priorityClass(
                    selectedBottleneck.priority,
                  )}
                >
                  {selectedBottleneck.priority}
                </span>

                <h2>
                  {selectedBottleneck.stageLabel}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBottleneck(null)
                }
                aria-label="Close bottleneck details"
              >
                ×
              </button>
            </div>

            <div className="decision-support__drawer-section">
              <span>Project</span>

              <strong>
                {selectedBottleneck.projectName}
              </strong>

              <p>
                {selectedBottleneck.district}
              </p>
            </div>

            <div className="decision-support__drawer-stat-grid">
              <div>
                <span>Current</span>
                <strong>
                  {
                    selectedBottleneck.daysInStage
                  }{" "}
                  days
                </strong>
              </div>

              <div>
                <span>Expected</span>
                <strong>
                  {
                    selectedBottleneck.expectedDays
                  }{" "}
                  days
                </strong>
              </div>

              <div>
                <span>Delay</span>
                <strong>
                  +
                  {
                    selectedBottleneck.delayDays
                  }{" "}
                  days
                </strong>
              </div>
            </div>

            <div className="decision-support__drawer-section">
              <span>Reason</span>

              <p>
                {selectedBottleneck.reason}
              </p>
            </div>

            <div className="decision-support__drawer-section">
              <span>Reference</span>

              <code>
                {selectedBottleneck.caseReference}
              </code>
            </div>

            <div className="decision-support__human-review">
              <UserCheck size={18} />

              <div>
                <strong>
                  Officer review required
                </strong>

                <p>
                  Validate the underlying case data
                  and workflow circumstances before
                  taking action.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}