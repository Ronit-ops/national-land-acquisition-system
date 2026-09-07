import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
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
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getModuleLabel,
  type GovernmentModule,
} from "../auth/roleAccess";
import { useAuth } from "../auth/AuthContext";

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
    description:
      "Monitor infrastructure projects and land requirements.",
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
}> = [
  {
    id: "OPERATIONS",
    label: "Operations",
  },
  {
    id: "INTELLIGENCE",
    label: "Intelligence",
  },
  {
    id: "GOVERNANCE",
    label: "Governance",
  },
];

function CommandCenterPage() {
  const { user, accessPolicy } = useAuth();

  if (!user || !accessPolicy) {
    return null;
  }

  const accessibleModules = MODULES.filter((module) =>
    accessPolicy.modules.includes(module.id),
  );

  return (
    <section className="command-center">
      <div className="command-center__context">
        <div className="command-center__context-main">
          <div className="command-center__context-icon">
            <Building2 size={20} />
          </div>

          <div>
            <span className="command-center__context-label">
              CURRENT OPERATIONAL CONTEXT
            </span>

            <strong>{user.designation}</strong>

            <span>
              {user.department} · {user.organization}
            </span>
          </div>
        </div>

        <div className="command-center__jurisdiction">
          <span>JURISDICTION</span>

          <strong>{user.jurisdiction}</strong>

          <small>
            {user.jurisdictionType} level
          </small>
        </div>
      </div>

      <div className="command-center__hero">
        <div>
          <span className="command-center__eyebrow">
            GOVERNMENT OPERATIONS
          </span>

          <h1>National Land Acquisition Command Center</h1>

          <p>
            A unified operational workspace connecting projects,
            parcels, acquisition workflows, compensation,
            rehabilitation and resettlement, possession,
            geospatial intelligence and AI-assisted monitoring.
          </p>
        </div>

        <div className="command-center__hero-status">
          <span className="command-center__status-dot" />

          <div>
            <strong>Operational scope</strong>

            <span>
              {user.jurisdiction}
            </span>
          </div>
        </div>
      </div>

      <div className="command-center__summary">
        <div className="command-center__summary-card">
          <span>ACCESS ROLE</span>

          <strong>{accessPolicy.label}</strong>

          <small>{accessPolicy.description}</small>
        </div>

        <div className="command-center__summary-card">
          <span>JURISDICTION TYPE</span>

          <strong>{user.jurisdictionType}</strong>

          <small>
            Operational records are scoped to the assigned
            jurisdiction.
          </small>
        </div>

        <div className="command-center__summary-card">
          <span>AVAILABLE MODULES</span>

          <strong>{accessibleModules.length}</strong>

          <small>
            Modules available under the current role policy.
          </small>
        </div>
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
            className="command-center__group"
            key={group.id}
          >
            <div className="command-center__group-heading">
              <div>
                <span>{group.label}</span>

                <p>
                  Role-authorized {group.label.toLowerCase()} modules
                </p>
              </div>

              <small>
                {groupModules.length}{" "}
                {groupModules.length === 1
                  ? "module"
                  : "modules"}
              </small>
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
                      <Icon size={18} />
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

      <div className="command-center__scope-note">
        <ShieldCheck size={17} aria-hidden="true" />

        <div>
          <strong>
            Role-aware workspace
          </strong>

          <p>
            The modules shown above are determined by the current
            government role policy. Final authorization of
            records, actions and sensitive information will be
            enforced by the backend when the production
            authorization service is implemented.
          </p>
        </div>
      </div>

      <div className="command-center__search-note">
        <Search size={16} aria-hidden="true" />

        <span>
          Use the global search to locate authorized projects,
          parcels, ULPIN references and acquisition cases within
          your operational scope.
        </span>
      </div>
    </section>
  );
}

export default CommandCenterPage;