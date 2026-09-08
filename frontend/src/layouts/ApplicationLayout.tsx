import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Gavel,
  Globe2,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useMemo, useState } from "react";

import {
  hasModuleAccess,
  type GovernmentModule,
} from "../auth/roleAccess";

import { useAuth } from "../auth/AuthContext";

import "../styles/application.css";

type NavigationItem = {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  module: GovernmentModule;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const navigationGroups: NavigationGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Command Center",
        path: "/app",
        icon: LayoutDashboard,
        module: "COMMAND_CENTER",
      },
    ],
  },

  {
    label: "Operations",
    items: [
      {
        label: "Projects",
        path: "/app/projects",
        icon: FolderKanban,
        module: "PROJECTS",
      },
      {
        label: "Land & Parcels",
        path: "/app/land",
        icon: Map,
        module: "LAND_PARCELS",
      },
      {
        label: "Acquisition",
        path: "/app/acquisition",
        icon: BriefcaseBusiness,
        module: "ACQUISITION",
      },
      {
        label: "Proceedings",
        path: "/app/proceedings",
        icon: Gavel,
        module: "PROCEEDINGS",
      },
      {
        label: "Compensation",
        path: "/app/compensation",
        icon: WalletCards,
        module: "COMPENSATION",
      },
      {
        label: "R&R",
        path: "/app/rr",
        icon: Activity,
        module: "RR",
      },
      {
        label: "Possession",
        path: "/app/possession",
        icon: ClipboardCheck,
        module: "POSSESSION",
      },
    ],
  },

  {
    label: "Intelligence",
    items: [
      {
        label: "GIS Intelligence",
        path: "/app/gis",
        icon: Globe2,
        module: "GIS",
      },
      {
        label: "Satellite",
        path: "/app/satellite",
        icon: Globe2,
        module: "SATELLITE",
      },
      {
        label: "AI Alerts",
        path: "/app/ai-alerts",
        icon: AlertTriangle,
        module: "AI_ALERTS",
      },
      {
        label: "Field Verification",
        path: "/app/field-verification",
        icon: ClipboardCheck,
        module: "FIELD_VERIFICATION",
      },
    ],
  },

  {
    label: "Governance",
    items: [
      {
        label: "Documents",
        path: "/app/documents",
        icon: FileText,
        module: "DOCUMENTS",
      },
      {
        label: "Notifications",
        path: "/app/notifications",
        icon: Bell,
        module: "NOTIFICATIONS",
      },
      {
        label: "Reports",
        path: "/app/reports",
        icon: BarChart3,
        module: "REPORTS",
      },
      {
        label: "Audit & Traceability",
        path: "/app/audit",
        icon: ShieldCheck,
        module: "AUDIT",
      },
      {
        label: "Government Users",
        path: "/app/users",
        icon: Users,
        module: "USER_MANAGEMENT",
      },
    ],
  },
];

