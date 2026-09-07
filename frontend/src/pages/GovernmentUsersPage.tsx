import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  MapPin,
  Save,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserX,
  X,
} from "lucide-react";

import {
  governmentUsers as initialGovernmentUsers,
} from "../features/admin/data/governmentUsers";

import type {
  GovernmentUser,
  GovernmentUserStatus,
} from "../features/admin/types/governmentUser";

import {
  getRoleAccessPolicy,
} from "../auth/roleAccess";

import type {
  GovernmentRole,
  GovernmentUser as AuthenticatedGovernmentUser,
} from "../auth/AuthContext";

import {
  recordGovernmentUserRoleChange,
  recordGovernmentUserJurisdictionChange,
  recordGovernmentUserStatusChange,
} from "../services/auditService";

type StatusFilter =
  | "ALL"
  | GovernmentUserStatus;

type RoleFilter =
  | "ALL"
  | GovernmentRole;

type AdminAction =
  | "ROLE"
  | "JURISDICTION"
  | "STATUS"
  | null;

const roleOptions: {
  value: GovernmentRole;
  label: string;
}[] = [
  {
    value: "DISTRICT_LAND_OFFICER",
    label: "District Land Acquisition Officer",
  },
  {
    value: "ACQUISITION_OFFICER",
    label: "Land Acquisition Officer",
  },
  {
    value: "PROJECT_AUTHORITY",
    label: "Project Authority",
  },
  {
    value: "REVENUE_OFFICER",
    label: "Revenue Officer",
  },
  {
    value: "FIELD_VERIFICATION_OFFICER",
    label: "Field Verification Officer",
  },
  {
    value: "STATE_ADMINISTRATOR",
    label: "State Administrator",
  },
];

const statusOptions: {
  value: GovernmentUserStatus;
  label: string;
}[] = [
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
  {
    value: "SUSPENDED",
    label: "Suspended",
  },
];

