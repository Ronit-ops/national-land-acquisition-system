import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileWarning,
  History,
  Info,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { useAuth } from "../auth/AuthContext";

import {
  getNotificationIssuanceActionRequiredCount,
  getNotificationIssuanceBlockingIssueCount,
  getNotificationIssuanceStageLabel,
  getNotificationValidationStatusLabel,
  getFilteredNotificationIssuanceRecords,
  hasBlockingValidationIssues,
  hasValidationWarnings,
} from "../features/notifications/utils/notificationIssuanceLookup";

import {
  getNotificationValidationResult,
} from "../features/notifications/data/notificationIssuanceData";

import {
  executeStartNotificationValidation,
  executeCompleteNotificationValidation,
  executeMarkNotificationReady,
  executeIssueNotification,
  executeRejectNotification,
  executeCancelNotification,
} from "../features/notifications/utils/notificationIssuanceActions";

import type {
  NotificationCancellationReason,
  NotificationIssuanceActor,
  NotificationIssuanceRecord,
  NotificationIssuanceStage,
  NotificationRejectionReason,
  NotificationValidationStatus,
} from "../features/notifications/types/notificationIssuance";

import "../styles/application.css";
import "../styles/notification-issuance.css";

/* =========================================================
   PAGE
   ========================================================= */

