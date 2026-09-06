import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  Home,
  Search,
  Users,
  X,
} from "lucide-react";
import { rrRecords } from "../data/rr";
import type {
  RelocationStatus,
  RRRecord,
  RRStatus,
} from "../types/rr";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function rrStatusLabel(status: RRStatus) {
  switch (status) {
    case "ENTITLEMENT_IDENTIFIED":
      return "Entitlement Identified";
    case "UNDER_IMPLEMENTATION":
      return "Under Implementation";
    case "COMPLETED":
      return "Completed";
    case "ON_HOLD":
      return "On Hold";
    default:
      return "Not Started";
  }
}

function StatusBadge({ status }: { status: RRStatus }) {
  return (
    <span
      className={`rr-status rr-status--${status.toLowerCase()}`}
    >
      {status === "COMPLETED" && <CheckCircle2 size={13} />}
      {status === "UNDER_IMPLEMENTATION" && <Clock3 size={13} />}
      {status === "ON_HOLD" && <CircleAlert size={13} />}
      {status === "ENTITLEMENT_IDENTIFIED" && <Users size={13} />}
      {status === "NOT_STARTED" && <Clock3 size={13} />}

      {rrStatusLabel(status)}
    </span>
  );
}

function ProgressBadge({
  status,
}: {
  status: RelocationStatus;
}) {
  const isCompleted = status === "COMPLETED";
  const isInProgress = status === "IN_PROGRESS";
  const isPending = status === "PENDING";
  const isNotRequired = status === "NOT_REQUIRED";

  return (
    <span
      className={`rr-progress-badge ${
        isCompleted
          ? "rr-progress-badge--completed"
          : isInProgress
            ? "rr-progress-badge--progress"
            : "rr-progress-badge--pending"
      }`}
    >
      {isCompleted && <CheckCircle2 size={12} />}
      {isInProgress && <Clock3 size={12} />}
      {isPending && <CircleAlert size={12} />}
      {isNotRequired && <CheckCircle2 size={12} />}

      {isCompleted
        ? "Completed"
        : isInProgress
          ? "In Progress"
          : isPending
            ? "Pending"
            : "Not Required"}
    </span>
  );
}

