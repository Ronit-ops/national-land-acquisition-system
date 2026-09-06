import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  ClipboardCheck,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { possessionRecords } from "../data/possession";

import type {
  PossessionRecord,
  PossessionStatus,
  PossessionVerificationStatus,
} from "../types/possession";

function possessionStatusLabel(status: PossessionStatus) {
  switch (status) {
    case "READY_FOR_HANDOVER":
      return "Ready for Handover";

    case "HANDOVER_SCHEDULED":
      return "Handover Scheduled";

    case "POSSESSION_COMPLETED":
      return "Possession Completed";

    case "ON_HOLD":
      return "On Hold";

    default:
      return "Not Ready";
  }
}

function verificationLabel(status: PossessionVerificationStatus) {
  switch (status) {
    case "FIELD_VERIFIED":
      return "Field Verified";

    case "FIELD_VERIFICATION_PENDING":
      return "Verification Pending";

    default:
      return "Not Verified";
  }
}

function PossessionStatusBadge({
  status,
}: {
  status: PossessionStatus;
}) {
  const icon =
    status === "POSSESSION_COMPLETED" ? (
      <CheckCircle2 size={13} />
    ) : status === "READY_FOR_HANDOVER" ||
      status === "HANDOVER_SCHEDULED" ? (
      <Clock3 size={13} />
    ) : status === "ON_HOLD" ? (
      <CircleAlert size={13} />
    ) : (
      <Clock3 size={13} />
    );

  return (
    <span
      className={`possession-status possession-status--${status.toLowerCase()}`}
    >
      {icon}
      {possessionStatusLabel(status)}
    </span>
  );
}

function VerificationBadge({
  status,
}: {
  status: PossessionVerificationStatus;
}) {
  const verified = status === "FIELD_VERIFIED";

  return (
    <span
      className={`possession-verification ${
        verified
          ? "possession-verification--verified"
          : "possession-verification--pending"
      }`}
    >
      {verified ? (
        <ShieldCheck size={12} />
      ) : (
        <Clock3 size={12} />
      )}

      {verificationLabel(status)}
    </span>
  );
}

