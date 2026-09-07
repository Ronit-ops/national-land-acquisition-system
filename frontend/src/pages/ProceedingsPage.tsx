import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Gavel,
  MapPin,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { proceedingsRecords } from "../data/proceedings";
import type {
  HearingStatus,
  NotificationStatus,
  ObjectionStatus,
  ProceedingsPriority,
  ProceedingsRecord,
} from "../types/proceedings";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

function priorityClass(priority: ProceedingsPriority) {
  return `proceedings-priority proceedings-priority--${priority.toLowerCase()}`;
}

function notificationClass(status: NotificationStatus) {
  return `proceedings-status proceedings-status--${status.toLowerCase()}`;
}

function objectionClass(status: ObjectionStatus) {
  return `proceedings-status proceedings-status--${status.toLowerCase()}`;
}

function hearingClass(status: HearingStatus) {
  return `proceedings-status proceedings-status--${status.toLowerCase()}`;
}

function ProceedingsPage() {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    ProceedingsPriority | "ALL"
  >("ALL");
  const [objectionFilter, setObjectionFilter] = useState<
    ObjectionStatus | "ALL"
  >("ALL");
  const [hearingFilter, setHearingFilter] = useState<
    HearingStatus | "ALL"
  >("ALL");
  const [selectedRecord, setSelectedRecord] =
    useState<ProceedingsRecord | null>(null);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return proceedingsRecords.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          record.id,
          record.acquisitionCaseId,
          record.parcelId,
          record.surveyNumber,
          record.recordedRightHolder,
          record.district,
          record.village,
          record.nextAction,
          record.notification.title,
          record.objection.objectorName ?? "",
          record.objection.category ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesPriority =
        priorityFilter === "ALL" || record.priority === priorityFilter;

      const matchesObjection =
        objectionFilter === "ALL" ||
        record.objection.status === objectionFilter;

      const matchesHearing =
        hearingFilter === "ALL" ||
        record.hearing.status === hearingFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesObjection &&
        matchesHearing
      );
    });
  }, [search, priorityFilter, objectionFilter, hearingFilter]);

  const summary = useMemo(() => {
    return {
      total: proceedingsRecords.length,
      objections: proceedingsRecords.filter(
        (record) =>
          record.objection.status !== "NOT_RECEIVED" &&
          record.objection.status !== "DISPOSED",
      ).length,
      hearings: proceedingsRecords.filter(
        (record) =>
          record.hearing.status === "SCHEDULED" ||
          record.hearing.status === "ADJOURNED",
      ).length,
      highPriority: proceedingsRecords.filter(
        (record) =>
          record.priority === "HIGH" || record.priority === "CRITICAL",
      ).length,
    };
  }, []);

  return (
    <div className="proceedings-page">
      <div className="proceedings-demo-banner">
        <AlertTriangle size={15} aria-hidden="true" />

        <div>
          <strong>Demonstration Environment</strong>
          <span>
            Proceedings shown here use simulated records. They do not
            represent live legal or government records.
          </span>
        </div>
      </div>

      <section className="proceedings-header">
        <div>
          <span className="application-welcome__eyebrow">
            LEGAL & PROCEDURAL WORKFLOW
          </span>

          <h2>Notifications, Objections & Hearings</h2>

          <p>
            Track procedural events linked to acquisition cases, parcels and
            recorded right-holder information through a structured review
            workflow.
          </p>
        </div>
      </section>

      <section className="proceedings-summary-grid">
        <article className="proceedings-summary-card">
          <span className="proceedings-summary-card__icon">
            <FileText size={18} />
          </span>

          <div>
            <span>Total proceedings</span>
            <strong>{summary.total}</strong>
            <small>Tracked records</small>
          </div>
        </article>

        <article className="proceedings-summary-card">
          <span className="proceedings-summary-card__icon">
            <ClipboardCheck size={18} />
          </span>

          <div>
            <span>Active objections</span>
            <strong>{summary.objections}</strong>
            <small>Require procedural attention</small>
          </div>
        </article>

        <article className="proceedings-summary-card">
          <span className="proceedings-summary-card__icon">
            <CalendarDays size={18} />
          </span>

          <div>
            <span>Upcoming hearings</span>
            <strong>{summary.hearings}</strong>
            <small>Scheduled / adjourned</small>
          </div>
        </article>

        <article className="proceedings-summary-card">
          <span className="proceedings-summary-card__icon proceedings-summary-card__icon--alert">
            <AlertTriangle size={18} />
          </span>

          <div>
            <span>High priority</span>
            <strong>{summary.highPriority}</strong>
            <small>High or critical proceedings</small>
          </div>
        </article>
      </section>

      <section className="proceedings-toolbar">
        <div className="proceedings-search">
          <Search size={16} aria-hidden="true" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search case, parcel, right-holder, district..."
            aria-label="Search proceedings"
          />
        </div>

        <div className="proceedings-filters">
          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(
                event.target.value as ProceedingsPriority | "ALL",
              )
            }
            aria-label="Filter by priority"
          >
            <option value="ALL">All priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={objectionFilter}
            onChange={(event) =>
              setObjectionFilter(
                event.target.value as ObjectionStatus | "ALL",
              )
            }
            aria-label="Filter by objection status"
          >
            <option value="ALL">All objections</option>
            <option value="RECEIVED">Received</option>
            <option value="UNDER_SCRUTINY">Under scrutiny</option>
            <option value="HEARING_SCHEDULED">
              Hearing scheduled
            </option>
            <option value="HEARD">Heard</option>
            <option value="PENDING_ACTION">Pending action</option>
            <option value="DISPOSED">Disposed</option>
          </select>

          <select
            value={hearingFilter}
            onChange={(event) =>
              setHearingFilter(
                event.target.value as HearingStatus | "ALL",
              )
            }
            aria-label="Filter by hearing status"
          >
            <option value="ALL">All hearings</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="ADJOURNED">Adjourned</option>
            <option value="NOT_SCHEDULED">Not scheduled</option>
          </select>
        </div>
      </section>

      <section className="proceedings-table-card">
        <div className="proceedings-table-card__header">
          <div>
            <span className="proceedings-table-card__eyebrow">
              PROCEDURAL REGISTER
            </span>

            <h3>Proceeding records</h3>
          </div>

          <span className="proceedings-result-count">
            {filteredRecords.length} records
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="proceedings-empty">
            <Search size={22} />

            <h3>No proceedings found</h3>

            <p>
              Try changing the search term or one of the active filters.
            </p>
          </div>
        ) : (
          <div className="proceedings-table-wrapper">
            <table className="proceedings-table">
              <thead>
                <tr>
                  <th>Proceeding</th>
                  <th>Parcel / Right-holder</th>
                  <th>Notification</th>
                  <th>Objection</th>
                  <th>Hearing</th>
                  <th>Next action</th>
                  <th>Priority</th>
                  <th aria-label="Open record" />
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="proceedings-primary-cell">
                        <strong>{record.id}</strong>
                        <span>{record.acquisitionCaseId}</span>
                      </div>
                    </td>

                    <td>
                      <div className="proceedings-primary-cell">
                        <strong>{record.parcelId}</strong>
                        <span>
                          Survey {record.surveyNumber} ·{" "}
                          {record.recordedRightHolder}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="proceedings-table-status">
                        <span
                          className={notificationClass(
                            record.notification.status,
                          )}
                        >
                          {label(record.notification.status)}
                        </span>

                        <small>
                          {formatDate(
                            record.notification.publicationDate,
                          )}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div className="proceedings-table-status">
                        <span
                          className={objectionClass(
                            record.objection.status,
                          )}
                        >
                          {label(record.objection.status)}
                        </span>

                        <small>
                          {record.objection.id ?? "No objection"}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div className="proceedings-table-status">
                        <span
                          className={hearingClass(
                            record.hearing.status,
                          )}
                        >
                          {label(record.hearing.status)}
                        </span>

                        <small>
                          {formatDate(record.hearing.hearingDate)}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div className="proceedings-next-action">
                        <strong>{record.nextAction}</strong>

                        {record.nextActionDueDate && (
                          <span>
                            Due {formatDate(record.nextActionDueDate)}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className={priorityClass(record.priority)}>
                        {record.priority}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="proceedings-open-button"
                        onClick={() => setSelectedRecord(record)}
                        aria-label={`Open ${record.id}`}
                      >
                        <ChevronRight size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedRecord && (
        <div
          className="proceedings-drawer-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedRecord(null);
            }
          }}
        >
          <aside
            className="proceedings-drawer"
            aria-label="Proceeding details"
          >
            <div className="proceedings-drawer__header">
              <div>
                <span className="proceedings-table-card__eyebrow">
                  PROCEEDING DETAIL
                </span>

                <h2>{selectedRecord.id}</h2>

                <span>{selectedRecord.acquisitionCaseId}</span>
              </div>

              <button
                type="button"
                className="proceedings-drawer__close"
                onClick={() => setSelectedRecord(null)}
                aria-label="Close proceeding details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="proceedings-drawer__body">
              <section className="proceedings-detail-section">
                <div className="proceedings-detail-section__title">
                  <MapPin size={16} />
                  <h3>Parcel & right-holder</h3>
                </div>

                <div className="proceedings-detail-grid">
                  <div>
                    <span>Parcel ID</span>
                    <strong>{selectedRecord.parcelId}</strong>
                  </div>

                  <div>
                    <span>Survey number</span>
                    <strong>{selectedRecord.surveyNumber}</strong>
                  </div>

                  <div>
                    <span>Recorded right-holder</span>
                    <strong>
                      {selectedRecord.recordedRightHolder}
                    </strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>
                      {selectedRecord.village},{" "}
                      {selectedRecord.district}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="proceedings-detail-section">
                <div className="proceedings-detail-section__title">
                  <FileText size={16} />
                  <h3>Notification</h3>
                </div>

                <div className="proceedings-detail-card">
                  <strong>{selectedRecord.notification.title}</strong>

                  <div className="proceedings-detail-card__meta">
                    <span>
                      Status:{" "}
                      <b>
                        {label(selectedRecord.notification.status)}
                      </b>
                    </span>

                    <span>
                      Publication:{" "}
                      <b>
                        {formatDate(
                          selectedRecord.notification.publicationDate,
                        )}
                      </b>
                    </span>

                    <span>
                      Effective:{" "}
                      <b>
                        {formatDate(
                          selectedRecord.notification.effectiveDate,
                        )}
                      </b>
                    </span>

                    <span>
                      Served:{" "}
                      <b>
                        {formatDate(
                          selectedRecord.notification.serviceDate,
                        )}
                      </b>
                    </span>
                  </div>

                  <small>
                    Document reference:{" "}
                    {selectedRecord.notification.documentReference ??
                      "Not available"}
                  </small>
                </div>
              </section>

              <section className="proceedings-detail-section">
                <div className="proceedings-detail-section__title">
                  <ClipboardCheck size={16} />
                  <h3>Objection</h3>
                </div>

                <div className="proceedings-detail-card">
                  {selectedRecord.objection.id ? (
                    <>
                      <div className="proceedings-detail-card__heading">
                        <strong>
                          {selectedRecord.objection.id}
                        </strong>

                        <span
                          className={objectionClass(
                            selectedRecord.objection.status,
                          )}
                        >
                          {label(selectedRecord.objection.status)}
                        </span>
                      </div>

                      <div className="proceedings-detail-card__meta">
                        <span>
                          Objector:{" "}
                          <b>
                            {selectedRecord.objection.objectorName}
                          </b>
                        </span>

                        <span>
                          Submitted:{" "}
                          <b>
                            {formatDate(
                              selectedRecord.objection.submissionDate,
                            )}
                          </b>
                        </span>

                        <span>
                          Category:{" "}
                          <b>
                            {selectedRecord.objection.category}
                          </b>
                        </span>

                        <span>
                          Supporting documents:{" "}
                          <b>
                            {
                              selectedRecord.objection
                                .supportingDocumentCount
                            }
                          </b>
                        </span>
                      </div>

                      <p>
                        {selectedRecord.objection.description}
                      </p>
                    </>
                  ) : (
                    <div className="proceedings-no-record">
                      <CheckCircle2 size={17} />
                      No objection has been recorded.
                    </div>
                  )}
                </div>
              </section>

              <section className="proceedings-detail-section">
                <div className="proceedings-detail-section__title">
                  <Gavel size={16} />
                  <h3>Hearing</h3>
                </div>

                <div className="proceedings-detail-card">
                  {selectedRecord.hearing.id ? (
                    <>
                      <div className="proceedings-detail-card__heading">
                        <strong>{selectedRecord.hearing.id}</strong>

                        <span
                          className={hearingClass(
                            selectedRecord.hearing.status,
                          )}
                        >
                          {label(selectedRecord.hearing.status)}
                        </span>
                      </div>

                      <div className="proceedings-detail-card__meta">
                        <span>
                          Date:{" "}
                          <b>
                            {formatDate(
                              selectedRecord.hearing.hearingDate,
                            )}
                          </b>
                        </span>

                        <span>
                          Mode:{" "}
                          <b>
                            {selectedRecord.hearing.mode
                              ? label(selectedRecord.hearing.mode)
                              : "—"}
                          </b>
                        </span>

                        <span>
                          Officer:{" "}
                          <b>
                            {selectedRecord.hearing.assignedOfficer ??
                              "—"}
                          </b>
                        </span>

                        <span>
                          Attendance:{" "}
                          <b>
                            {selectedRecord.hearing.attendanceRecorded
                              ? "Recorded"
                              : "Not recorded"}
                          </b>
                        </span>
                      </div>

                      {selectedRecord.hearing.venue && (
                        <div className="proceedings-hearing-venue">
                          <MapPin size={15} />
                          {selectedRecord.hearing.venue}
                        </div>
                      )}

                      {selectedRecord.hearing.proceedingsRemarks && (
                        <p>
                          {selectedRecord.hearing.proceedingsRemarks}
                        </p>
                      )}

                      {selectedRecord.hearing.outcome && (
                        <div className="proceedings-hearing-outcome">
                          <span>Recorded hearing outcome</span>
                          <strong>
                            {label(selectedRecord.hearing.outcome)}
                          </strong>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="proceedings-no-record">
                      <CalendarDays size={17} />
                      No hearing has been scheduled.
                    </div>
                  )}
                </div>
              </section>

              <section className="proceedings-detail-section">
                <div className="proceedings-detail-section__title">
                  <UserRound size={16} />
                  <h3>Officer action</h3>
                </div>

                <div className="proceedings-officer-action">
                  <div>
                    <span>Priority</span>
                    <strong>{selectedRecord.priority}</strong>
                  </div>

                  <div>
                    <span>Next action</span>
                    <strong>{selectedRecord.nextAction}</strong>
                  </div>

                  <div>
                    <span>Due date</span>
                    <strong>
                      {formatDate(
                        selectedRecord.nextActionDueDate,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Legal decision recorded</span>
                    <strong>
                      {selectedRecord.legalDecisionRecorded
                        ? "Yes"
                        : "No"}
                    </strong>
                  </div>
                </div>

                <div className="proceedings-officer-remarks">
                  <span>Officer remarks</span>
                  <p>{selectedRecord.officerRemarks}</p>
                </div>
              </section>

              <div className="proceedings-legal-notice">
                <AlertTriangle size={16} />

                <p>
                  Procedural records shown here are informational
                  demonstration data. Legal validity, objection
                  disposition and hearing outcomes must be determined
                  through authorized government workflows.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default ProceedingsPage;