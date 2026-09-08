import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  Gavel,
  Globe2,
  LandPlot,
  Map,
  Radar,
  Satellite,
  Search,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getModuleLabel,
  type GovernmentModule,
} from "../auth/roleAccess";
import { useAuth } from "../auth/AuthContext";
import {
  getCommandCenterAttentionItems,
  getCommandCenterIntelligenceSignals,
  getCommandCenterMetrics,
  getCommandCenterProjectHealth,
  getCommandCenterWorkflowStages,
} from "../features/command-center/utils/commandCenterLookup";

type ModuleDefinition = {
  id: GovernmentModule;
  title: string;
  description: string;
  path: string;
  icon: typeof Building2;
  group: "OPERATIONS" | "INTELLIGENCE" | "GOVERNANCE";
};

const MODULES: ModuleDefinition[] = [
  {
    id: "PROJECTS",
    title: "Projects",
    description: "Monitor infrastructure projects and land requirements.",
    path: "/app/projects",
    icon: ClipboardList,
    group: "OPERATIONS",
  },
  {
    id: "LAND_PARCELS",
    title: "Land & Parcels",
    description:
      "Explore parcel records and recorded right-holder information.",
    path: "/app/land",
    icon: Map,
    group: "OPERATIONS",
  },
  {
    id: "ACQUISITION",
    title: "Acquisition",
    description:
      "Track acquisition stages, notifications and proceedings.",
    path: "/app/acquisition",
    icon: FileCheck2,
    group: "OPERATIONS",
  },
  {
    id: "PROCEEDINGS",
    title: "Proceedings",
    description:
      "Monitor objections, hearings and legal workflow.",
    path: "/app/proceedings",
    icon: Gavel,
    group: "OPERATIONS",
  },
  {
    id: "COMPENSATION",
    title: "Compensation",
    description:
      "Monitor valuation, awards and payment status.",
    path: "/app/compensation",
    icon: FileText,
    group: "OPERATIONS",
  },
  {
    id: "RR",
    title: "R&R",
    description:
      "Track rehabilitation and resettlement activities.",
    path: "/app/rr",
    icon: UsersRound,
    group: "OPERATIONS",
  },
  {
    id: "POSSESSION",
    title: "Possession",
    description:
      "Monitor possession readiness, verification and handover.",
    path: "/app/possession",
    icon: LandPlot,
    group: "OPERATIONS",
  },
  {
    id: "GIS",
    title: "GIS Intelligence",
    description:
      "Access spatial layers and parcel-centric intelligence.",
    path: "/app/gis",
    icon: Globe2,
    group: "INTELLIGENCE",
  },
  {
    id: "SATELLITE",
    title: "Satellite",
    description:
      "Review imagery and historical spatial observations.",
    path: "/app/satellite",
    icon: Satellite,
    group: "INTELLIGENCE",
  },
  {
    id: "AI_ALERTS",
    title: "AI Alerts",
    description:
      "Review potential changes requiring human verification.",
    path: "/app/ai-alerts",
    icon: Activity,
    group: "INTELLIGENCE",
  },
  {
    id: "FIELD_VERIFICATION",
    title: "Field Verification",
    description:
      "Review field evidence and verification assignments.",
    path: "/app/field-verification",
    icon: Radar,
    group: "INTELLIGENCE",
  },
  {
    id: "DOCUMENTS",
    title: "Documents",
    description:
      "Access authorized acquisition records and documents.",
    path: "/app/documents",
    icon: FileText,
    group: "GOVERNANCE",
  },
  {
    id: "REPORTS",
    title: "Reports",
    description:
      "Review operational reports and decision-support summaries.",
    path: "/app/reports",
    icon: BarChart3,
    group: "GOVERNANCE",
  },
  {
    id: "AUDIT",
    title: "Audit & Traceability",
    description:
      "Review system activity, decisions and traceability.",
    path: "/app/audit",
    icon: ShieldCheck,
    group: "GOVERNANCE",
  },
];

const GROUPS: Array<{
  id: ModuleDefinition["group"];
  label: string;
  description: string;
}> = [
  {
    id: "OPERATIONS",
    label: "Operations",
    description:
      "Core land acquisition workflow and delivery operations.",
  },
  {
    id: "INTELLIGENCE",
    label: "Intelligence",
    description:
      "Geospatial, satellite, AI and field intelligence.",
  },
  {
    id: "GOVERNANCE",
    label: "Governance",
    description:
      "Records, reporting, transparency and traceability.",
  },
];

