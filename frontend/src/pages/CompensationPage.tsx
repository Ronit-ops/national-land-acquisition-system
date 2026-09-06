
import { useMemo, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  CircleAlert,
  Clock3,
  IndianRupee,
  Search,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";
import { compensationRecords } from "../data/compensation";
import type {
  AwardStatus,
  CompensationRecord,
  PaymentStatus,
} from "../types/compensation";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function awardLabel(status: AwardStatus) {
  switch (status) {
    case "PASSED":
      return "Award Passed";
    case "UNDER_PREPARATION":
      return "Under Preparation";
    case "CHALLENGED":
      return "Challenged";
    default:
      return "Not Started";
  }
}

function paymentLabel(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return "Paid";
    case "PARTIALLY_PAID":
      return "Partially Paid";
    case "PENDING":
      return "Pending";
    case "ON_HOLD":
      return "On Hold";
    default:
      return "Not Due";
  }
}

function AwardStatusBadge({ status }: { status: AwardStatus }) {
  return (
    <span className={`compensation-status compensation-status--${status.toLowerCase()}`}>
      {status === "PASSED" && <CheckCircle2 size={13} />}
      {status === "UNDER_PREPARATION" && <Clock3 size={13} />}
      {status === "CHALLENGED" && <ShieldAlert size={13} />}
      {awardLabel(status)}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`compensation-status compensation-status--${status.toLowerCase()}`}>
      {status === "PAID" && <CheckCircle2 size={13} />}
      {status === "PARTIALLY_PAID" && <Clock3 size={13} />}
      {status === "ON_HOLD" && <CircleAlert size={13} />}
      {status === "PENDING" && <Clock3 size={13} />}
      {status === "NOT_DUE" && <Clock3 size={13} />}
      {paymentLabel(status)}
    </span>
  );
}