function RRPage() {
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] =
    useState<RRRecord | null>(null);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return rrRecords;
    }

    return rrRecords.filter((record) =>
      [
        record.id,
        record.acquisitionCaseId,
        record.parcelId,
        record.recordedRightHolder,
        record.rrCategory,
        record.rrPackage,
        record.pendingAction,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const totalCases = rrRecords.length;

  const implementationCases = rrRecords.filter(
    (record) => record.rrStatus === "UNDER_IMPLEMENTATION",
  ).length;

  const onHoldCases = rrRecords.filter(
    (record) => record.rrStatus === "ON_HOLD",
  ).length;

  const completedCases = rrRecords.filter(
    (record) => record.rrStatus === "COMPLETED",
  ).length;

  const totalAssistance = rrRecords.reduce(
    (sum, record) => sum + record.assistanceAmount,
    0,
  );

  return (
    <div className="rr-page">
      <div className="rr-demo-banner">
        <CircleAlert size={15} aria-hidden="true" />

        <div>
          <strong>Demonstration Data</strong>

          <span>
            R&amp;R records and assistance amounts shown here are
            simulated records for the SIH demonstration environment.
          </span>
        </div>
      </div>

      <header className="rr-page__header">
        <div>
          <span className="rr-eyebrow">
            SOCIAL IMPACT MONITORING
          </span>

          <h2>Rehabilitation &amp; Resettlement</h2>

          <p>
            Monitor entitlements, assistance, relocation and
            rehabilitation activities linked to affected land and
            acquisition cases.
          </p>
        </div>
      </header>

      <section
        className="rr-summary"
        aria-label="R&R summary"
      >
        <article className="rr-summary-card">
          <span className="rr-summary-card__icon">
            <Users size={18} />
          </span>

          <div>
            <span>Total R&amp;R Cases</span>
            <strong>{totalCases}</strong>
          </div>
        </article>

        <article className="rr-summary-card">
          <span className="rr-summary-card__icon">
            <Clock3 size={18} />
          </span>

          <div>
            <span>Under Implementation</span>
            <strong>{implementationCases}</strong>
          </div>
        </article>

        <article className="rr-summary-card">
          <span className="rr-summary-card__icon">
            <CircleAlert size={18} />
          </span>

          <div>
            <span>On Hold</span>
            <strong>{onHoldCases}</strong>
          </div>
        </article>

        <article className="rr-summary-card">
          <span className="rr-summary-card__icon">
            <CheckCircle2 size={18} />
          </span>

          <div>
            <span>Completed</span>
            <strong>{completedCases}</strong>
          </div>
        </article>
      </section>

      <section className="rr-assistance-strip">
        <div>
          <span>Total Demonstration Assistance</span>

          <strong>
            {formatCurrency(totalAssistance)}
          </strong>
        </div>

        <span>
          Assistance is displayed for monitoring purposes and does
          not represent an approved legal entitlement calculation.
        </span>
      </section>

      <section className="rr-workspace">
        <div className="rr-toolbar">
          <div className="rr-search">
            <Search size={17} aria-hidden="true" />

            <input
              type="search"
              placeholder="Search case, parcel, right-holder or R&R package"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search R&R records"
            />
          </div>

          <span className="rr-result-count">
            {filteredRecords.length} records
          </span>
        </div>

        <div className="rr-table-wrap">
          <table className="rr-table">
            <thead>
              <tr>
                <th>Acquisition Case</th>
                <th>Parcel</th>
                <th>Recorded Right-Holder</th>
                <th>R&amp;R Category</th>
                <th>Assistance</th>
                <th>Relocation</th>
                <th>Rehabilitation</th>
                <th>Status</th>
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

                    <span className="rr-cell-muted">
                      {record.id}
                    </span>
                  </td>

                  <td>
                    <strong>{record.parcelId}</strong>
                  </td>

                  <td>
                    <strong>
                      {record.recordedRightHolder}
                    </strong>
                  </td>

                  <td>
                    <span className="rr-category">
                      {record.rrCategory}
                    </span>
                  </td>

                  <td>
                    <strong>
                      {formatCurrency(
                        record.assistanceAmount,
                      )}
                    </strong>
                  </td>

                  <td>
                    <ProgressBadge
                      status={record.relocationStatus}
                    />
                  </td>

                  <td>
                    <ProgressBadge
                      status={
                        record.rehabilitationStatus ===
                        "COMPLETED"
                          ? "COMPLETED"
                          : record.rehabilitationStatus ===
                              "IN_PROGRESS"
                            ? "IN_PROGRESS"
                            : "PENDING"
                      }
                    />
                  </td>

                  <td>
                    <StatusBadge
                      status={record.rrStatus}
                    />
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="rr-empty">
                      No R&amp;R records match your search.
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
          className="rr-drawer-backdrop"
          onMouseDown={() =>
            setSelectedRecord(null)
          }
        >
          <aside
            className="rr-drawer"
            aria-label="R&R record details"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="rr-drawer__header">
              <div>
                <span className="rr-eyebrow">
                  R&amp;R CASE DETAILS
                </span>

                <h3>
                  {selectedRecord.acquisitionCaseId}
                </h3>
              </div>

              <button
                type="button"
                className="rr-icon-button"
                onClick={() =>
                  setSelectedRecord(null)
                }
                aria-label="Close R&R details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rr-drawer__body">
              <section className="rr-detail-section">
                <h4>
                  Parcel &amp; Affected Right-Holder
                </h4>

                <div className="rr-detail-grid">
                  <div>
                    <span>Parcel ID</span>
                    <strong>
                      {selectedRecord.parcelId}
                    </strong>
                  </div>

                  <div>
                    <span>R&amp;R Record</span>
                    <strong>
                      {selectedRecord.id}
                    </strong>
                  </div>

                  <div className="rr-detail-grid__wide">
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
                    <span>Affected Families</span>
                    <strong>
                      {
                        selectedRecord.affectedFamilyCount
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Entitlement Status</span>
                    <strong>
                      {
                        selectedRecord.entitlementStatus
                      }
                    </strong>
                  </div>
                </div>
              </section>

              <section className="rr-detail-section">
                <h4>R&amp;R Package</h4>

                <div className="rr-package-card">
                  <div className="rr-package-card__icon">
                    <Home size={18} />
                  </div>

                  <div>
                    <span>Category</span>

                    <strong>
                      {selectedRecord.rrCategory}
                    </strong>

                    <p>
                      {selectedRecord.rrPackage}
                    </p>
                  </div>
                </div>

                <div className="rr-assistance-card">
                  <span>
                    Demonstration Assistance Amount
                  </span>

                  <strong>
                    {formatCurrency(
                      selectedRecord.assistanceAmount,
                    )}
                  </strong>
                </div>
              </section>

              <section className="rr-detail-section">
                <h4>Implementation Progress</h4>

                <div className="rr-progress-list">
                  <div>
                    <span>Entitlement</span>

                    <strong>
                      {
                        selectedRecord.entitlementStatus
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Relocation</span>

                    <ProgressBadge
                      status={
                        selectedRecord.relocationStatus
                      }
                    />
                  </div>

                  <div>
                    <span>Rehabilitation</span>

                    <ProgressBadge
                      status={
                        selectedRecord
                          .rehabilitationStatus ===
                        "COMPLETED"
                          ? "COMPLETED"
                          : selectedRecord
                                .rehabilitationStatus ===
                              "IN_PROGRESS"
                            ? "IN_PROGRESS"
                            : "PENDING"
                      }
                    />
                  </div>

                  <div>
                    <span>
                      Overall R&amp;R Status
                    </span>

                    <StatusBadge
                      status={selectedRecord.rrStatus}
                    />
                  </div>
                </div>
              </section>

              <section className="rr-detail-section">
                <h4>Next Action</h4>

                <div className="rr-next-action">
                  <Clock3 size={16} />

                  <div>
                    <span>Pending Action</span>

                    <strong>
                      {selectedRecord.pendingAction}
                    </strong>

                    {selectedRecord.targetDate && (
                      <small>
                        Target date:{" "}
                        {selectedRecord.targetDate}
                      </small>
                    )}
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

export default RRPage;