function CommandCenterPage() {
  const { user, accessPolicy } = useAuth();

  if (!user || !accessPolicy) {
    return null;
  }

  const commandCenterScope = {
    jurisdiction: user.jurisdiction,
    jurisdictionType: user.jurisdictionType,
  };

  const metrics = getCommandCenterMetrics();
  const workflowStages = getCommandCenterWorkflowStages();

  const projectHealth = getCommandCenterProjectHealth(
    commandCenterScope,
  );

  /*
   * Attention items and intelligence signals currently do not
   * carry authoritative district/project identifiers in their
   * type contract. They therefore remain operational aggregates
   * until those identifiers are introduced into the data model.
   */
  const attentionItems = getCommandCenterAttentionItems();
  const intelligenceSignals =
    getCommandCenterIntelligenceSignals();

  const accessibleModules = MODULES.filter((module) =>
    accessPolicy.modules.includes(module.id),
  );

  const accessibleModuleCount = accessibleModules.length;

  const activeCasesMetric = metrics.find(
    (metric) => metric.id === "metric-active-cases",
  );

  const landAcquiredMetric = metrics.find(
    (metric) => metric.id === "metric-land-acquired",
  );

  const compensationMetric = metrics.find(
    (metric) => metric.id === "metric-compensation",
  );

  const attentionMetric = metrics.find(
    (metric) => metric.id === "metric-attention",
  );

  const onTrackProjects = projectHealth.filter(
    (project) => project.status === "ON_TRACK",
  ).length;

  const attentionProjects = projectHealth.filter(
    (project) => project.status === "ATTENTION",
  ).length;

  const delayedProjects = projectHealth.filter(
    (project) =>
      project.status === "DELAYED" ||
      project.status === "CRITICAL",
  ).length;

  const satelliteSignals = intelligenceSignals.filter(
    (signal) => signal.module === "SATELLITE",
  ).length;

  const aiSignals = intelligenceSignals.filter(
    (signal) => signal.module === "AI_ALERTS",
  ).length;

  const fieldVerificationSignals =
    intelligenceSignals.filter(
      (signal) => signal.module === "FIELD_VERIFICATION",
    ).length;

  const isStateWideScope =
    user.jurisdictionType.toLowerCase() === "state";

  return (
    <section className="command-center">
      <div className="command-center__topbar">
        <div className="command-center__identity">
          <div className="command-center__identity-mark">
            <Building2 size={20} strokeWidth={1.8} />
          </div>

          <div>
            <span className="command-center__identity-kicker">
              GOVERNMENT OPERATIONS
            </span>

            <h1>Command Center</h1>

            <p>
              National Land Acquisition &amp; Management System
            </p>
          </div>
        </div>

        <div className="command-center__context">
          <span className="command-center__context-label">
            CURRENT SCOPE
          </span>

          <strong>{user.jurisdiction}</strong>

          <span>
            {user.jurisdictionType} jurisdiction
          </span>
        </div>
      </div>

      <div className="command-center__status-banner">
        <div className="command-center__status-main">
          <span className="command-center__status-indicator">
            <CheckCircle2 size={16} />
          </span>

          <div>
            <strong>Operational workspace active</strong>

            <span>
              Records and modules are scoped to your authorized
              government role and jurisdiction.
            </span>
          </div>
        </div>

        <div className="command-center__status-meta">
          <span>ROLE</span>
          <strong>{accessPolicy.label}</strong>
        </div>
      </div>

      <section className="command-center__metrics">
        <article className="command-center__metric-card command-center__metric-card--primary">
          <div className="command-center__metric-top">
            <span>ACTIVE ACQUISITION CASES</span>

            <div className="command-center__metric-icon">
              <FileCheck2 size={18} />
            </div>
          </div>

          <div className="command-center__metric-value">
            {activeCasesMetric?.value ?? "—"}
          </div>

          <div className="command-center__metric-foot">
            <span className="command-center__metric-trend">
              <TrendingUp size={14} />
              {activeCasesMetric?.trend ?? "—"}
            </span>

            <span>
              {activeCasesMetric?.supportingText ??
                "Across authorized scope"}
            </span>
          </div>
        </article>

        <article className="command-center__metric-card">
          <div className="command-center__metric-top">
            <span>LAND ACQUIRED</span>

            <div className="command-center__metric-icon">
              <LandPlot size={18} />
            </div>
          </div>

          <div className="command-center__metric-value">
            {landAcquiredMetric?.value ?? "—"}
            {landAcquiredMetric?.unit && (
              <small> {landAcquiredMetric.unit}</small>
            )}
          </div>

          <div className="command-center__metric-foot">
            <span>
              {landAcquiredMetric?.supportingText ??
                "Of identified requirement"}
            </span>

            <strong>72.4%</strong>
          </div>

          <div className="command-center__progress">
            <span style={{ width: "72.4%" }} />
          </div>
        </article>

        <article className="command-center__metric-card">
          <div className="command-center__metric-top">
            <span>COMPENSATION PENDING</span>

            <div className="command-center__metric-icon">
              <WalletCards size={18} />
            </div>
          </div>

          <div className="command-center__metric-value">
            {compensationMetric?.value ?? "—"}
          </div>

          <div className="command-center__metric-foot">
            <span>
              {compensationMetric?.supportingText ??
                "Across active cases"}
            </span>

            <strong className="command-center__metric-warning">
              17 cases
            </strong>
          </div>
        </article>

        <article className="command-center__metric-card command-center__metric-card--attention">
          <div className="command-center__metric-top">
            <span>REQUIRES ATTENTION</span>

            <div className="command-center__metric-icon">
              <AlertTriangle size={18} />
            </div>
          </div>

          <div className="command-center__metric-value">
            {attentionMetric?.value ?? "—"}
          </div>

          <div className="command-center__metric-foot">
            <span>
              {attentionMetric?.supportingText ??
                "Operational review required"}
            </span>

            <strong className="command-center__metric-warning">
              Review
            </strong>
          </div>
        </article>
      </section>

      <div className="command-center__main-grid">
        <section className="command-center__panel command-center__panel--large">
          <div className="command-center__panel-header">
            <div>
              <span className="command-center__panel-kicker">
                ACQUISITION OVERVIEW
              </span>

              <h2>Workflow progress</h2>

              <p>
                Current operational distribution across the
                acquisition lifecycle.
              </p>
            </div>

            <Link
              to="/app/acquisition"
              className="command-center__panel-link"
            >
              Open acquisition
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="command-center__workflow">
            {workflowStages.map((stage) => (
              <div
                className="command-center__workflow-row"
                key={stage.id}
              >
                <div className="command-center__workflow-label">
                  <span className="command-center__workflow-number">
                    {String(stage.sequence).padStart(2, "0")}
                  </span>

                  <div>
                    <strong>{stage.name}</strong>
                    <span>Active cases</span>
                  </div>
                </div>

                <div className="command-center__workflow-bar">
                  <span
                    style={{
                      width: `${stage.progressPercentage}%`,
                    }}
                  />
                </div>

                <strong className="command-center__workflow-value">
                  {stage.activeCases}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="command-center__panel command-center__attention-panel">
          <div className="command-center__panel-header">
            <div>
              <span className="command-center__panel-kicker">
                PRIORITY QUEUE
              </span>

              <h2>Requires attention</h2>
            </div>

            <div className="command-center__attention-count">
              {attentionItems.length}
            </div>
          </div>

          <div className="command-center__attention-list">
            {attentionItems.map((item) => (
              <Link
                key={item.id}
                to={item.route}
                className="command-center__attention-item"
              >
                <span
                  className={`command-center__attention-icon${
                    item.priority === "CRITICAL" ||
                    item.priority === "HIGH"
                      ? " command-center__attention-icon--critical"
                      : ""
                  }`}
                >
                  {item.module === "COMPENSATION" ? (
                    <WalletCards size={16} />
                  ) : item.module === "FIELD_VERIFICATION" ? (
                    <ClipboardCheck size={16} />
                  ) : item.module === "POSSESSION" ? (
                    <LandPlot size={16} />
                  ) : (
                    <AlertTriangle size={16} />
                  )}
                </span>

                <span>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>

                <ChevronRight size={16} />
              </Link>
            ))}
          </div>

          <Link
            to="/app/decision-support"
            className="command-center__attention-footer"
          >
            Review decision-support indicators
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>

      <div className="command-center__secondary-grid">
        <section className="command-center__panel">
          <div className="command-center__panel-header">
            <div>
              <span className="command-center__panel-kicker">
                DELIVERY STATUS
              </span>

              <h2>Project health</h2>
            </div>

            <Link
              to="/app/projects"
              className="command-center__panel-link"
            >
              View projects
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="command-center__health">
            <div className="command-center__health-item">
              <span className="command-center__health-status command-center__health-status--good" />

              <div>
                <strong>On track</strong>

                <span>
                  Project workflows progressing normally
                </span>
              </div>

              <strong>{onTrackProjects}</strong>
            </div>

            <div className="command-center__health-item">
              <span className="command-center__health-status command-center__health-status--attention" />

              <div>
                <strong>Attention</strong>

                <span>
                  Operational review recommended
                </span>
              </div>

              <strong>{attentionProjects}</strong>
            </div>

            <div className="command-center__health-item">
              <span className="command-center__health-status command-center__health-status--critical" />

              <div>
                <strong>Delayed</strong>

                <span>
                  Workflow bottleneck identified
                </span>
              </div>

              <strong>{delayedProjects}</strong>
            </div>
          </div>
        </section>

        <section className="command-center__panel">
          <div className="command-center__panel-header">
            <div>
              <span className="command-center__panel-kicker">
                INTELLIGENCE
              </span>

              <h2>Monitoring signals</h2>
            </div>

            <Link
              to="/app/ai-alerts"
              className="command-center__panel-link"
            >
              Open alerts
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="command-center__signals">
            <div className="command-center__signal">
              <div className="command-center__signal-icon">
                <Satellite size={17} />
              </div>

              <div>
                <strong>Satellite observations</strong>

                <span>
                  Historical imagery available for review
                </span>
              </div>

              <span className="command-center__signal-value">
                {satelliteSignals}
              </span>
            </div>

            <div className="command-center__signal">
              <div className="command-center__signal-icon">
                <Activity size={17} />
              </div>

              <div>
                <strong>AI change alerts</strong>

                <span>
                  Potential changes requiring human review
                </span>
              </div>

              <span className="command-center__signal-value">
                {aiSignals}
              </span>
            </div>

            <div className="command-center__signal">
              <div className="command-center__signal-icon">
                <Radar size={17} />
              </div>

              <div>
                <strong>Field verification</strong>

                <span>
                  Evidence awaiting officer verification
                </span>
              </div>

              <span className="command-center__signal-value">
                {fieldVerificationSignals}
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="command-center__modules-section">
        <div className="command-center__section-heading">
          <div>
            <span className="command-center__panel-kicker">
              WORKSPACE
            </span>

            <h2>Authorized modules</h2>

            <p>
              Access operational capabilities available under
              your current role policy.
            </p>
          </div>

          <span className="command-center__module-count">
            {accessibleModuleCount} available
          </span>
        </div>

        {GROUPS.map((group) => {
          const groupModules = accessibleModules.filter(
            (module) => module.group === group.id,
          );

          if (groupModules.length === 0) {
            return null;
          }

          return (
            <section
              className="command-center__module-group"
              key={group.id}
            >
              <div className="command-center__module-group-heading">
                <div>
                  <h3>{group.label}</h3>
                  <p>{group.description}</p>
                </div>

                <span>
                  {groupModules.length}{" "}
                  {groupModules.length === 1
                    ? "module"
                    : "modules"}
                </span>
              </div>

              <div className="command-center__modules">
                {groupModules.map((module) => {
                  const Icon = module.icon;

                  return (
                    <Link
                      key={module.id}
                      to={module.path}
                      className="command-center__module"
                    >
                      <div className="command-center__module-icon">
                        <Icon size={18} strokeWidth={1.8} />
                      </div>

                      <div className="command-center__module-content">
                        <strong>
                          {getModuleLabel(module.id)}
                        </strong>

                        <span>{module.description}</span>
                      </div>

                      <ArrowRight
                        className="command-center__module-arrow"
                        size={16}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </section>

      <div className="command-center__scope-note">
        <ShieldCheck size={18} aria-hidden="true" />

        <div>
          <strong>Role-aware government workspace</strong>

          <p>
            The workspace is currently scoped to{" "}
            <strong>{user.jurisdiction}</strong> for the
            authenticated{" "}
            <strong>{accessPolicy.label}</strong> role.
            {isStateWideScope
              ? " State-level project health is shown across the authorized state scope."
              : " Project health is filtered to the assigned jurisdiction."}{" "}
            Operational aggregates and intelligence signals remain
            demo aggregates until authoritative jurisdiction
            identifiers are provided by the backend.
          </p>
        </div>
      </div>

      <div className="command-center__search-note">
        <Search size={16} aria-hidden="true" />

        <span>
          Use global search to locate authorized projects,
          parcels, ULPIN references and acquisition cases within
          your operational scope.
        </span>
      </div>
    </section>
  );
}

export default CommandCenterPage;