function CompensationPage() {
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] =
    useState<CompensationRecord | null>(null);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return compensationRecords;
    }

    return compensationRecords.filter((record) =>
      [
        record.id,
        record.acquisitionCaseId,
        record.parcelId,
        record.surveyNumber,
        record.recordedRightHolder,
        record.district,
        record.village,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const totalAward = compensationRecords.reduce(
    (sum, record) => sum + record.awardAmount,
    0,
  );

  const totalPending = compensationRecords.reduce(
    (sum, record) => sum + record.pendingAmount,
    0,
  );

  const awardsPassed = compensationRecords.filter(
    (record) => record.awardStatus === "PASSED",
  ).length;

  const paymentsCompleted = compensationRecords.filter(
    (record) => record.paymentStatus === "PAID",
  ).length;

  return (
    <div className="compensation-page">
      <div className="compensation-demo-banner">
        <CircleAlert size={15} aria-hidden="true" />
        <div>
          <strong>Demonstration Data</strong>
          <span>
            Compensation, award and payment figures shown here are simulated
            records for the SIH demonstration environment.
          </span>
        </div>
      </div>

      <header className="compensation-page__header">
        <div>
          <span className="compensation-eyebrow">ACQUISITION FINANCIALS</span>
          <h2>Compensation &amp; Award</h2>
          <p>
            Monitor awards, compensation obligations and payment progress
            linked to acquisition cases.
          </p>
        </div>
      </header>

      <section className="compensation-summary" aria-label="Compensation summary">
        <article className="compensation-summary-card">
          <span className="compensation-summary-card__icon">
            <Banknote size={18} />
          </span>
          <div>
            <span>Total Award Value</span>
            <strong>{formatCurrency(totalAward)}</strong>
          </div>
        </article>

        <article className="compensation-summary-card">
          <span className="compensation-summary-card__icon">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <span>Awards Passed</span>
            <strong>{awardsPassed}</strong>
          </div>
        </article>

        <article className="compensation-summary-card">
          <span className="compensation-summary-card__icon">
            <IndianRupee size={18} />
          </span>
          <div>
            <span>Amount Pending</span>
            <strong>{formatCurrency(totalPending)}</strong>
          </div>
        </article>

        <article className="compensation-summary-card">
          <span className="compensation-summary-card__icon">
            <Clock3 size={18} />
          </span>
          <div>
            <span>Payments Completed</span>
            <strong>
              {paymentsCompleted}/{compensationRecords.length}
            </strong>
          </div>
        </article>
      </section>

      <section className="compensation-workspace">
        <div className="compensation-toolbar">
          <div className="compensation-search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search case, parcel, survey no. or right-holder"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search compensation records"
            />
          </div>

          <span className="compensation-result-count">
            {filteredRecords.length} records
          </span>
        </div>

        <div className="compensation-table-wrap">
          <table className="compensation-table">
            <thead>
              <tr>
                <th>Acquisition Case</th>
                <th>Parcel</th>
                <th>Recorded Right-Holder</th>
                <th>Award</th>
                <th>Compensation</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  tabIndex={0}
                  onClick={() => setSelectedRecord(record)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedRecord(record);
                    }
                  }}
                >
                  <td>
                    <strong>{record.acquisitionCaseId}</strong>
                    <span className="compensation-cell-muted">
                      {record.id}
                    </span>
                  </td>

                  <td>
                    <strong>{record.parcelId}</strong>
                    <span className="compensation-cell-muted">
                      Survey {record.surveyNumber}
                    </span>
                  </td>

                  <td>
                    <span className="compensation-person">
                      <UserRound size={14} />
                      {record.recordedRightHolder}
                    </span>
                    <span className="compensation-cell-muted">
                      {record.village}, {record.district}
                    </span>
                  </td>

                  <td>
                    <strong>{formatCurrency(record.awardAmount)}</strong>
                    <span className="compensation-cell-muted">
                      Valuation {formatCurrency(record.valuationAmount)}
                    </span>
                  </td>

                  <td>
                    <strong>{formatCurrency(record.compensationAmount)}</strong>
                    <span className="compensation-cell-muted">
                      Pending {formatCurrency(record.pendingAmount)}
                    </span>
                  </td>

                  <td>
                    <PaymentStatusBadge status={record.paymentStatus} />
                  </td>

                  <td>
                    <AwardStatusBadge status={record.awardStatus} />
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="compensation-empty">
                      No compensation records match your search.
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
          className="compensation-drawer-backdrop"
          onMouseDown={() => setSelectedRecord(null)}
        >
          <aside
            className="compensation-drawer"
            aria-label="Compensation record details"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="compensation-drawer__header">
              <div>
                <span className="compensation-eyebrow">CASE DETAILS</span>
                <h3>{selectedRecord.acquisitionCaseId}</h3>
              </div>

              <button
                type="button"
                className="compensation-icon-button"
                onClick={() => setSelectedRecord(null)}
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="compensation-drawer__body">
              <section className="compensation-detail-section">
                <h4>Parcel &amp; Right-Holder</h4>

                <div className="compensation-detail-grid">
                  <div>
                    <span>Parcel ID</span>
                    <strong>{selectedRecord.parcelId}</strong>
                  </div>

                  <div>
                    <span>Survey Number</span>
                    <strong>{selectedRecord.surveyNumber}</strong>
                  </div>

                  <div className="compensation-detail-grid__wide">
                    <span>Recorded Owner / Right-Holder</span>
                    <strong>{selectedRecord.recordedRightHolder}</strong>
                  </div>

                  <div>
                    <span>Village</span>
                    <strong>{selectedRecord.village}</strong>
                  </div>

                  <div>
                    <span>District</span>
                    <strong>{selectedRecord.district}</strong>
                  </div>
                </div>
              </section>

              <section className="compensation-detail-section">
                <h4>Award</h4>

                <div className="compensation-amount-card">
                  <span>Award Amount</span>
                  <strong>{formatCurrency(selectedRecord.awardAmount)}</strong>
                </div>

                <div className="compensation-detail-grid">
                  <div>
                    <span>Valuation</span>
                    <strong>
                      {formatCurrency(selectedRecord.valuationAmount)}
                    </strong>
                  </div>

                  <div>
                    <span>Award Status</span>
                    <AwardStatusBadge status={selectedRecord.awardStatus} />
                  </div>

                  <div>
                    <span>Award Date</span>
                    <strong>{selectedRecord.awardDate ?? "Not available"}</strong>
                  </div>
                </div>
              </section>

              <section className="compensation-detail-section">
                <h4>Compensation &amp; Payment</h4>

                <div className="compensation-payment-progress">
                  <div className="compensation-payment-progress__labels">
                    <span>Payment progress</span>
                    <strong>
                      {formatCurrency(selectedRecord.paidAmount)} paid
                    </strong>
                  </div>

                  <div className="compensation-progress-track">
                    <span
                      style={{
                        width: `${
                          selectedRecord.compensationAmount > 0
                            ? Math.min(
                                (selectedRecord.paidAmount /
                                  selectedRecord.compensationAmount) *
                                  100,
                                100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="compensation-detail-grid">
                  <div>
                    <span>Total Compensation</span>
                    <strong>
                      {formatCurrency(selectedRecord.compensationAmount)}
                    </strong>
                  </div>

                  <div>
                    <span>Amount Paid</span>
                    <strong>
                      {formatCurrency(selectedRecord.paidAmount)}
                    </strong>
                  </div>

                  <div>
                    <span>Amount Pending</span>
                    <strong>
                      {formatCurrency(selectedRecord.pendingAmount)}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Status</span>
                    <PaymentStatusBadge
                      status={selectedRecord.paymentStatus}
                    />
                  </div>

                  <div>
                    <span>Payment Date</span>
                    <strong>
                      {selectedRecord.paymentDate ?? "Not completed"}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="compensation-detail-section">
                <h4>Downstream Readiness</h4>

                <div className="compensation-readiness-list">
                  <div>
                    <span>R&amp;R Linked</span>
                    <strong>
                      {selectedRecord.rrLinked ? "Yes" : "No"}
                    </strong>
                  </div>

                  <div>
                    <span>Possession Ready</span>
                    <strong>
                      {selectedRecord.possessionReady ? "Yes" : "No"}
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

export default CompensationPage;

