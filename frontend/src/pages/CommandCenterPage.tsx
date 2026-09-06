import {
  Activity,
  ClipboardList,
  FolderKanban,
  Map,
  Satellite,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

const modules = [
  {
    title: "Projects",
    description: "Monitor infrastructure projects and land requirements.",
    path: "/app/projects",
    icon: FolderKanban,
  },
  {
    title: "Land & Parcels",
    description: "Explore parcel records and recorded right-holder information.",
    path: "/app/land",
    icon: Map,
  },
  {
    title: "Acquisition",
    description: "Track acquisition stages, notifications and hearings.",
    path: "/app/acquisition",
    icon: ClipboardList,
  },
  {
    title: "Compensation",
    description: "Monitor valuation, awards and payment status.",
    path: "/app/compensation",
    icon: Wallet,
  },
  {
    title: "R&R",
    description: "Track rehabilitation and resettlement activities.",
    path: "/app/rr",
    icon: Users,
  },
  {
    title: "GIS Intelligence",
    description: "Access spatial layers and parcel-centric intelligence.",
    path: "/app/gis",
    icon: Map,
  },
  {
    title: "Satellite",
    description: "Review imagery and historical spatial observations.",
    path: "/app/satellite",
    icon: Satellite,
  },
  {
    title: "AI Alerts",
    description: "Review potential changes requiring human verification.",
    path: "/app/ai-alerts",
    icon: Activity,
  },
];

function CommandCenterPage() {
  return (
    <>
      <div className="application-demo-banner">
        <Activity size={15} aria-hidden="true" />

        <div>
          <strong>Demonstration Environment</strong>

          <span>
            The current workspace uses simulated data. It does not represent
            live government records or live government integrations.
          </span>
        </div>
      </div>

      <section className="application-welcome">
        <span className="application-welcome__eyebrow">
          GOVERNMENT OPERATIONS
        </span>

        <h2>National Land Acquisition Command Center</h2>

        <p>
          A unified operational workspace connecting projects, parcels,
          acquisition workflows, compensation, rehabilitation and
          resettlement, geospatial intelligence and AI-assisted monitoring.
        </p>
      </section>

      <section
        className="application-module-grid"
        aria-label="Platform modules"
      >
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.path}
              to={module.path}
              className="application-module-card"
            >
              <span className="application-module-card__icon">
                <Icon size={16} />
              </span>

              <div>
                <h3>{module.title}</h3>

                <p>{module.description}</p>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}

export default CommandCenterPage;