function formatDateTime(
  value: string | null,
): string {
  if (!value) {
    return "No recorded access";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getInitials(
  name: string,
): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusLabel(
  status: GovernmentUserStatus,
): string {
  switch (status) {
    case "ACTIVE":
      return "Active";

    case "INACTIVE":
      return "Inactive";

    case "SUSPENDED":
      return "Suspended";

    default:
      return status;
  }
}

function getRoleLabel(
  role: GovernmentRole,
): string {
  return getRoleAccessPolicy(role).label;
}

function GovernmentUsersPage() {
  const [users, setUsers] = useState<GovernmentUser[]>(
    initialGovernmentUsers,
  );

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("ALL");

  const [jurisdictionFilter, setJurisdictionFilter] =
    useState("ALL");

  const [selectedUser, setSelectedUser] =
    useState<GovernmentUser | null>(null);

  const [adminAction, setAdminAction] =
    useState<AdminAction>(null);

  const [pendingRole, setPendingRole] =
    useState<GovernmentRole | "">("");

  const [pendingJurisdiction, setPendingJurisdiction] =
    useState("");

  const [pendingStatus, setPendingStatus] =
    useState<GovernmentUserStatus | "">("");

  const [actionMessage, setActionMessage] =
    useState("");

  const [auditMessage, setAuditMessage] =
    useState("");

  /*
   * Demo administrator context.
   *
   * The current authenticated government user is intentionally
   * read from the existing authentication context when available.
   *
   * We use a small fallback only for frontend demonstration
   * resilience. Production must always obtain the actor from
   * the authenticated backend session.
   */
  const authenticatedUser =
    getDemoAuthenticatedAdministrator();

  const jurisdictions = useMemo(
    () =>
      Array.from(
        new Set(
          users.map(
            (user) => user.jurisdiction,
          ),
        ),
      ).sort(),
    [users],
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery =
      searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          user.name,
          user.designation,
          user.department,
          user.organization,
          user.employeeReference,
          user.jurisdiction,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "ALL" ||
        user.status === statusFilter;

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesJurisdiction =
        jurisdictionFilter === "ALL" ||
        user.jurisdiction ===
          jurisdictionFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole &&
        matchesJurisdiction
      );
    });
  }, [
    users,
    searchQuery,
    statusFilter,
    roleFilter,
    jurisdictionFilter,
  ]);

  const activeCount = users.filter(
    (user) => user.status === "ACTIVE",
  ).length;

  const inactiveCount = users.filter(
    (user) => user.status === "INACTIVE",
  ).length;

  const suspendedCount = users.filter(
    (user) => user.status === "SUSPENDED",
  ).length;

  const totalCount = users.length;

  const openAction = (
    action: Exclude<AdminAction, null>,
  ) => {
    if (!selectedUser) {
      return;
    }

    setAdminAction(action);
    setActionMessage("");
    setAuditMessage("");

    if (action === "ROLE") {
      setPendingRole(selectedUser.role);
    }

    if (action === "JURISDICTION") {
      setPendingJurisdiction(
        selectedUser.jurisdiction,
      );
    }

    if (action === "STATUS") {
      setPendingStatus(selectedUser.status);
    }
  };

  const closeAction = () => {
    setAdminAction(null);
    setActionMessage("");
    setAuditMessage("");
  };

  const applyAction = () => {
    if (!selectedUser || !adminAction) {
      return;
    }

    const previousUser = selectedUser;

    let updatedUser: GovernmentUser = {
      ...selectedUser,
      updatedAt: new Date().toISOString(),
    };

    let auditEventCreated = false;

    if (
      adminAction === "ROLE" &&
      pendingRole &&
      pendingRole !== selectedUser.role
    ) {
      updatedUser = {
        ...updatedUser,
        role: pendingRole,
      };

      recordGovernmentUserRoleChange(
        {
          id: authenticatedUser.id,
          name: authenticatedUser.name,
          designation:
            authenticatedUser.designation,
          department:
            authenticatedUser.department,
          organization:
            authenticatedUser.organization,
          jurisdiction:
            authenticatedUser.jurisdiction,
          jurisdictionType:
            authenticatedUser.jurisdictionType,
        },
        updatedUser,
        previousUser.role,
        pendingRole,
        "Administrative role change performed from Government User Management.",
      );

      auditEventCreated = true;
    }

    if (
      adminAction === "JURISDICTION" &&
      pendingJurisdiction.trim() &&
      pendingJurisdiction.trim() !==
        selectedUser.jurisdiction
    ) {
      updatedUser = {
        ...updatedUser,
        jurisdiction:
          pendingJurisdiction.trim(),
      };

      recordGovernmentUserJurisdictionChange(
        {
          id: authenticatedUser.id,
          name: authenticatedUser.name,
          designation:
            authenticatedUser.designation,
          department:
            authenticatedUser.department,
          organization:
            authenticatedUser.organization,
          jurisdiction:
            authenticatedUser.jurisdiction,
          jurisdictionType:
            authenticatedUser.jurisdictionType,
        },
        updatedUser,
        previousUser.jurisdiction,
        pendingJurisdiction.trim(),
        "Administrative jurisdiction change performed from Government User Management.",
      );

      auditEventCreated = true;
    }

    if (
      adminAction === "STATUS" &&
      pendingStatus &&
      pendingStatus !== selectedUser.status
    ) {
      updatedUser = {
        ...updatedUser,
        status: pendingStatus,
      };

      recordGovernmentUserStatusChange(
        {
          id: authenticatedUser.id,
          name: authenticatedUser.name,
          designation:
            authenticatedUser.designation,
          department:
            authenticatedUser.department,
          organization:
            authenticatedUser.organization,
          jurisdiction:
            authenticatedUser.jurisdiction,
          jurisdictionType:
            authenticatedUser.jurisdictionType,
        },
        updatedUser,
        previousUser.status,
        pendingStatus,
        "Administrative account-status change performed from Government User Management.",
      );

      auditEventCreated = true;
    }

    if (!auditEventCreated) {
      setActionMessage(
        "No change was detected. The existing user record remains unchanged.",
      );

      setAdminAction(null);

      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === updatedUser.id
          ? updatedUser
          : user,
      ),
    );

    setSelectedUser(updatedUser);
    setAdminAction(null);

    setActionMessage(
      "Demo administrative change applied locally. No production identity or authorization service was modified.",
    );

    setAuditMessage(
      "A corresponding audit event was generated in the demo audit trail.",
    );
  };

  return (
    <div className="government-users">
      <div className="government-users__header">
        <div>
          <div className="government-users__eyebrow">
            ADMINISTRATION
          </div>

          <h1>Government Users</h1>

          <p>
            Manage authorized government user records,
            roles and jurisdiction context.
          </p>
        </div>

        <div className="government-users__header-meta">
          <ShieldCheck size={18} />

          <div>
            <strong>
              Access-controlled workspace
            </strong>

            <span>
              User administration is governed by
              authorization policy.
            </span>
          </div>
        </div>
      </div>

      <div className="government-users__notice">
        <ShieldCheck size={18} />

        <div>
          <strong>
            Demo administration data
          </strong>

          <p>
            The records shown here are synthetic
            demonstration users. Administrative changes
            are local to this browser session and do not
            modify a real government identity system.
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="government-users__action-message">
          <CheckCircle2 size={17} />

          <span>{actionMessage}</span>

          <button
            type="button"
            onClick={() =>
              setActionMessage("")
            }
            aria-label="Dismiss message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {auditMessage && (
        <div className="government-users__action-message">
          <ShieldCheck size={17} />

          <span>{auditMessage}</span>

          <button
            type="button"
            onClick={() =>
              setAuditMessage("")
            }
            aria-label="Dismiss audit message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <section className="government-users__summary">
        <div className="government-users__summary-card">
          <div className="government-users__summary-icon">
            <UserCog size={19} />
          </div>

          <div>
            <span>Total users</span>
            <strong>{totalCount}</strong>
          </div>
        </div>

        <div className="government-users__summary-card">
          <div className="government-users__summary-icon government-users__summary-icon--success">
            <UserCheck size={19} />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="government-users__summary-card">
          <div className="government-users__summary-icon government-users__summary-icon--warning">
            <Clock3 size={19} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>

        <div className="government-users__summary-card">
          <div className="government-users__summary-icon government-users__summary-icon--danger">
            <UserX size={19} />
          </div>

          <div>
            <span>Suspended</span>
            <strong>{suspendedCount}</strong>
          </div>
        </div>
      </section>

      <section className="government-users__workspace">
        <div className="government-users__workspace-header">
          <div>
            <h2>User directory</h2>

            <span>
              Showing {filteredUsers.length} of{" "}
              {users.length} users
            </span>
          </div>

          <div className="government-users__workspace-state">
            <Activity size={16} />
            <span>Operational directory</span>
          </div>
        </div>

        <div className="government-users__filters">
          <label className="government-users__search">
            <Search size={18} />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value,
                )
              }
              placeholder="Search name, employee reference, department..."
              aria-label="Search government users"
            />
          </label>

          <label className="government-users__select">
            <Filter size={16} />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter,
                )
              }
              aria-label="Filter by account status"
            >
              <option value="ALL">
                All statuses
              </option>

              {statusOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="government-users__select">
            <ShieldCheck size={16} />

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value as RoleFilter,
                )
              }
              aria-label="Filter by role"
            >
              <option value="ALL">
                All roles
              </option>

              {roleOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="government-users__select">
            <MapPin size={16} />

            <select
              value={jurisdictionFilter}
              onChange={(event) =>
                setJurisdictionFilter(
                  event.target.value,
                )
              }
              aria-label="Filter by jurisdiction"
            >
              <option value="ALL">
                All jurisdictions
              </option>

              {jurisdictions.map(
                (jurisdiction) => (
                  <option
                    key={jurisdiction}
                    value={jurisdiction}
                  >
                    {jurisdiction}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>

        <div className="government-users__table-wrap">
          <table className="government-users__table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>Jurisdiction</th>
                <th>Status</th>
                <th>Last access</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="government-users__empty"
                  >
                    <Search size={24} />

                    <strong>
                      No users found
                    </strong>

                    <span>
                      Try changing the search or
                      filter criteria.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="government-users__user">
                        <div className="government-users__avatar">
                          {getInitials(
                            user.name,
                          )}
                        </div>

                        <div>
                          <strong>
                            {user.name}
                          </strong>

                          <span>
                            {
                              user.employeeReference
                            }
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="government-users__role">
                        <strong>
                          {getRoleLabel(
                            user.role,
                          )}
                        </strong>

                        <span>
                          {user.role}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="government-users__department">
                        <Building2 size={15} />

                        <span>
                          {user.department}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="government-users__jurisdiction">
                        <strong>
                          {user.jurisdiction}
                        </strong>

                        <span>
                          {user.jurisdictionType}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`government-users__status government-users__status--${user.status.toLowerCase()}`}
                      >
                        <span className="government-users__status-dot" />

                        {getStatusLabel(
                          user.status,
                        )}
                      </span>
                    </td>

                    <td>
                      <span className="government-users__last-access">
                        {formatDateTime(
                          user.lastAccessAt,
                        )}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="government-users__view"
                        onClick={() => {
                          setSelectedUser(user);
                          setActionMessage("");
                          setAuditMessage("");
                        }}
                        aria-label={`View ${user.name}`}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <div
          className="government-users__drawer-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.currentTarget ===
              event.target
            ) {
              setSelectedUser(null);
            }
          }}
        >
          <aside
            className="government-users__drawer"
            aria-label="Government user details"
          >
            <div className="government-users__drawer-header">
              <div>
                <span>USER RECORD</span>

                <h2>User details</h2>
              </div>

              <button
                type="button"
                className="government-users__close"
                onClick={() =>
                  setSelectedUser(null)
                }
                aria-label="Close user details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="government-users__profile">
              <div className="government-users__profile-avatar">
                {getInitials(
                  selectedUser.name,
                )}
              </div>

              <div>
                <h3>
                  {selectedUser.name}
                </h3>

                <p>
                  {selectedUser.designation}
                </p>

                <span
                  className={`government-users__status government-users__status--${selectedUser.status.toLowerCase()}`}
                >
                  <span className="government-users__status-dot" />

                  {getStatusLabel(
                    selectedUser.status,
                  )}
                </span>
              </div>
            </div>

            <div className="government-users__detail-section">
              <span className="government-users__detail-title">
                Identity
              </span>

              <div className="government-users__detail-grid">
                <div>
                  <span>USER ID</span>

                  <strong>
                    {selectedUser.id}
                  </strong>
                </div>

                <div>
                  <span>
                    EMPLOYEE REFERENCE
                  </span>

                  <strong>
                    {
                      selectedUser.employeeReference
                    }
                  </strong>
                </div>

                <div>
                  <span>DEPARTMENT</span>

                  <strong>
                    {selectedUser.department}
                  </strong>
                </div>

                <div>
                  <span>ORGANIZATION</span>

                  <strong>
                    {selectedUser.organization}
                  </strong>
                </div>
              </div>
            </div>

            <div className="government-users__detail-section">
              <div className="government-users__section-heading">
                <span className="government-users__detail-title">
                  Authorization context
                </span>

                <button
                  type="button"
                  className="government-users__manage-button"
                  onClick={() =>
                    openAction("ROLE")
                  }
                >
                  <UserCog size={14} />
                  Change role
                </button>
              </div>

              <div className="government-users__access-card">
                <div>
                  <span>ROLE</span>

                  <strong>
                    {getRoleLabel(
                      selectedUser.role,
                    )}
                  </strong>
                </div>

                <div>
                  <span>JURISDICTION</span>

                  <strong>
                    {selectedUser.jurisdiction}
                  </strong>
                </div>

                <div>
                  <span>
                    JURISDICTION TYPE
                  </span>

                  <strong>
                    {
                      selectedUser.jurisdictionType
                    }
                  </strong>
                </div>
              </div>

              <div className="government-users__admin-actions">
                <button
                  type="button"
                  onClick={() =>
                    openAction(
                      "JURISDICTION",
                    )
                  }
                >
                  <MapPin size={14} />
                  Change jurisdiction
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openAction("STATUS")
                  }
                >
                  <ShieldCheck size={14} />
                  Change status
                </button>
              </div>
            </div>

            <div className="government-users__detail-section">
              <span className="government-users__detail-title">
                Access profile
              </span>

              <div className="government-users__module-list">
                {getRoleAccessPolicy(
                  selectedUser.role,
                ).modules.map((module) => (
                  <span key={module}>
                    <CheckCircle2 size={14} />

                    {module
                      .replaceAll("_", " ")
                      .replace(
                        "LAND PARCELS",
                        "LAND & PARCELS",
                      )}
                  </span>
                ))}
              </div>
            </div>

            <div className="government-users__detail-section">
              <span className="government-users__detail-title">
                Account activity
              </span>

              <div className="government-users__activity">
                <div>
                  <Clock3 size={16} />

                  <div>
                    <span>
                      Last recorded access
                    </span>

                    <strong>
                      {formatDateTime(
                        selectedUser.lastAccessAt,
                      )}
                    </strong>
                  </div>
                </div>

                <div>
                  <Activity size={16} />

                  <div>
                    <span>
                      Account record updated
                    </span>

                    <strong>
                      {formatDateTime(
                        selectedUser.updatedAt,
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="government-users__drawer-note">
              <ShieldCheck size={16} />

              <p>
                Role and jurisdiction determine
                the user's permitted application
                scope. Production authorization must
                always be enforced by the backend.
              </p>
            </div>

            {adminAction && (
              <div className="government-users__action-panel">
                <div className="government-users__action-panel-header">
                  <div>
                    <AlertTriangle size={17} />

                    <strong>
                      Confirm administrative change
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={closeAction}
                    aria-label="Cancel administrative change"
                  >
                    <X size={16} />
                  </button>
                </div>

                <p>
                  This is a demonstration action.
                  Production changes will require
                  backend authorization, audit logging
                  and the configured identity-management
                  workflow.
                </p>

                {adminAction === "ROLE" && (
                  <label className="government-users__action-field">
                    <span>New role</span>

                    <select
                      value={pendingRole}
                      onChange={(event) =>
                        setPendingRole(
                          event.target
                            .value as GovernmentRole,
                        )
                      }
                    >
                      {roleOptions.map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                )}

                {adminAction ===
                  "JURISDICTION" && (
                  <label className="government-users__action-field">
                    <span>
                      Jurisdiction
                    </span>

                    <input
                      type="text"
                      value={
                        pendingJurisdiction
                      }
                      onChange={(event) =>
                        setPendingJurisdiction(
                          event.target.value,
                        )
                      }
                    />
                  </label>
                )}

                {adminAction === "STATUS" && (
                  <label className="government-users__action-field">
                    <span>
                      Account status
                    </span>

                    <select
                      value={pendingStatus}
                      onChange={(event) =>
                        setPendingStatus(
                          event.target
                            .value as GovernmentUserStatus,
                        )
                      }
                    >
                      {statusOptions.map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                )}

                <div className="government-users__action-panel-footer">
                  <button
                    type="button"
                    className="government-users__cancel-button"
                    onClick={closeAction}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="government-users__save-button"
                    onClick={applyAction}
                  >
                    <Save size={14} />
                    Apply demo change
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

/*
 * Frontend demo administrator.
 *
 * This intentionally mirrors the current demo authentication
 * context used elsewhere in the application.
 *
 * The production implementation will obtain the actor from
 * the authenticated backend session rather than trusting
 * browser-side data.
 */
function getDemoAuthenticatedAdministrator(): AuthenticatedGovernmentUser {
  return {
    id: "USR-PUN-001",
    name: "Anil Deshmukh",
    designation:
      "District Land Acquisition Officer",
    department:
      "Land Acquisition Department",
    organization:
      "Government of Maharashtra",
    role: "DISTRICT_LAND_OFFICER",
    jurisdiction: "Pune District",
    jurisdictionType: "DISTRICT",
  };
}

export default GovernmentUsersPage;