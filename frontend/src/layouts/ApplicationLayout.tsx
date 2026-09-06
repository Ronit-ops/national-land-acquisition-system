import {
  Activity,
  Bell,
  Building2,
  ClipboardList,
  FileBarChart,
  FileSearch,
  FolderKanban,
  Globe2,
  LayoutDashboard,
  Map,
  Menu,
  Mountain,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "../styles/application.css";

interface NavigationItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const primaryNavigation: NavigationItem[] = [
  {
    label: "Command Center",
    path: "/app",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/app/projects",
    icon: FolderKanban,
  },
  {
    label: "Land & Parcels",
    path: "/app/land",
    icon: Map,
  },
  {
    label: "Acquisition",
    path: "/app/acquisition",
    icon: ClipboardList,
  },
  {
    label: "Compensation",
    path: "/app/compensation",
    icon: Wallet,
  },
  {
    label: "R&R",
    path: "/app/rr",
    icon: Users,
  },
  {
    label: "Possession",
    path: "/app/possession",
    icon: Building2,
  },
];

const intelligenceNavigation: NavigationItem[] = [
  {
    label: "GIS Intelligence",
    path: "/app/gis",
    icon: Map,
  },
  {
    label: "Satellite",
    path: "/app/satellite",
    icon: Mountain,
  },
  {
    label: "AI Alerts",
    path: "/app/ai-alerts",
    icon: Activity,
  },
  {
    label: "Field Verification",
    path: "/app/field-verification",
    icon: ShieldCheck,
  },
];

const governanceNavigation: NavigationItem[] = [
  {
    label: "Documents",
    path: "/app/documents",
    icon: FileSearch,
  },
  {
    label: "Reports",
    path: "/app/reports",
    icon: FileBarChart,
  },
  {
    label: "Audit & Traceability",
    path: "/app/audit",
    icon: FileSearch,
  },
];

function ApplicationNavigation({
  items,
}: {
  items: NavigationItem[];
}) {
  return (
    <nav className="application-sidebar__nav">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/app"}
            className={({ isActive }) =>
              `application-sidebar__link ${
                isActive ? "application-sidebar__link--active" : ""
              }`
            }
          >
            <span className="application-sidebar__link-icon">
              <Icon size={15} />
            </span>

            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function ApplicationLayout() {
  const location = useLocation();

  const currentPath = location.pathname;

  let currentTitle = "Command Center";

  if (currentPath.startsWith("/app/projects")) {
    currentTitle = "Projects";
  } else if (currentPath.startsWith("/app/land")) {
    currentTitle = "Land & Parcels";
  } else if (currentPath.startsWith("/app/acquisition")) {
    currentTitle = "Acquisition";
  } else if (currentPath.startsWith("/app/compensation")) {
    currentTitle = "Compensation";
  } else if (currentPath.startsWith("/app/rr")) {
    currentTitle = "Rehabilitation & Resettlement";
  } else if (currentPath.startsWith("/app/possession")) {
    currentTitle = "Possession";
  } else if (currentPath.startsWith("/app/gis")) {
    currentTitle = "GIS Intelligence";
  } else if (currentPath.startsWith("/app/satellite")) {
    currentTitle = "Satellite Intelligence";
  } else if (currentPath.startsWith("/app/ai-alerts")) {
    currentTitle = "AI Alerts";
  } else if (currentPath.startsWith("/app/field-verification")) {
    currentTitle = "Field Verification";
  } else if (currentPath.startsWith("/app/documents")) {
    currentTitle = "Documents";
  } else if (currentPath.startsWith("/app/reports")) {
    currentTitle = "Reports";
  } else if (currentPath.startsWith("/app/audit")) {
    currentTitle = "Audit & Traceability";
  }

  return (
    <div className="application-shell">
      <aside className="application-sidebar">
        <NavLink to="/app" className="application-sidebar__brand">
          <span className="application-sidebar__brand-mark">
            <Globe2 size={19} />
          </span>

          <span className="application-sidebar__brand-text">
            <span className="application-sidebar__brand-title">
              National Land Acquisition
            </span>

            <span className="application-sidebar__brand-subtitle">
              Management System
            </span>
          </span>
        </NavLink>

        <div className="application-sidebar__content">
          <section className="application-sidebar__section">
            <p className="application-sidebar__section-title">
              Operations
            </p>

            <ApplicationNavigation items={primaryNavigation} />
          </section>

          <section className="application-sidebar__section">
            <p className="application-sidebar__section-title">
              Intelligence
            </p>

            <ApplicationNavigation items={intelligenceNavigation} />
          </section>

          <section className="application-sidebar__section">
            <p className="application-sidebar__section-title">
              Governance
            </p>

            <ApplicationNavigation items={governanceNavigation} />
          </section>
        </div>

        <div className="application-sidebar__footer">
          <div className="application-sidebar__status">
            <span className="application-sidebar__status-dot" />

            <div>
              <strong>System Environment</strong>
              <span>Demonstration workspace</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="application-main">
        <header className="application-header">
          <div className="application-header__left">
            <button
              type="button"
              className="application-mobile-menu"
              aria-label="Open navigation menu"
            >
              <Menu size={16} />
            </button>

            <div>
              <div className="application-breadcrumbs">
                <span>National Platform</span>
                <span>/</span>
                <span className="application-breadcrumbs__current">
                  {currentTitle}
                </span>
              </div>

              <h1 className="application-header__title">
                {currentTitle}
              </h1>
            </div>
          </div>

          <div className="application-header__right">
            <label className="application-search">
              <FileSearch size={14} aria-hidden="true" />

              <input
                type="search"
                placeholder="Search projects, parcels, ULPIN..."
                aria-label="Search projects, parcels and ULPIN"
              />
            </label>

            <button
              type="button"
              className="application-header__icon-button"
              aria-label="Notifications"
            >
              <Bell size={15} />

              <span
                className="application-header__notification-dot"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              className="application-header__icon-button"
              aria-label="Settings"
            >
              <Settings size={15} />
            </button>

            <div className="application-user">
              <div className="application-user__avatar">DO</div>

              <div className="application-user__info">
                <span className="application-user__name">
                  Demonstration Officer
                </span>

                <span className="application-user__role">
                  District Land Acquisition Officer
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="application-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ApplicationLayout;