function ApplicationLayout() {
  const { user, accessPolicy, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const visibleGroups = useMemo(
    () =>
      navigationGroups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              user &&
              hasModuleAccess(user.role, item.module),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [user],
  );

  const initials = user
    ? user.name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "GU";

  const currentModule =
    visibleGroups
      .flatMap((group) => group.items)
      .find((item) =>
        item.path === "/app"
          ? location.pathname === "/app"
          : location.pathname.startsWith(item.path),
      );

  const handleLogout = () => {
    setProfileOpen(false);
    setSidebarOpen(false);

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="application-shell">
      {/* =====================================================
          MOBILE BACKDROP
          ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          className="application-sidebar__backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={`application-sidebar ${
          sidebarOpen
            ? "application-sidebar--open"
            : ""
        }`}
      >
        {/* -------------------------------------------------
            BRAND
            ------------------------------------------------- */}

        <div className="application-sidebar__brand">
          <div className="application-sidebar__brand-identity">
            <div className="application-sidebar__brand-wordmark">
              AAKAR
            </div>

            <div className="application-sidebar__brand-divider" />

            <div className="application-sidebar__brand-hindi">
              आकार
            </div>
          </div>

          <div className="application-sidebar__brand-tagline">
            Shaping land. Empowering development
          </div>

          <div className="application-sidebar__brand-system">
            National Land Acquisition &amp; Management System
          </div>

          <button
            type="button"
            className="application-sidebar__mobile-close"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* -------------------------------------------------
            AUTHORIZED SCOPE
            ------------------------------------------------- */}

        <div className="application-sidebar__scope">
          <div className="application-sidebar__scope-icon">
            <ShieldCheck size={15} />
          </div>

          <div className="application-sidebar__scope-content">
            <span className="application-sidebar__scope-label">
              Authorized scope
            </span>

            <strong className="application-sidebar__scope-value">
              {user?.jurisdiction ??
                "Government Workspace"}
            </strong>

            {user?.jurisdictionType && (
              <span className="application-sidebar__scope-type">
                {user.jurisdictionType} jurisdiction
              </span>
            )}
          </div>
        </div>

        {/* -------------------------------------------------
            NAVIGATION
            ------------------------------------------------- */}

        <div className="application-sidebar__content">
          <nav
            className="application-sidebar__navigation"
            aria-label="Application navigation"
          >
            {visibleGroups.map((group) => (
              <section
                className="application-sidebar__section"
                key={group.label}
              >
                <h2 className="application-sidebar__section-title">
                  {group.label}
                </h2>

                <div className="application-sidebar__nav">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/app"}
                        className={({ isActive }) =>
                          `application-sidebar__link ${
                            isActive
                              ? "application-sidebar__link--active"
                              : ""
                          }`
                        }
                        onClick={() =>
                          setSidebarOpen(false)
                        }
                      >
                        <span className="application-sidebar__link-icon">
                          <Icon
                            size={17}
                            strokeWidth={1.9}
                          />
                        </span>

                        <span className="application-sidebar__link-label">
                          {item.label}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>
        </div>

        {/* -------------------------------------------------
            SIDEBAR FOOTER
            ------------------------------------------------- */}

        <div className="application-sidebar__footer">
          <div className="application-sidebar__status">
            <span className="application-sidebar__status-dot" />

            <div>
              <strong>
                System Operational
              </strong>

              <span>
                Government workspace
              </span>
            </div>
          </div>

          <div className="application-sidebar__footer-config">
            <Settings size={14} />

            <span>
              System Configuration
            </span>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN APPLICATION
          ===================================================== */}

      <div className="application-main">
        {/* -------------------------------------------------
            HEADER
            ------------------------------------------------- */}

        <header className="application-header">
          <div className="application-header__left">
            <button
              type="button"
              className="application-mobile-menu"
              aria-label="Open navigation"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={20} />
            </button>

            <div className="application-header__context">
              <div className="application-breadcrumbs">
                <span className="application-breadcrumbs__brand">
                  AAKAR
                </span>

                <span
                  className="application-breadcrumbs__separator"
                  aria-hidden="true"
                >
                  /
                </span>

                <span className="application-breadcrumbs__current">
                  {currentModule?.label ??
                    "Government Workspace"}
                </span>
              </div>

              <div className="application-header__title">
                {currentModule?.label ??
                  "Government Workspace"}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------
              HEADER ACTIONS
              ------------------------------------------------- */}

          <div className="application-header__right">
            {/* Search */}

            <label className="application-search">
              <SearchIcon />

              <input
                type="search"
                placeholder="Search AAKAR"
                aria-label="Search AAKAR"
              />

              <span className="application-search__shortcut">
                /
              </span>
            </label>

            {/* Notification */}

            <button
              type="button"
              className="application-header__icon-button"
              aria-label="Notifications"
              onClick={() =>
                navigate("/app/notifications")
              }
            >
              <Bell size={17} />

              <span className="application-header__notification-dot" />
            </button>

            <div className="application-header__divider" />

            {/* User */}

            <div className="application-user">
              <button
                type="button"
                className="application-user__trigger"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() =>
                  setProfileOpen((value) => !value)
                }
              >
                <div className="application-user__avatar">
                  {initials}
                </div>

                <div className="application-user__info">
                  <span className="application-user__name">
                    {user?.name ??
                      "Government User"}
                  </span>

                  <span className="application-user__role">
                    {user?.designation ??
                      "Authorized Officer"}
                  </span>
                </div>

                <ChevronDown
                  size={15}
                  className="application-user__chevron"
                />
              </button>

              {profileOpen && (
                <>
                  <button
                    type="button"
                    className="application-user__menu-backdrop"
                    aria-label="Close profile menu"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  />

                  <div
                    className="application-user__menu"
                    role="menu"
                  >
                    <div className="application-user__menu-header">
                      <div className="application-user__menu-avatar">
                        {initials}
                      </div>

                      <div>
                        <strong>
                          {user?.name ??
                            "Government User"}
                        </strong>

                        <span>
                          {user?.organization ??
                            "Government Organization"}
                        </span>
                      </div>
                    </div>

                    <div className="application-user__menu-divider" />

                    <div className="application-user__menu-context">
                      <span>ROLE</span>

                      <strong>
                        {accessPolicy?.label ??
                          user?.designation ??
                          "Authorized Officer"}
                      </strong>
                    </div>

                    <div className="application-user__menu-context">
                      <span>JURISDICTION</span>

                      <strong>
                        {user?.jurisdiction ??
                          "Not specified"}
                      </strong>
                    </div>

                    <div className="application-user__menu-context">
                      <span>JURISDICTION TYPE</span>

                      <strong>
                        {user?.jurisdictionType ??
                          "Not specified"}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="application-user__logout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut size={15} />

                      <span>
                        Sign out
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* -------------------------------------------------
            CONTENT
            ------------------------------------------------- */}

        <main className="application-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   SEARCH ICON
   ========================================================= */

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default ApplicationLayout;