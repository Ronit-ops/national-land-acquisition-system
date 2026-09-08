import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Cloud,
  Eye,
  MapPinned,
  Satellite,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  getHighPrioritySatelliteAlerts,
  getSatelliteAlerts,
  getSatelliteObservations,
  getSatelliteProjectSummaries,
  getSatelliteSummary,
} from "../features/satellite/utils/satelliteLookup";

import type {
  AIChangeAlert,
  ChangeSeverity,
} from "../features/satellite/types/satellite";

import "./satellite.css";

const severityLabels: Record<ChangeSeverity, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

const severityClass: Record<ChangeSeverity, string> = {
  LOW: "satellite-severity-low",
  MEDIUM: "satellite-severity-medium",
  HIGH: "satellite-severity-high",
  CRITICAL: "satellite-severity-critical",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getChangeTypeLabel(
  type: AIChangeAlert["changeType"],
): string {
  switch (type) {
    case "LAND_USE_CHANGE":
      return "Land-use change";

    case "BOUNDARY_CHANGE":
      return "Boundary change";

    case "CONSTRUCTION":
      return "Construction activity";

    case "VEGETATION_CHANGE":
      return "Vegetation change";

    case "WATER_CHANGE":
      return "Water change";

    case "SURFACE_CHANGE":
      return "Surface change";

    default:
      return "Change detected";
  }
}

export default function SatellitePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [severityFilter, setSeverityFilter] = useState<
    ChangeSeverity | "ALL"
  >("ALL");

  const [selectedAlertId, setSelectedAlertId] = useState<
    string | null
  >(null);

  if (!user) {
    return null;
  }

  const scope = useMemo(
    () => ({
      jurisdiction: user.jurisdiction,
      jurisdictionType: user.jurisdictionType,
    }),
    [user.jurisdiction, user.jurisdictionType],
  );

  const summary = getSatelliteSummary(scope);

  const observations = getSatelliteObservations(scope);

  const projects = getSatelliteProjectSummaries(scope);

  const highPriorityAlerts =
    getHighPrioritySatelliteAlerts(scope);

  const alerts = getSatelliteAlerts(
    severityFilter === "ALL"
      ? {}
      : {
          severity: severityFilter,
        },
    scope,
  );

  const selectedAlert =
    alerts.find((alert) => alert.id === selectedAlertId) ??
    highPriorityAlerts[0] ??
    null;

  const latestObservation = observations
    .slice()
    .sort(
      (a, b) =>
        new Date(b.acquisitionDate).getTime() -
        new Date(a.acquisitionDate).getTime(),
    )[0];

  const stateWide =
    user.jurisdictionType.toLowerCase() === "state";

  const openAlertReview = (alertId: string) => {
    navigate(`/app/satellite/alerts/${alertId}`);
  };

  return (
    <div className="satellite-page">
      <section className="satellite-hero">
        <div className="satellite-hero-copy">
          <div className="satellite-eyebrow">
            <span className="satellite-eyebrow-icon">
              <Satellite size={15} />
            </span>

            Earth Observation Intelligence
          </div>

          <h1>Satellite Intelligence</h1>

          <p>
            Monitor land and project activity over time using
            satellite observations, temporal comparisons and
            AI-assisted change detection.
          </p>

          <div className="satellite-hero-meta">
            <span>
              <MapPinned size={14} />
              {stateWide
                ? "Maharashtra State"
                : user.jurisdiction}
            </span>

            <span>
              <ShieldCheck size={14} />
              {user.designation}
            </span>

            <span className="satellite-demo-badge">
              Demonstration data
            </span>
          </div>
        </div>

        <div className="satellite-hero-visual">
          <div className="satellite-orbit satellite-orbit-one" />

          <div className="satellite-orbit satellite-orbit-two" />

          <div className="satellite-earth">
            <Satellite size={54} strokeWidth={1.25} />
          </div>

          <div className="satellite-visual-label">
            <span>MONITORING</span>
            <strong>24 / 7</strong>
            <small>
              Observation-ready architecture
            </small>
          </div>
        </div>
      </section>

      <section className="satellite-disclaimer">
        <ShieldCheck size={17} />

        <div>
          <strong>Decision-support only</strong>

          <span>
            AI results indicate potential changes and must be
            verified against authoritative records and, where
            required, field evidence. They do not determine
            ownership, encroachment or legal status.
          </span>
        </div>
      </section>

      <section className="satellite-metrics">
        <article className="satellite-metric-card">
          <div className="satellite-metric-icon">
            <Eye size={19} />
          </div>

          <div>
            <span>Observations</span>
            <strong>{summary.observations}</strong>
            <small>
              Available in monitoring scope
            </small>
          </div>
        </article>

        <article className="satellite-metric-card">
          <div className="satellite-metric-icon">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span>Active AI alerts</span>
            <strong>{summary.activeAlerts}</strong>
            <small>
              Require review or monitoring
            </small>
          </div>
        </article>

        <article className="satellite-metric-card">
          <div className="satellite-metric-icon">
            <Target size={19} />
          </div>

          <div>
            <span>High priority</span>
            <strong>{summary.highPriorityAlerts}</strong>
            <small>
              Potentially significant changes
            </small>
          </div>
        </article>

        <article className="satellite-metric-card">
          <div className="satellite-metric-icon">
            <Activity size={19} />
          </div>

          <div>
            <span>Field verification</span>
            <strong>
              {summary.fieldVerificationRequired}
            </strong>
            <small>
              Cases requiring human review
            </small>
          </div>
        </article>
      </section>

      <section className="satellite-main-grid">
        <div className="satellite-primary-column">
          <div className="satellite-section-heading">
            <div>
              <span className="satellite-section-kicker">
                AI CHANGE DETECTION
              </span>

              <h2>
                Potential changes requiring attention
              </h2>

              <p>
                Automated observations prioritized for officer
                review.
              </p>
            </div>

            <div className="satellite-filter-group">
              {(
                [
                  "ALL",
                  "CRITICAL",
                  "HIGH",
                  "MEDIUM",
                  "LOW",
                ] as const
              ).map((severity) => (
                <button
                  key={severity}
                  type="button"
                  className={
                    severityFilter === severity
                      ? "satellite-filter active"
                      : "satellite-filter"
                  }
                  onClick={() =>
                    setSeverityFilter(severity)
                  }
                >
                  {severity === "ALL"
                    ? "All"
                    : severityLabels[severity]}
                </button>
              ))}
            </div>
          </div>

          <div className="satellite-alert-list">
            {alerts.length === 0 ? (
              <div className="satellite-empty">
                <CheckCircle2 size={28} />

                <strong>
                  No alerts match this filter
                </strong>

                <span>
                  There are no active satellite intelligence
                  alerts in the selected category.
                </span>
              </div>
            ) : (
              alerts.map((alert) => (
                <button
                  type="button"
                  key={alert.id}
                  className={
                    selectedAlert?.id === alert.id
                      ? "satellite-alert-card selected"
                      : "satellite-alert-card"
                  }
                  onClick={() =>
                    setSelectedAlertId(alert.id)
                  }
                >
                  <div className="satellite-alert-top">
                    <span
                      className={`satellite-severity ${severityClass[alert.severity]}`}
                    >
                      {severityLabels[alert.severity]}
                    </span>

                    <span className="satellite-alert-date">
                      <CalendarDays size={13} />
                      {formatDate(alert.detectedDate)}
                    </span>
                  </div>

                  <div className="satellite-alert-content">
                    <div className="satellite-alert-icon">
                      <Sparkles size={18} />
                    </div>

                    <div className="satellite-alert-copy">
                      <strong>{alert.title}</strong>

                      <span>{alert.description}</span>

                      <div className="satellite-alert-tags">
                        <span>
                          {getChangeTypeLabel(
                            alert.changeType,
                          )}
                        </span>

                        {alert.parcelId && (
                          <span>{alert.parcelId}</span>
                        )}

                        {alert.projectName && (
                          <span>{alert.projectName}</span>
                        )}
                      </div>
                    </div>

                    <div className="satellite-confidence">
                      <strong>
                        {alert.confidencePercentage}%
                      </strong>

                      <span>confidence</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <aside className="satellite-detail-panel">
          {selectedAlert ? (
            <>
              <div className="satellite-detail-header">
                <div>
                  <span className="satellite-section-kicker">
                    AI ALERT
                  </span>

                  <h2>{selectedAlert.title}</h2>
                </div>

                <span
                  className={`satellite-severity ${severityClass[selectedAlert.severity]}`}
                >
                  {severityLabels[
                    selectedAlert.severity
                  ]}
                </span>
              </div>

              <p className="satellite-detail-description">
                {selectedAlert.description}
              </p>

              <div className="satellite-confidence-panel">
                <div className="satellite-confidence-ring">
                  <strong>
                    {selectedAlert.confidencePercentage}%
                  </strong>

                  <span>AI confidence</span>
                </div>

                <div>
                  <strong>
                    Why was this flagged?
                  </strong>

                  <ul>
                    {selectedAlert.explanation.map(
                      (reason) => (
                        <li key={reason}>{reason}</li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              <div className="satellite-detail-context">
                <div>
                  <span>Project</span>

                  <strong>
                    {selectedAlert.projectName ??
                      "Not assigned"}
                  </strong>
                </div>

                <div>
                  <span>District</span>

                  <strong>
                    {selectedAlert.district ??
                      "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Parcel</span>

                  <strong>
                    {selectedAlert.parcelId ??
                      "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Changed area</span>

                  <strong>
                    {selectedAlert.changedAreaHectares
                      ? `${selectedAlert.changedAreaHectares.toFixed(
                          2,
                        )} ha`
                      : "Not calculated"}
                  </strong>
                </div>
              </div>

              <div className="satellite-recommendation">
                <div className="satellite-recommendation-icon">
                  <TrendingUp size={17} />
                </div>

                <div>
                  <span>
                    Recommended next action
                  </span>

                  <strong>
                    {selectedAlert.recommendedAction}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="satellite-primary-action"
                onClick={() =>
                  openAlertReview(selectedAlert.id)
                }
              >
                Open AI alert review
                <ArrowRight size={17} />
              </button>

              <div className="satellite-legal-note">
                AI observation ≠ legal determination. Final
                action remains with the authorized officer after
                verification.
              </div>
            </>
          ) : (
            <div className="satellite-empty detail">
              <Sparkles size={28} />

              <strong>Select an alert</strong>

              <span>
                Choose an AI observation to inspect its evidence,
                confidence and recommended action.
              </span>
            </div>
          )}
        </aside>
      </section>

      <section className="satellite-monitoring-section">
        <div className="satellite-section-heading">
          <div>
            <span className="satellite-section-kicker">
              PROJECT MONITORING
            </span>

            <h2>
              Satellite coverage across projects
            </h2>

            <p>
              Current observation availability and
              change-detection activity within your authorized
              scope.
            </p>
          </div>
        </div>

        <div className="satellite-project-grid">
          {projects.map((project) => (
            <article
              className="satellite-project-card"
              key={project.projectId}
            >
              <div className="satellite-project-header">
                <div className="satellite-project-icon">
                  <MapPinned size={18} />
                </div>

                <span
                  className={
                    project.monitoringStatus ===
                    "MONITORED"
                      ? "satellite-status good"
                      : "satellite-status attention"
                  }
                >
                  {project.monitoringStatus ===
                  "MONITORED"
                    ? "Monitored"
                    : "Attention"}
                </span>
              </div>

              <span className="satellite-project-district">
                {project.district}
              </span>

              <h3>{project.projectName}</h3>

              <div className="satellite-project-stats">
                <div>
                  <strong>
                    {project.observationsAvailable}
                  </strong>

                  <span>observations</span>
                </div>

                <div>
                  <strong>
                    {project.activeAlerts}
                  </strong>

                  <span>active alerts</span>
                </div>

                <div>
                  <strong>
                    {project.highPriorityAlerts}
                  </strong>

                  <span>high priority</span>
                </div>
              </div>

              <div className="satellite-project-footer">
                <span>
                  Last observation:{" "}
                  {formatDate(
                    project.lastObservationDate,
                  )}
                </span>

                <ArrowRight size={15} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="satellite-latest-observation">
        <div className="satellite-latest-icon">
          <Satellite size={24} />
        </div>

        <div>
          <span className="satellite-section-kicker">
            LATEST OBSERVATION
          </span>

          <h2>
            {latestObservation?.thumbnailLabel ??
              "No recent observation available"}
          </h2>

          <p>
            {latestObservation
              ? `${latestObservation.source.replace(
                  "_",
                  " ",
                )} · ${
                  latestObservation.resolutionMeters
                } m resolution · ${
                  latestObservation.cloudCoveragePercentage
                }% cloud coverage`
              : "Observation data is not currently available."}
          </p>
        </div>

        <div className="satellite-latest-meta">
          <Cloud size={16} />

          <span>
            {latestObservation
              ? `${latestObservation.cloudCoveragePercentage}%`
              : "—"}
          </span>

          <small>cloud</small>
        </div>

        <div className="satellite-latest-meta">
          <CalendarDays size={16} />

          <span>
            {latestObservation
              ? formatDate(
                  latestObservation.acquisitionDate,
                )
              : "—"}
          </span>

          <small>acquired</small>
        </div>
      </section>
    </div>
  );
}