function PossessionPage() {
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] =
    useState<PossessionRecord | null>(null);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return possessionRecords;
    }

    return possessionRecords.filter((record) =>
      [
        record.id,
        record.acquisitionCaseId,
        record.parcelId,
        record.surveyNumber,
        record.recordedRightHolder,
        record.district,
        record.village,
        record.awardStatus,
        record.compensationStatus,
        record.rrStatus,
        record.pendingAction,
        record.blockingReason ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const totalCases = possessionRecords.length;

  const readyCases = possessionRecords.filter(
    (record) =>
      record.possessionStatus === "READY_FOR_HANDOVER",
  ).length;

  const scheduledCases = possessionRecords.filter(
    (record) =>
      record.possessionStatus === "HANDOVER_SCHEDULED",
  ).length;

  const completedCases = possessionRecords.filter(
    (record) =>
      record.possessionStatus === "POSSESSION_COMPLETED",
  ).length;

  const blockedCases = possessionRecords.filter(
    (record) =>
      record.possessionStatus === "ON_HOLD" ||
      record.possessionStatus === "NOT_READY",
  ).length;

  return (
    <div className="possession-page">
      <div className="possession-demo-banner">
        <CircleAlert size={15} aria-hidden="true" />

        <div>
          <strong>Demonstration Data</strong>

          <span>
            Possession and handover records shown here are
            simulated records for the SIH demonstration
            environment.
          </span>
        </div>
      </div>

      <header className="possession-page__header">
        <div>
          <span className="possession-eyebrow">
            LAND HANDOVER MONITORING
          </span>

          <h2>Possession &amp; Handover</h2>

          <p>
            Monitor possession readiness, field verification,
            handover scheduling and completed possession across
            acquisition cases.
          </p>
        </div>
      </header>

      <section
        className="possession-summary"
        aria-label="Possession summary"
      >
        <article className="possession-summary-card">
          <span className="possession-summary-card__icon">
            <ClipboardCheck size={18} />
          </span>

          <div>
            <span>Total Cases</span>
            <strong>{totalCases}</strong>
          </div>
        </article>

        <article className="possession-summary-card">
          <span className="possession-summary-card__icon">
            <Clock3 size={18} />
          </span>

          <div>
            <span>Ready for Handover</span>
            <strong>{readyCases}</strong>
          </div>
        </article>

        <article className="possession-summary-card">
          <span className="possession-summary-card__icon">
            <MapPin size={18} />
          </span>

          <div>
            <span>Handover Scheduled</span>
            <strong>{scheduledCases}</strong>
          </div>
        </article>

        <article className="possession-summary-card">
          <span className="possession-summary-card__icon">
            <CheckCircle2 size={18} />
          </span>

          <div>
            <span>Possession Completed</span>
            <strong>{completedCases}</strong>
          </div>
        </article>

        <article className="possession-summary-card possession-summary-card--warning">
          <span className="possession-summary-card__icon">
            <CircleAlert size={18} />
          </span>

          <div>
            <span>Blocked / Not Ready</span>
            <strong>{blockedCases}</strong>
          </div>
        </article>
      </section>

      <section className="possession-workspace">
        <div className="possession-toolbar">
          <div className="possession-search">
            <Search size={17} aria-hidden="true" />

            <input
              type="search"
              placeholder="Search case, parcel, survey no. or right-holder"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search possession records"
            />
          </div>

          <span className="possession-result-count">
            {filteredRecords.length} records
          </span>
        </div>

        <div className="possession-table-wrap">
          <table className="possession-table">
            <thead>
              <tr>
                <th>Acquisition Case</th>
                <th>Parcel</th>
                <th>Recorded Right-Holder</th>
                <th>Compensation</th>
                <th>R&amp;R</th>
                <th>Field Verification</th>
                <th>Possession Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  tabIndex={0}
                  onClick={() =>
                    setSelectedRecord(record)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();

                      setSelectedRecord(record);
                    }
                  }}
                >
                  <td>
                    <strong>
                      {record.acquisitionCaseId}
                    </strong>

                    <span className="possession-cell-muted">
                      {record.id}
                    </span>
                  </td>

                  <td>
                    <strong>{record.parcelId}</strong>

                    <span className="possession-cell-muted">
                      Survey {record.surveyNumber}
                    </span>
                  </td>

                  <td>
                    <span className="possession-person">
                      <UserRound size={14} />

                      {record.recordedRightHolder}
                    </span>

                    <span className="possession-cell-muted">
                      {record.village}, {record.district}
                    </span>
                  </td>

                  <td>
                    <span className="possession-info-text">
                      {record.compensationStatus}
                    </span>
                  </td>

                  <td>
                    <span className="possession-info-text">
                      {record.rrStatus}
                    </span>
                  </td>

                  <td>
                    <VerificationBadge
                      status={record.verificationStatus}
                    />
                  </td>

                  <td>
                    <PossessionStatusBadge
                      status={record.possessionStatus}
                    />
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="possession-empty">
                      No possession records match your
                      search.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRecord && (
        <div
          className="possession-drawer-backdrop"
          onMouseDown={() =>
            setSelectedRecord(null)
          }
        >
          <aside
            className="possession-drawer"
            aria-label="Possession record details"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="possession-drawer__header">
              <div>
                <span className="possession-eyebrow">
                  POSSESSION CASE DETAILS
                </span>

                <h3>
                  {selectedRecord.acquisitionCaseId}
                </h3>
              </div>

              <button
                type="button"
                className="possession-icon-button"
                onClick={() =>
                  setSelectedRecord(null)
                }
                aria-label="Close possession details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="possession-drawer__body">
              <section className="possession-detail-section">
                <h4>
                  Parcel &amp; Recorded Right-Holder
                </h4>

                <div className="possession-detail-grid">
                  <div>
                    <span>Parcel ID</span>

                    <strong>
                      {selectedRecord.parcelId}
                    </strong>
                  </div>

                  <div>
                    <span>Survey Number</span>

                    <strong>
                      {selectedRecord.surveyNumber}
                    </strong>
                  </div>

                  <div className="possession-detail-grid__wide">
                    <span>
                      Recorded Owner / Right-Holder
                    </span>

                    <strong>
                      {
                        selectedRecord.recordedRightHolder
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Village</span>

                    <strong>
                      {selectedRecord.village}
                    </strong>
                  </div>

                  <div>
                    <span>District</span>

                    <strong>
                      {selectedRecord.district}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="possession-detail-section">
                <h4>Pre-Possession Conditions</h4>

                <div className="possession-condition-list">
                  <div>
                    <span>Award</span>

                    <strong>
                      {selectedRecord.awardStatus}
                    </strong>
                  </div>

                  <div>
                    <span>Compensation</span>

                    <strong>
                      {
                        selectedRecord.compensationStatus
                      }
                    </strong>
                  </div>

                  <div>
                    <span>R&amp;R</span>

                    <strong>
                      {selectedRecord.rrStatus}
                    </strong>
                  </div>

                  <div>
                    <span>Site Verification</span>

                    <VerificationBadge
                      status={
                        selectedRecord.verificationStatus
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="possession-detail-section">
                <h4>Possession Status</h4>

                <div className="possession-status-card">
                  <PossessionStatusBadge
                    status={
                      selectedRecord.possessionStatus
                    }
                  />

                  <p>
                    {selectedRecord.blockingReason ??
                      "No blocking reason recorded."}
                  </p>
                </div>
              </section>

              <section className="possession-detail-section">
                <h4>Handover Timeline</h4>

                <div className="possession-timeline">
                  <div>
                    <span>Possession Notice</span>

                    <strong>
                      {
                        selectedRecord.possessionNoticeDate ??
                        "Not issued"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Scheduled Handover</span>

                    <strong>
                      {
                        selectedRecord.scheduledHandoverDate ??
                        "Not scheduled"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Possession Completed</span>

                    <strong>
                      {
                        selectedRecord.possessionDate ??
                        "Not completed"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Handover Authority</span>

                    <strong>
                      {
                        selectedRecord.handoverAuthority ??
                        "Not assigned"
                      }
                    </strong>
                  </div>
                </div>
              </section>

              <section className="possession-detail-section">
                <h4>Next Action</h4>

                <div className="possession-next-action">
                  <Clock3 size={16} />

                  <div>
                    <span>Pending Action</span>

                    <strong>
                      {selectedRecord.pendingAction}
                    </strong>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default PossessionPage;