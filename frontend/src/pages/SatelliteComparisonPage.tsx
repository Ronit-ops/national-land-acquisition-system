import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Crosshair,
  Layers3,
  MapPinned,
  Maximize2,
  Satellite,
  ShieldCheck,
  Sparkles,
  Target,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import {
  getSatelliteAlerts,
  getSatelliteComparisons,
  getSatelliteObservations,
} from "../features/satellite/utils/satelliteLookup";
import type { SatelliteObservation } from "../features/satellite/types/satellite";
import "./satellite-comparison.css";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getSourceLabel(source: SatelliteObservation["source"]): string {
  switch (source) {
    case "SENTINEL_2":
      return "Sentinel-2";
    case "LANDSAT_8":
      return "Landsat 8";
    case "LANDSAT_9":
      return "Landsat 9";
    default:
      return "Demonstration source";
  }
}

export default function SatelliteComparisonPage() {
  const { user } = useAuth();

  const [selectedProjectId, setSelectedProjectId] = useState(
    "PRJ-PUN-001",
  );

  const [beforeId, setBeforeId] = useState("SAT-PUN-2026-0002");
  const [afterId, setAfterId] = useState("SAT-PUN-2026-0001");

  const [comparisonMode, setComparisonMode] = useState<
    "SIDE_BY_SIDE" | "SPLIT"
  >("SIDE_BY_SIDE");

  const [zoom, setZoom] = useState(1);

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

  const observations = getSatelliteObservations(scope);
  const comparisons = getSatelliteComparisons(scope);
  const alerts = getSatelliteAlerts({}, scope);

  const projects = Array.from(
    new Map(
      observations
        .filter((observation) => observation.projectId)
        .map((observation) => [
          observation.projectId,
          {
            projectId: observation.projectId!,
            projectName:
              observation.projectName ?? observation.projectId!,
            district: observation.district ?? "Unknown",
          },
        ]),
    ).values(),
  );

  const projectObservations = observations.filter(
    (observation) => observation.projectId === selectedProjectId,
  );

  const availableComparison = comparisons.find(
    (comparison) =>
      comparison.beforeObservationId === beforeId &&
      comparison.afterObservationId === afterId,
  );

  const fallbackComparison = comparisons.find((comparison) => {
    const beforeExists = projectObservations.some(
      (observation) =>
        observation.id === comparison.beforeObservationId,
    );

    const afterExists = projectObservations.some(
      (observation) =>
        observation.id === comparison.afterObservationId,
    );

    return beforeExists && afterExists;
  });

  const activeComparison = availableComparison ?? fallbackComparison;

  const effectiveBeforeId =
    activeComparison?.beforeObservationId ?? beforeId;

  const effectiveAfterId =
    activeComparison?.afterObservationId ?? afterId;

  const beforeObservation =
    projectObservations.find(
      (observation) => observation.id === effectiveBeforeId,
    ) ?? null;

  const afterObservation =
    projectObservations.find(
      (observation) => observation.id === effectiveAfterId,
    ) ?? null;

  const linkedAlerts = alerts.filter(
    (alert) =>
      alert.beforeObservationId === effectiveBeforeId ||
      alert.afterObservationId === effectiveAfterId,
  );

  const changedArea =
    linkedAlerts.reduce(
      (total, alert) => total + (alert.changedAreaHectares ?? 0),
      0,
    ) || 0;

  function handleProjectChange(projectId: string) {
    const project = projects.find(
      (item) => item.projectId === projectId,
    );

    if (!project) {
      return;
    }

    setSelectedProjectId(projectId);

    const nextObservations = observations
      .filter((observation) => observation.projectId === projectId)
      .sort(
        (a, b) =>
          new Date(a.acquisitionDate).getTime() -
          new Date(b.acquisitionDate).getTime(),
      );

    if (nextObservations.length >= 2) {
      setBeforeId(nextObservations[0].id);
      setAfterId(nextObservations[nextObservations.length - 1].id);
    }
  }

  function handleSwapObservations() {
    setBeforeId(effectiveAfterId);
    setAfterId(effectiveBeforeId);
  }

  function handleZoomIn() {
    setZoom((current) => Math.min(1.45, current + 0.15));
  }

  function handleZoomOut() {
    setZoom((current) => Math.max(0.7, current - 0.15));
  }

  function resetZoom() {
    setZoom(1);
  }

  return (
    <div className="satellite-comparison-page">
      <header className="satellite-comparison-header">
        <div>
          <div className="satellite-comparison-breadcrumb">
            <Satellite size={14} />
            Satellite Intelligence
            <ArrowRight size={13} />
            Temporal Comparison
          </div>

          <h1>Temporal Satellite Comparison</h1>

          <p>
            Compare observations across time to identify potential
            land-surface and project-area changes.
          </p>
        </div>

        <div className="satellite-comparison-header-status">
          <ShieldCheck size={16} />
          Decision-support workspace
        </div>
      </header>

      <section className="satellite-comparison-controls">
        <div className="satellite-control-field">
          <label htmlFor="satellite-project">
            PROJECT
          </label>

          <div className="satellite-select-wrapper">
            <select
              id="satellite-project"
              value={selectedProjectId}
              onChange={(event) =>
                handleProjectChange(event.target.value)
              }
            >
              {projects.map((project) => (
                <option
                  key={project.projectId}
                  value={project.projectId}
                >
                  {project.projectName} — {project.district}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        <div className="satellite-control-field">
          <label htmlFor="satellite-before">
            BEFORE OBSERVATION
          </label>

          <div className="satellite-select-wrapper">
            <select
              id="satellite-before"
              value={effectiveBeforeId}
              onChange={(event) => setBeforeId(event.target.value)}
            >
              {projectObservations.map((observation) => (
                <option
                  key={observation.id}
                  value={observation.id}
                >
                  {formatDate(observation.acquisitionDate)} ·{" "}
                  {getSourceLabel(observation.source)}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        <button
          type="button"
          className="satellite-swap-button"
          onClick={handleSwapObservations}
          title="Swap before and after observations"
          aria-label="Swap before and after observations"
        >
          <ArrowLeft size={14} />
          <ArrowRight size={14} />
        </button>

        <div className="satellite-control-field">
          <label htmlFor="satellite-after">
            AFTER OBSERVATION
          </label>

          <div className="satellite-select-wrapper">
            <select
              id="satellite-after"
              value={effectiveAfterId}
              onChange={(event) => setAfterId(event.target.value)}
            >
              {projectObservations.map((observation) => (
                <option
                  key={observation.id}
                  value={observation.id}
                >
                  {formatDate(observation.acquisitionDate)} ·{" "}
                  {getSourceLabel(observation.source)}
                </option>
              ))}
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        <div className="satellite-comparison-mode">
          <button
            type="button"
            className={
              comparisonMode === "SIDE_BY_SIDE"
                ? "active"
                : ""
            }
            onClick={() => setComparisonMode("SIDE_BY_SIDE")}
          >
            Side by side
          </button>

          <button
            type="button"
            className={
              comparisonMode === "SPLIT" ? "active" : ""
            }
            onClick={() => setComparisonMode("SPLIT")}
          >
            Split view
          </button>
        </div>
      </section>

      <section className="satellite-context-strip">
        <div>
          <MapPinned size={16} />
          <span>Jurisdiction</span>
          <strong>{user.jurisdiction}</strong>
        </div>

        <div>
          <Target size={16} />
          <span>Project</span>
          <strong>
            {afterObservation?.projectName ??
              beforeObservation?.projectName ??
              "—"}
          </strong>
        </div>

        <div>
          <Crosshair size={16} />
          <span>Parcel</span>
          <strong>
            {afterObservation?.parcelId ??
              beforeObservation?.parcelId ??
              "Multiple / project view"}
          </strong>
        </div>

        <div>
          <CalendarDays size={16} />
          <span>Observation interval</span>
          <strong>
            {beforeObservation && afterObservation
              ? `${formatDate(beforeObservation.acquisitionDate)} → ${formatDate(afterObservation.acquisitionDate)}`
              : "Not available"}
          </strong>
        </div>
      </section>

      <section className="satellite-viewer-card">
        <div className="satellite-viewer-toolbar">
          <div>
            <span className="satellite-viewer-kicker">
              TEMPORAL OBSERVATION
            </span>
            <h2>Visual comparison</h2>
          </div>

          <div className="satellite-viewer-actions">
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Zoom out"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>

            <button
              type="button"
              onClick={resetZoom}
              className="satellite-zoom-value"
              title="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Zoom in"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>

            <button
              type="button"
              aria-label="Full screen comparison"
              title="Full screen comparison"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        {beforeObservation && afterObservation ? (
          <div
            className={
              comparisonMode === "SPLIT"
                ? "satellite-image-stage split-mode"
                : "satellite-image-stage"
            }
          >
            <div
              className="satellite-image-panel before"
              style={{
                transform: `scale(${zoom})`,
              }}
            >
              <div className="satellite-faux-image satellite-faux-before">
                <div className="satellite-land-pattern" />
                <div className="satellite-road-line road-one" />
                <div className="satellite-road-line road-two" />
                <div className="satellite-field field-one" />
                <div className="satellite-field field-two" />
                <div className="satellite-building building-one" />
                <div className="satellite-building building-two" />
                <div className="satellite-parcel-boundary" />
                <div className="satellite-grid-overlay" />

                <div className="satellite-image-watermark">
                  DEMONSTRATION VISUALIZATION
                </div>
              </div>

              <div className="satellite-image-label">
                <span>BEFORE</span>
                <strong>
                  {formatDate(beforeObservation.acquisitionDate)}
                </strong>
              </div>
            </div>

            <div
              className="satellite-image-panel after"
              style={{
                transform: `scale(${zoom})`,
              }}
            >
              <div className="satellite-faux-image satellite-faux-after">
                <div className="satellite-land-pattern" />
                <div className="satellite-road-line road-one" />
                <div className="satellite-road-line road-two" />
                <div className="satellite-field field-one" />
                <div className="satellite-field field-two" />
                <div className="satellite-building building-one" />
                <div className="satellite-building building-two" />
                <div className="satellite-change-zone change-one" />
                <div className="satellite-change-zone change-two" />
                <div className="satellite-parcel-boundary" />
                <div className="satellite-grid-overlay" />

                <div className="satellite-image-watermark">
                  DEMONSTRATION VISUALIZATION
                </div>
              </div>

              <div className="satellite-image-label">
                <span>AFTER</span>
                <strong>
                  {formatDate(afterObservation.acquisitionDate)}
                </strong>
              </div>
            </div>

            {comparisonMode === "SPLIT" && (
              <div className="satellite-split-divider">
                <span>
                  <ArrowLeft size={13} />
                  <ArrowRight size={13} />
                </span>
              </div>
            )}

            <div className="satellite-viewer-legend">
              <span>
                <i className="legend-boundary" />
                Parcel boundary
              </span>

              <span>
                <i className="legend-change" />
                Potential change area
              </span>
            </div>
          </div>
        ) : (
          <div className="satellite-comparison-empty">
            <Satellite size={32} />
            <strong>
              Select two observations to compare
            </strong>
            <span>
              Choose a before and after observation from the same
              project.
            </span>
          </div>
        )}
      </section>

      <section className="satellite-comparison-metrics">
        <article>
          <div className="comparison-metric-icon">
            <Layers3 size={18} />
          </div>
          <div>
            <span>Area analysed</span>
            <strong>
              {activeComparison
                ? `${activeComparison.areaAnalyzedHectares.toFixed(1)} ha`
                : "—"}
            </strong>
          </div>
        </article>

        <article>
          <div className="comparison-metric-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <span>Detected difference</span>
            <strong>
              {activeComparison
                ? `${activeComparison.changePercentage.toFixed(1)}%`
                : "—"}
            </strong>
          </div>
        </article>

        <article>
          <div className="comparison-metric-icon">
            <Target size={18} />
          </div>
          <div>
            <span>Potential changed area</span>
            <strong>
              {changedArea > 0
                ? `${changedArea.toFixed(2)} ha`
                : "—"}
            </strong>
          </div>
        </article>

        <article>
          <div className="comparison-metric-icon">
            <AlertTriangle size={18} />
          </div>
          <div>
            <span>Linked AI alerts</span>
            <strong>{linkedAlerts.length}</strong>
          </div>
        </article>
      </section>

      <section className="satellite-observation-details">
        <div className="satellite-observation-card">
          <div className="satellite-observation-card-header">
            <div>
              <span>BEFORE</span>
              <h3>
                {beforeObservation
                  ? formatDate(beforeObservation.acquisitionDate)
                  : "—"}
              </h3>
            </div>

            <Satellite size={19} />
          </div>

          {beforeObservation ? (
            <div className="satellite-observation-data">
              <div>
                <span>Source</span>
                <strong>
                  {getSourceLabel(beforeObservation.source)}
                </strong>
              </div>

              <div>
                <span>Resolution</span>
                <strong>
                  {beforeObservation.resolutionMeters} m
                </strong>
              </div>

              <div>
                <span>Cloud coverage</span>
                <strong>
                  {beforeObservation.cloudCoveragePercentage}%
                </strong>
              </div>

              <div>
                <span>Tile</span>
                <strong>
                  {beforeObservation.tileReference}
                </strong>
              </div>
            </div>
          ) : (
            <span>No observation selected.</span>
          )}
        </div>

        <div className="satellite-observation-card">
          <div className="satellite-observation-card-header">
            <div>
              <span>AFTER</span>
              <h3>
                {afterObservation
                  ? formatDate(afterObservation.acquisitionDate)
                  : "—"}
              </h3>
            </div>

            <Satellite size={19} />
          </div>

          {afterObservation ? (
            <div className="satellite-observation-data">
              <div>
                <span>Source</span>
                <strong>
                  {getSourceLabel(afterObservation.source)}
                </strong>
              </div>

              <div>
                <span>Resolution</span>
                <strong>
                  {afterObservation.resolutionMeters} m
                </strong>
              </div>

              <div>
                <span>Cloud coverage</span>
                <strong>
                  {afterObservation.cloudCoveragePercentage}%
                </strong>
              </div>

              <div>
                <span>Tile</span>
                <strong>
                  {afterObservation.tileReference}
                </strong>
              </div>
            </div>
          ) : (
            <span>No observation selected.</span>
          )}
        </div>
      </section>

      <section className="satellite-timeline-section">
        <div className="satellite-section-title">
          <div>
            <span>OBSERVATION HISTORY</span>
            <h2>Project monitoring timeline</h2>
          </div>

          <div className="satellite-cloud-note">
            <Cloud size={15} />
            Lower cloud coverage generally improves visual interpretability.
          </div>
        </div>

        <div className="satellite-timeline">
          {projectObservations
            .slice()
            .sort(
              (a, b) =>
                new Date(a.acquisitionDate).getTime() -
                new Date(b.acquisitionDate).getTime(),
            )
            .map((observation, index) => {
              const isBefore = observation.id === effectiveBeforeId;
              const isAfter = observation.id === effectiveAfterId;

              return (
                <button
                  type="button"
                  key={observation.id}
                  className={
                    isBefore || isAfter
                      ? "satellite-timeline-item active"
                      : "satellite-timeline-item"
                  }
                  onClick={() => {
                    if (isBefore) {
                      setBeforeId(observation.id);
                    } else if (isAfter) {
                      setAfterId(observation.id);
                    } else if (
                      new Date(observation.acquisitionDate) <
                      new Date(
                        afterObservation?.acquisitionDate ?? "",
                      )
                    ) {
                      setBeforeId(observation.id);
                    } else {
                      setAfterId(observation.id);
                    }
                  }}
                >
                  <div className="satellite-timeline-line">
                    <span />
                    {index <
                      projectObservations.length - 1 && <i />}
                  </div>

                  <div className="satellite-timeline-card">
                    <div>
                      <strong>
                        {formatDate(observation.acquisitionDate)}
                      </strong>

                      <span>
                        {getSourceLabel(observation.source)}
                      </span>
                    </div>

                    <div>
                      <Cloud size={13} />
                      {observation.cloudCoveragePercentage}%
                    </div>

                    <div>
                      {observation.resolutionMeters} m
                    </div>

                    <div className="satellite-timeline-status">
                      {isBefore && <span>Before</span>}
                      {isAfter && <span>After</span>}
                      {!isBefore && !isAfter && (
                        <span>Observation</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </section>

      <section className="satellite-linked-alerts">
        <div className="satellite-section-title">
          <div>
            <span>INTELLIGENCE LINKAGE</span>
            <h2>Potential changes from this comparison</h2>
          </div>

          <span className="satellite-alert-count">
            {linkedAlerts.length} linked
          </span>
        </div>

        {linkedAlerts.length === 0 ? (
          <div className="satellite-no-alerts">
            <CheckCircle2 size={20} />
            <div>
              <strong>No linked AI alerts</strong>
              <span>
                No potential change alert is currently associated
                with this observation pair.
              </span>
            </div>
          </div>
        ) : (
          <div className="satellite-linked-alert-grid">
            {linkedAlerts.map((alert) => (
              <article
                className="satellite-linked-alert"
                key={alert.id}
              >
                <div className="linked-alert-top">
                  <span
                    className={`linked-alert-severity ${alert.severity.toLowerCase()}`}
                  >
                    {alert.severity}
                  </span>

                  <strong>
                    {alert.confidencePercentage}% confidence
                  </strong>
                </div>

                <h3>{alert.title}</h3>

                <p>{alert.description}</p>

                <div className="linked-alert-meta">
                  <span>
                    {alert.parcelId ?? "Project-level observation"}
                  </span>

                  <span>
                    {alert.changedAreaHectares
                      ? `${alert.changedAreaHectares.toFixed(2)} ha`
                      : "Area unavailable"}
                  </span>
                </div>

                <div className="linked-alert-footer">
                  <span>
                    {alert.status.replaceAll("_", " ")}
                  </span>

                  <ArrowRight size={14} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="satellite-comparison-note">
        <ShieldCheck size={18} />

        <div>
          <strong>Interpretation safeguard</strong>

          <p>
            Temporal imagery comparison identifies visual or
            spectral differences between observations. A detected
            difference is not, by itself, proof of encroachment,
            ownership change, unauthorized construction or any
            other legal status. Authoritative cadastral records,
            administrative records and field verification remain
            necessary where applicable.
          </p>
        </div>
      </section>
    </div>
  );
}