function NotificationIssuancePage() {
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [stageFilter, setStageFilter] =
    useState<
      NotificationIssuanceStage | "ALL"
    >("ALL");

  const [
    validationFilter,
    setValidationFilter,
  ] = useState<
    NotificationValidationStatus | "ALL"
  >("ALL");

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [refreshKey, setRefreshKey] =
    useState(0);

  const scope = useMemo(
    () => ({
      jurisdiction: user?.jurisdiction,
      jurisdictionType:
        user?.jurisdictionType,
    }),
    [user],
  );

  const records = useMemo(
    () =>
      getFilteredNotificationIssuanceRecords(
        {
          searchTerm,
          stage:
            stageFilter === "ALL"
              ? undefined
              : stageFilter,
          validationStatus:
            validationFilter === "ALL"
              ? undefined
              : validationFilter,
        },
        scope,
      ),
    [
      searchTerm,
      stageFilter,
      validationFilter,
      scope,
      refreshKey,
    ],
  );

  const selectedRecord =
    useMemo(() => {
      if (records.length === 0) {
        return null;
      }

      if (selectedId) {
        const existing =
          records.find(
            (record) =>
              record.id === selectedId,
          );

        if (existing) {
          return existing;
        }
      }

      return records[0];
    }, [
      records,
      selectedId,
    ]);

  const validation = selectedRecord
    ? getNotificationValidationResult(
        selectedRecord.notificationId,
      )
    : undefined;

  const actionRequiredCount =
    getNotificationIssuanceActionRequiredCount();

  const blockingIssueCount =
    getNotificationIssuanceBlockingIssueCount();

  const handleActionComplete = () => {
    setRefreshKey(
      (current) => current + 1,
    );
  };

  return (
    <div className="issuance-workspace">
      <section className="issuance-page-header">
        <div>
          <div className="issuance-eyebrow">
            CONTROLLED COMMUNICATION
          </div>

          <h1>
            Notification Issuance
          </h1>

          <p>
            Validate, authorize and track
            government notification issuance
            through an auditable workflow.
          </p>
        </div>

        <div className="issuance-header-badge">
          <ShieldCheck size={15} />

          <span>
            Controlled officer workflow
          </span>
        </div>
      </section>

      <section
        className="issuance-metrics"
        aria-label="Notification issuance metrics"
      >
        <MetricCard
          icon={<Bell size={18} />}
          label="Total workflows"
          value={6}
        />

        <MetricCard
          icon={<Clock3 size={18} />}
          label="Awaiting officer action"
          value={actionRequiredCount}
        />

        <MetricCard
          icon={<FileCheck2 size={18} />}
          label="Ready for issuance"
          value={
            getFilteredNotificationIssuanceRecords(
              {
                stage:
                  "READY_FOR_ISSUANCE",
              },
              scope,
            ).length
          }
        />

        <MetricCard
          icon={<AlertCircle size={18} />}
          label="Blocking validation issues"
          value={blockingIssueCount}
          warning
        />

        <MetricCard
          icon={<CheckCircle2 size={18} />}
          label="Issued"
          value={
            getFilteredNotificationIssuanceRecords(
              {
                stage: "ISSUED",
              },
              scope,
            ).length
          }
        />
      </section>

      <section className="issuance-filter-bar">
        <label className="issuance-search">
          <Search size={16} />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value,
              )
            }
            placeholder="Search notification, reference or officer"
            aria-label="Search notification issuance workflows"
          />
        </label>

        <select
          value={stageFilter}
          onChange={(event) =>
            setStageFilter(
              event.target
                .value as
                | NotificationIssuanceStage
                | "ALL",
            )
          }
          aria-label="Filter by issuance stage"
        >
          <option value="ALL">
            All stages
          </option>

          <option value="VALIDATION_REQUIRED">
            Validation Required
          </option>

          <option value="VALIDATION_IN_PROGRESS">
            Validation In Progress
          </option>

          <option value="READY_FOR_ISSUANCE">
            Ready for Issuance
          </option>

          <option value="ISSUANCE_IN_PROGRESS">
            Issuance In Progress
          </option>

          <option value="ISSUED">
            Issued
          </option>

          <option value="ISSUANCE_FAILED">
            Issuance Failed
          </option>

          <option value="REJECTED">
            Rejected
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>
        </select>

        <select
          value={validationFilter}
          onChange={(event) =>
            setValidationFilter(
              event.target
                .value as
                | NotificationValidationStatus
                | "ALL",
            )
          }
          aria-label="Filter by validation status"
        >
          <option value="ALL">
            All validation
          </option>

          <option value="NOT_STARTED">
            Not Started
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="PASSED">
            Passed
          </option>

          <option value="PASSED_WITH_WARNINGS">
            Passed with Warnings
          </option>

          <option value="FAILED">
            Failed
          </option>
        </select>

        <span className="issuance-result-count">
          {records.length} workflow
          {records.length === 1
            ? ""
            : "s"}
        </span>
      </section>

      <section className="issuance-content-grid">
        <div className="issuance-list-panel">
          <div className="issuance-list-header">
            <div>
              <span className="issuance-section-label">
                ISSUANCE QUEUE
              </span>

              <h2>
                Notification workflows
              </h2>
            </div>

            <span className="issuance-list-count">
              {records.length}
            </span>
          </div>

          <div className="issuance-list">
            {records.length === 0 ? (
              <EmptyState />
            ) : (
              records.map((record) => (
                <IssuanceListItem
                  key={record.id}
                  record={record}
                  selected={
                    selectedRecord?.id ===
                    record.id
                  }
                  onSelect={() =>
                    setSelectedId(
                      record.id,
                    )
                  }
                />
              ))
            )}
          </div>
        </div>

        <div className="issuance-detail-panel">
          {selectedRecord ? (
            <IssuanceDetail
              record={selectedRecord}
              validation={validation}
              user={user}
              onActionComplete={
                handleActionComplete
              }
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      <div className="issuance-demo-note">
        <Info size={15} />

        <span>
          Issuance actions shown in this
          demonstration environment do not
          issue real government notices.
          Production issuance must be enforced
          by authorized backend services and
          connected official communication
          providers.
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   METRIC CARD
   ========================================================= */

function MetricCard({
  icon,
  label,
  value,
  warning = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  warning?: boolean;
}) {
  return (
    <div
      className={`issuance-metric-card ${
        warning
          ? "issuance-metric-warning"
          : ""
      }`}
    >
      <div className="issuance-metric-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>

        <strong>{value}</strong>
      </div>
    </div>
  );
}

/* =========================================================
   LIST ITEM
   ========================================================= */

function IssuanceListItem({
  record,
  selected,
  onSelect,
}: {
  record: NotificationIssuanceRecord;
  selected: boolean;
  onSelect: () => void;
}) {
  const validation =
    getNotificationValidationResult(
      record.notificationId,
    );

  const hasBlocking =
    hasBlockingValidationIssues(
      record.notificationId,
    );

  const hasWarning =
    hasValidationWarnings(
      record.notificationId,
    );

  return (
    <button
      type="button"
      className={`issuance-list-item ${
        selected
          ? "is-selected"
          : ""
      }`}
      onClick={onSelect}
    >
      <div className="issuance-list-item-top">
        <span
          className={`issuance-stage-dot issuance-stage-${record.stage.toLowerCase()}`}
        />

        <span className="issuance-reference">
          {record.notificationReference}
        </span>

        <StageBadge
          stage={record.stage}
        />
      </div>

      <strong>
        {getNotificationIssuanceStageLabel(
          record.stage,
        )}
      </strong>

      <p>
        {validation?.summary ??
          "Validation record available for review."}
      </p>

      <div className="issuance-list-meta">
        <span>
          <FileCheck2 size={12} />

          {getNotificationValidationStatusLabel(
            record.validationStatus,
          )}
        </span>

        {hasBlocking && (
          <span className="issuance-meta-danger">
            <AlertCircle size={12} />

            Blocking issue
          </span>
        )}

        {!hasBlocking &&
          hasWarning && (
            <span className="issuance-meta-warning">
              <FileWarning size={12} />

              Warning
            </span>
          )}

        <span>
          <History size={12} />

          {record.actionHistory.length} action
          {record.actionHistory.length ===
          1
            ? ""
            : "s"}
        </span>
      </div>
    </button>
  );
}

/* =========================================================
   STAGE BADGE
   ========================================================= */

function StageBadge({
  stage,
}: {
  stage: NotificationIssuanceStage;
}) {
  return (
    <span
      className={`issuance-stage-badge issuance-stage-badge-${stage.toLowerCase()}`}
    >
      {getNotificationIssuanceStageLabel(
        stage,
      )}
    </span>
  );
}

/* =========================================================
   DETAIL
   ========================================================= */

function IssuanceDetail({
  record,
  validation,
  user,
  onActionComplete,
}: {
  record: NotificationIssuanceRecord;
  validation:
    | ReturnType<
        typeof getNotificationValidationResult
      >
    | undefined;
  user: ReturnType<
    typeof useAuth
  >["user"];
  onActionComplete: () => void;
}) {
  return (
    <>
      <div className="issuance-detail-header">
        <div>
          <span className="issuance-section-label">
            WORKFLOW DETAIL
          </span>

          <h2>
            {record.notificationReference}
          </h2>

          <span className="issuance-detail-id">
            {record.id}
          </span>
        </div>

        <StageBadge
          stage={record.stage}
        />
      </div>

      <OfficerActionPanel
        record={record}
        validation={validation}
        user={user}
        onActionComplete={
          onActionComplete
        }
      />

      <div
        className={`issuance-validation-banner ${
          validation?.passed
            ? "is-passed"
            : validation?.status ===
                "FAILED"
              ? "is-failed"
              : "is-progress"
        }`}
      >
        {validation?.passed ? (
          <CheckCircle2 size={18} />
        ) : validation?.status ===
          "FAILED" ? (
          <XCircle size={18} />
        ) : (
          <Clock3 size={18} />
        )}

        <div>
          <strong>
            {validation
              ? getNotificationValidationStatusLabel(
                  validation.status,
                )
              : "Validation not started"}
          </strong>

          <p>
            {validation?.summary ??
              "This notification has not yet entered validation."}
          </p>
        </div>
      </div>

      <section className="issuance-detail-section">
        <div className="issuance-section-heading">
          <div>
            <span className="issuance-section-label">
              PRE-ISSUANCE CHECKS
            </span>

            <h3>
              Validation findings
            </h3>
          </div>

          <span className="issuance-finding-count">
            {validation?.findings.length ??
              0}
          </span>
        </div>

        {validation &&
        validation.findings.length > 0 ? (
          <div className="issuance-findings">
            {validation.findings.map(
              (finding) => (
                <div
                  className={`issuance-finding issuance-finding-${finding.severity.toLowerCase()}`}
                  key={finding.id}
                >
                  <FindingIcon
                    severity={
                      finding.severity
                    }
                  />

                  <div>
                    <strong>
                      {finding.title}
                    </strong>

                    <p>
                      {finding.message}
                    </p>

                    <span>
                      {finding.resolved
                        ? "Resolved"
                        : "Unresolved"}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="issuance-no-findings">
            <CheckCircle2 size={16} />

            <span>
              No validation findings
              recorded.
            </span>
          </div>
        )}
      </section>

      <section className="issuance-detail-section">
        <div className="issuance-section-heading">
          <div>
            <span className="issuance-section-label">
              WORKFLOW
            </span>

            <h3>
              Issuance lifecycle
            </h3>
          </div>
        </div>

        <div className="issuance-timeline">
          <TimelineStep
            label="Created"
            date={record.createdAt}
            completed
          />

          <TimelineConnector />

          <TimelineStep
            label="Validation"
            date={
              record.validationResultId
                ? "Validation record available"
                : undefined
            }
            completed={
              Boolean(
                record.validationResultId,
              )
            }
            current={
              record.stage ===
                "VALIDATION_REQUIRED" ||
              record.stage ===
                "VALIDATION_IN_PROGRESS"
            }
          />

          <TimelineConnector />

          <TimelineStep
            label="Ready for issuance"
            date={
              record.readyForIssuanceAt ??
              undefined
            }
            completed={Boolean(
              record.readyForIssuanceAt,
            )}
            current={
              record.stage ===
              "READY_FOR_ISSUANCE"
            }
          />

          <TimelineConnector />

          <TimelineStep
            label="Officially issued"
            date={
              record.issuedAt ??
              undefined
            }
            completed={Boolean(
              record.issuedAt,
            )}
            current={
              record.stage === "ISSUED"
            }
          />
        </div>
      </section>

      <section className="issuance-detail-section">
        <div className="issuance-section-heading">
          <div>
            <span className="issuance-section-label">
              RECORD DETAILS
            </span>

            <h3>
              Issuance information
            </h3>
          </div>
        </div>

        <div className="issuance-detail-grid">
          <DetailField
            label="Notification"
            value={
              record.notificationId
            }
          />

          <DetailField
            label="Workflow"
            value={record.id}
          />

          <DetailField
            label="Validation"
            value={
              record.validationStatus
            }
          />

          <DetailField
            label="Issuance reference"
            value={
              record.issuanceReference ??
              "Not issued"
            }
          />

          <DetailField
            label="Issuer"
            value={
              record.issuer?.name ??
              "Not assigned"
            }
          />

          <DetailField
            label="Last updated"
            value={formatDate(
              record.updatedAt,
            )}
          />
        </div>
      </section>

      <section className="issuance-detail-section">
        <div className="issuance-section-heading">
          <div>
            <span className="issuance-section-label">
              AUDIT TRAIL
            </span>

            <h3>
              Workflow actions
            </h3>
          </div>

          <History size={16} />
        </div>

        {record.actionHistory.length >
        0 ? (
          <div className="issuance-action-history">
            {record.actionHistory.map(
              (action) => (
                <div
                  className="issuance-action-row"
                  key={action.id}
                >
                  <div className="issuance-action-icon">
                    <History
                      size={14}
                    />
                  </div>

                  <div>
                    <strong>
                      {formatAction(
                        action.action,
                      )}
                    </strong>

                    <span>
                      {action.actor.name} ·{" "}
                      {formatDate(
                        action.performedAt,
                      )}
                    </span>

                    {action.reason && (
                      <p>
                        {action.reason}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="issuance-no-history">
            <Clock3 size={15} />

            <span>
              No workflow actions have
              been recorded yet.
            </span>
          </div>
        )}
      </section>

      <div className="issuance-safeguard">
        <ShieldCheck size={16} />

        <div>
          <strong>
            Controlled issuance safeguard
          </strong>

          <p>
            Notifications with unresolved
            blocking validation findings must
            not be issued. Final authorization
            must be enforced by the backend and
            recorded in the audit trail.
          </p>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   OFFICER ACTION PANEL
   ========================================================= */

function OfficerActionPanel({
  record,
  validation,
  user,
  onActionComplete,
}: {
  record: NotificationIssuanceRecord;
  validation:
    | ReturnType<
        typeof getNotificationValidationResult
      >
    | undefined;
  user: ReturnType<
    typeof useAuth
  >["user"];
  onActionComplete: () => void;
}) {
  const [isBusy, setIsBusy] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [confirmation, setConfirmation] =
    useState<{
      type:
        | "ISSUE"
        | "REJECT"
        | "CANCEL";
      title: string;
      description: string;
      requiresReason: boolean;
    } | null>(null);

  const [reason, setReason] =
    useState("");

  const actor = useMemo<
    NotificationIssuanceActor | null
  >(() => {
    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      name: user.name,
      designation: user.designation,
      department: user.department,
      role: user.role,
      organization: user.organization,
      jurisdiction: user.jurisdiction,
      jurisdictionType:
        user.jurisdictionType,
    };
  }, [user]);

  const openConfirmation = (
    type:
      | "ISSUE"
      | "REJECT"
      | "CANCEL",
  ) => {
    setError(null);
    setReason("");

    if (type === "ISSUE") {
      setConfirmation({
        type,
        title:
          "Issue this notification?",
        description:
          "This will move the notification into the controlled issuance workflow. Confirm only after reviewing the validation result and notification references.",
        requiresReason: false,
      });

      return;
    }

    if (type === "REJECT") {
      setConfirmation({
        type,
        title:
          "Reject this notification?",
        description:
          "Rejection stops the notification from proceeding to issuance. A reason is required and will be recorded in the workflow history.",
        requiresReason: true,
      });

      return;
    }

    setConfirmation({
      type,
      title:
        "Cancel this notification?",
      description:
        "Cancellation stops this notification workflow. A reason is required and will be recorded for auditability.",
      requiresReason: true,
    });
  };

  const closeConfirmation = () => {
    if (isBusy) {
      return;
    }

    setConfirmation(null);
    setReason("");
    setError(null);
  };

  const executeAction = async () => {
    if (!actor) {
      setError(
        "No authenticated government user is available.",
      );

      return;
    }

    if (!confirmation) {
      setError(
        "No workflow action has been selected.",
      );

      return;
    }

    if (
      confirmation.requiresReason &&
      !reason.trim()
    ) {
      setError(
        "Please provide a reason before continuing.",
      );

      return;
    }

    setIsBusy(true);
    setError(null);

    try {
      let result;

      if (
        confirmation.type ===
        "ISSUE"
      ) {
        result =
          executeIssueNotification(
            record.id,
            {
              actor,
            },
          );
      } else if (
        confirmation.type ===
        "REJECT"
      ) {
        const rejectionReason =
          "OTHER" as NotificationRejectionReason;

        result =
          executeRejectNotification(
            record.id,
            rejectionReason,
            {
              actor,
            },
          );
      } else {
        const cancellationReason =
          "OTHER" as NotificationCancellationReason;

        result =
          executeCancelNotification(
            record.id,
            cancellationReason,
            {
              actor,
            },
          );
      }

      if (!result?.success) {
        setError(
          result?.message ??
            "The requested action could not be completed.",
        );

        return;
      }

      setConfirmation(null);
      setReason("");

      onActionComplete();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "The requested action could not be completed.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const startValidation = () => {
    if (!actor) {
      setError(
        "No authenticated government user is available.",
      );

      return;
    }

    setIsBusy(true);
    setError(null);

    try {
      const result =
        executeStartNotificationValidation(
          record.id,
          {
            actor,
          },
        );

      if (!result.success) {
        setError(result.message);
        return;
      }

      onActionComplete();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Validation could not be started.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const completeValidation = () => {
    if (!actor) {
      setError(
        "No authenticated government user is available.",
      );

      return;
    }

    setIsBusy(true);
    setError(null);

    try {
      const result =
        executeCompleteNotificationValidation(
          record.id,
          {
            actor,
          },
        );

      if (!result.success) {
        setError(result.message);
        return;
      }

      onActionComplete();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Validation could not be completed.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const markReady = () => {
    if (!actor) {
      setError(
        "No authenticated government user is available.",
      );

      return;
    }

    setIsBusy(true);
    setError(null);

    try {
      const result =
        executeMarkNotificationReady(
          record.id,
          {
            actor,
          },
        );

      if (!result.success) {
        setError(result.message);
        return;
      }

      onActionComplete();
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Notification could not be marked ready.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  const canIssue =
    record.stage ===
      "READY_FOR_ISSUANCE" &&
    Boolean(validation?.passed);

  const canReject =
    record.stage === "DRAFT" ||
    record.stage ===
      "VALIDATION_REQUIRED" ||
    record.stage ===
      "VALIDATION_IN_PROGRESS" ||
    record.stage ===
      "READY_FOR_ISSUANCE";

  const canCancel =
    record.stage !== "ISSUED" &&
    record.stage !== "CANCELLED";

  const panelStyle: React.CSSProperties =
    {
      marginBottom: "20px",
      padding: "18px",
      border: "1px solid #dbe3ea",
      borderRadius: "14px",
      background:
        "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      boxShadow:
        "0 8px 24px rgba(15, 23, 42, 0.06)",
    };

  const buttonBaseStyle: React.CSSProperties =
    {
      border: "1px solid #cbd5e1",
      borderRadius: "9px",
      padding: "9px 13px",
      fontSize: "13px",
      fontWeight: 700,
      cursor: isBusy
        ? "not-allowed"
        : "pointer",
      background: "#ffffff",
      color: "#0f172a",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "7px",
      minHeight: "38px",
      opacity: isBusy ? 0.65 : 1,
    };

  const primaryButtonStyle: React.CSSProperties =
    {
      ...buttonBaseStyle,
      background: "#0f766e",
      borderColor: "#0f766e",
      color: "#ffffff",
    };

  const dangerButtonStyle: React.CSSProperties =
    {
      ...buttonBaseStyle,
      color: "#b42318",
      borderColor: "#f1b8b3",
      background: "#fffafa",
    };

  return (
    <section
      style={panelStyle}
      aria-label="Officer workflow actions"
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "14px",
        }}
      >
        <div>
          <span className="issuance-section-label">
            OFFICER ACTIONS
          </span>

          <h3
            style={{
              margin:
                "5px 0 4px",
            }}
          >
            Controlled workflow
          </h3>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#64748b",
              lineHeight: 1.55,
            }}
          >
            Actions are evaluated through
            the notification issuance workflow
            service and recorded in the
            workflow history.
          </p>
        </div>

        <ShieldCheck
          size={20}
          aria-hidden="true"
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "9px",
        }}
      >
        {record.stage ===
          "VALIDATION_REQUIRED" && (
          <button
            type="button"
            onClick={startValidation}
            disabled={
              isBusy || !actor
            }
            style={primaryButtonStyle}
          >
            <FileCheck2 size={15} />

            {isBusy
              ? "Processing..."
              : "Start Validation"}
          </button>
        )}

        {record.stage ===
          "VALIDATION_IN_PROGRESS" && (
          <>
            <button
              type="button"
              onClick={
                completeValidation
              }
              disabled={
                isBusy || !actor
              }
              style={primaryButtonStyle}
            >
              <CheckCircle2
                size={15}
              />

              {isBusy
                ? "Processing..."
                : "Complete Validation"}
            </button>

            {validation?.passed && (
              <button
                type="button"
                onClick={markReady}
                disabled={
                  isBusy || !actor
                }
                style={buttonBaseStyle}
              >
                <FileCheck2
                  size={15}
                />

                Mark Ready for Issuance
              </button>
            )}
          </>
        )}

        {canIssue && (
          <button
            type="button"
            onClick={() =>
              openConfirmation(
                "ISSUE",
              )
            }
            disabled={
              isBusy || !actor
            }
            style={primaryButtonStyle}
          >
            <Bell size={15} />

            Issue Notification
          </button>
        )}

        {canReject && (
          <button
            type="button"
            onClick={() =>
              openConfirmation(
                "REJECT",
              )
            }
            disabled={
              isBusy || !actor
            }
            style={dangerButtonStyle}
          >
            <XCircle size={15} />

            Reject
          </button>
        )}

        {canCancel && (
          <button
            type="button"
            onClick={() =>
              openConfirmation(
                "CANCEL",
              )
            }
            disabled={
              isBusy || !actor
            }
            style={buttonBaseStyle}
          >
            <XCircle size={15} />

            Cancel
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: "12px",
            padding:
              "10px 12px",
            borderRadius: "9px",
            background: "#fff4f2",
            border:
              "1px solid #f3c3be",
            color: "#9f1c14",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          <strong>
            Action not completed:
          </strong>{" "}
          {error}
        </div>
      )}

      {confirmation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="issuance-confirmation-title"
          style={{
            marginTop: "16px",
            padding: "16px",
            borderRadius: "11px",
            border:
              "1px solid #cbd5e1",
            background:
              "#ffffff",
          }}
        >
          <strong
            id="issuance-confirmation-title"
            style={{
              display:
                "block",
              fontSize:
                "14px",
              marginBottom:
                "6px",
            }}
          >
            {confirmation.title}
          </strong>

          <p
            style={{
              margin:
                "0 0 13px",
              fontSize:
                "13px",
              color:
                "#475569",
              lineHeight:
                1.55,
            }}
          >
            {
              confirmation.description
            }
          </p>

          {confirmation.requiresReason && (
            <label
              style={{
                display:
                  "block",
                marginBottom:
                  "12px",
              }}
            >
              <span
                style={{
                  display:
                    "block",
                  fontSize:
                    "12px",
                  fontWeight:
                    700,
                  color:
                    "#334155",
                  marginBottom:
                    "5px",
                }}
              >
                Reason{" "}
                <span aria-hidden="true">
                  *
                </span>
              </span>

              <textarea
                value={reason}
                onChange={(
                  event,
                ) =>
                  setReason(
                    event.target
                      .value,
                  )
                }
                rows={3}
                maxLength={500}
                placeholder="Enter the reason that should be recorded in the workflow history."
                style={{
                  width:
                    "100%",
                  boxSizing:
                    "border-box",
                  resize:
                    "vertical",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    "8px",
                  padding:
                    "9px 10px",
                  fontFamily:
                    "inherit",
                  fontSize:
                    "13px",
                  outline:
                    "none",
                }}
              />

              <span
                style={{
                  display:
                    "block",
                  marginTop:
                    "4px",
                  fontSize:
                    "11px",
                  color:
                    "#64748b",
                }}
              >
                {reason.length}/500
              </span>
            </label>
          )}

          {error && (
            <div
              role="alert"
              style={{
                marginBottom:
                  "10px",
                fontSize:
                  "12px",
                color:
                  "#9f1c14",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "flex-end",
              gap: "8px",
              flexWrap:
                "wrap",
            }}
          >
            <button
              type="button"
              onClick={
                closeConfirmation
              }
              disabled={
                isBusy
              }
              style={
                buttonBaseStyle
              }
            >
              Back
            </button>

            <button
              type="button"
              onClick={
                executeAction
              }
              disabled={
                isBusy ||
                !actor ||
                (confirmation.requiresReason &&
                  !reason.trim())
              }
              style={
                confirmation.type ===
                "REJECT"
                  ? dangerButtonStyle
                  : primaryButtonStyle
              }
            >
              {isBusy
                ? "Processing..."
                : confirmation.type ===
                    "ISSUE"
                  ? "Confirm Issue"
                  : confirmation.type ===
                      "REJECT"
                    ? "Confirm Rejection"
                    : "Confirm Cancellation"}
            </button>
          </div>
        </div>
      )}

      {!actor && (
        <p
          style={{
            margin:
              "12px 0 0",
            fontSize:
              "12px",
            color:
              "#b42318",
          }}
        >
          Officer actions are unavailable
          because no authenticated government
          user is present.
        </p>
      )}
    </section>
  );
}

/* =========================================================
   FINDING ICON
   ========================================================= */

function FindingIcon({
  severity,
}: {
  severity:
    | "INFO"
    | "WARNING"
    | "ERROR"
    | "CRITICAL";
}) {
  if (severity === "ERROR") {
    return <AlertCircle size={16} />;
  }

  if (severity === "CRITICAL") {
    return <XCircle size={16} />;
  }

  if (severity === "WARNING") {
    return <FileWarning size={16} />;
  }

  return <Info size={16} />;
}

/* =========================================================
   TIMELINE
   ========================================================= */

function TimelineStep({
  label,
  date,
  completed,
  current,
}: {
  label: string;
  date?: string;
  completed: boolean;
  current?: boolean;
}) {
  return (
    <div
      className={`issuance-timeline-step ${
        completed
          ? "is-completed"
          : ""
      } ${
        current
          ? "is-current"
          : ""
      }`}
    >
      <div className="issuance-timeline-marker">
        {completed ? (
          <CheckCircle2 size={15} />
        ) : (
          <Clock3 size={15} />
        )}
      </div>

      <div>
        <strong>{label}</strong>

        <span>
          {date
            ? typeof date === "string" &&
              date.includes("T")
              ? formatDate(date)
              : date
            : "Pending"}
        </span>
      </div>
    </div>
  );
}

function TimelineConnector() {
  return (
    <div className="issuance-timeline-connector" />
  );
}

/* =========================================================
   DETAIL FIELD
   ========================================================= */

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="issuance-detail-field">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState() {
  return (
    <div className="issuance-empty">
      <FileCheck2 size={30} />

      <strong>
        No issuance workflows found
      </strong>

      <p>
        Try changing the current search or
        filter criteria.
      </p>
    </div>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(value));
}

function formatAction(
  action: string,
): string {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

export default NotificationIssuancePage;