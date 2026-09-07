import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  FileSearch,
  Filter,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { getAuditEvents } from "../data/audit";
import type { AuditEvent } from "../types/audit";

function formatDateTime(value: string) {
  const date = new Date(value);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function severityClass(severity: AuditEvent["severity"]) {
  return `audit-badge audit-badge--${severity.toLowerCase()}`;
}

function categoryLabel(category: string) {
  return category
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AuditPage() {
  const events = getAuditEvents();

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.id.toLowerCase().includes(query) ||
        event.actorName.toLowerCase().includes(query) ||
        event.module.toLowerCase().includes(query) ||
        event.action.toLowerCase().includes(query) ||
        event.entityId.toLowerCase().includes(query) ||
        event.referenceNumber.toLowerCase().includes(query) ||
        event.summary.toLowerCase().includes(query);

      const matchesSeverity =
        severityFilter === "ALL" || event.severity === severityFilter;

      const matchesCategory =
        categoryFilter === "ALL" || event.category === categoryFilter;

      return matchesSearch && matchesSeverity && matchesCategory;
    });
  }, [events, search, severityFilter, categoryFilter]);

  const highRiskCount = events.filter(
    (event) =>
      event.severity === "HIGH" || event.severity === "CRITICAL",
  ).length;

  const systemEvents = events.filter(
    (event) => event.actorType === "SYSTEM",
  ).length;

  const userEvents = events.filter(
    (event) => event.actorType === "USER",
  ).length;

  const categories = Array.from(
    new Set(events.map((event) => event.category)),
  );

  return (
    <div className="audit-page">
      <section className="audit-page__header">
        <div>
          <div className="audit-page__eyebrow">
            <ShieldCheck size={16} />
            Governance & Traceability
          </div>

          <h1>Audit & Traceability</h1>

          <p>
            Review recorded user and system activity across the National Land
            Acquisition & Management System.
          </p>
        </div>

        <div className="audit-page__header-meta">
          <span className="audit-demo-tag">DEMO DATA</span>
          <span>Read-only operational view</span>
        </div>
      </section>

      <section className="audit-notice">
        <ShieldCheck size={19} />

        <div>
          <strong>Audit records are traceability evidence.</strong>

          <p>
            This frontend workspace demonstrates how audit events will be
            presented. In production, audit events must be generated and
            persisted by the backend under server-side authorization and
            controlled write policies.
          </p>
        </div>
      </section>

      <section className="audit-summary">
        <div className="audit-summary-card">
          <div className="audit-summary-card__icon">
            <FileSearch size={19} />
          </div>

          <div>
            <span>Total events</span>
            <strong>{events.length}</strong>
          </div>
        </div>

        <div className="audit-summary-card">
          <div className="audit-summary-card__icon audit-summary-card__icon--warning">
            <AlertTriangle size={19} />
          </div>

          <div>
            <span>High / critical</span>
            <strong>{highRiskCount}</strong>
          </div>
        </div>

        <div className="audit-summary-card">
          <div className="audit-summary-card__icon audit-summary-card__icon--success">
            <UserRound size={19} />
          </div>

          <div>
            <span>User events</span>
            <strong>{userEvents}</strong>
          </div>
        </div>

        <div className="audit-summary-card">
          <div className="audit-summary-card__icon audit-summary-card__icon--system">
            <Clock3 size={19} />
          </div>

          <div>
            <span>System events</span>
            <strong>{systemEvents}</strong>
          </div>
        </div>
      </section>

      <section className="audit-workspace">
        <div className="audit-toolbar">
          <div className="audit-search">
            <FileSearch size={17} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search event, actor, module, record..."
              aria-label="Search audit events"
            />
          </div>

          <div className="audit-filter">
            <Filter size={16} />

            <select
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
              aria-label="Filter by severity"
            >
              <option value="ALL">All severities</option>
              <option value="INFO">Info</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className="audit-filter">
            <Filter size={16} />

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="ALL">All categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabel(category)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="audit-results-bar">
          <span>
            Showing <strong>{filteredEvents.length}</strong> of{" "}
            <strong>{events.length}</strong> audit events
          </span>

          <span className="audit-results-bar__scope">
            Current demo scope: Maharashtra
          </span>
        </div>

        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Module</th>
                <th>Action</th>
                <th>Affected record</th>
                <th>Category</th>
                <th>Severity</th>
                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="audit-empty">
                      <FileSearch size={28} />
                      <strong>No audit events found</strong>
                      <span>
                        Try changing the search term or filters.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="audit-time">
                        <strong>{formatDateTime(event.timestamp)}</strong>
                        <span>{event.id}</span>
                      </div>
                    </td>

                    <td>
                      <div className="audit-actor">
                        <div className="audit-actor__avatar">
                          {event.actorType === "SYSTEM" ? (
                            <ShieldCheck size={15} />
                          ) : (
                            <UserRound size={15} />
                          )}
                        </div>

                        <div>
                          <strong>{event.actorName}</strong>
                          <span>{event.actorRole}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="audit-module">
                        {event.module.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td>
                      <div className="audit-action">
                        <strong>{event.action.replaceAll("_", " ")}</strong>
                        <span>{event.summary}</span>
                      </div>
                    </td>

                    <td>
                      <div className="audit-record">
                        <strong>{event.entityId}</strong>
                        <span>{event.referenceNumber}</span>
                      </div>
                    </td>

                    <td>
                      <span className="audit-category">
                        {categoryLabel(event.category)}
                      </span>
                    </td>

                    <td>
                      <span className={severityClass(event.severity)}>
                        {event.severity}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="audit-view-button"
                        onClick={() => setSelectedEvent(event)}
                        aria-label={`View audit event ${event.id}`}
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

      {selectedEvent && (
        <div
          className="audit-drawer-backdrop"
          role="presentation"
          onClick={() => setSelectedEvent(null)}
        >
          <aside
            className="audit-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-drawer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="audit-drawer__header">
              <div>
                <span>Audit event</span>
                <h2 id="audit-drawer-title">{selectedEvent.id}</h2>
              </div>

              <button
                type="button"
                className="audit-drawer__close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close audit event"
              >
                <X size={19} />
              </button>
            </div>

            <div className="audit-drawer__body">
              <div className="audit-detail-status">
                <span className={severityClass(selectedEvent.severity)}>
                  {selectedEvent.severity}
                </span>

                <span className="audit-detail-source">
                  {selectedEvent.source.replaceAll("_", " ")}
                </span>
              </div>

              <section className="audit-detail-section">
                <h3>Event summary</h3>

                <div className="audit-detail-summary">
                  <CheckCircle2 size={18} />

                  <p>{selectedEvent.summary}</p>
                </div>
              </section>

              <section className="audit-detail-section">
                <h3>Activity</h3>

                <dl className="audit-detail-grid">
                  <div>
                    <dt>Date & time</dt>
                    <dd>{formatDateTime(selectedEvent.timestamp)}</dd>
                  </div>

                  <div>
                    <dt>Action</dt>
                    <dd>
                      {selectedEvent.action.replaceAll("_", " ")}
                    </dd>
                  </div>

                  <div>
                    <dt>Module</dt>
                    <dd>
                      {selectedEvent.module.replaceAll("_", " ")}
                    </dd>
                  </div>

                  <div>
                    <dt>Category</dt>
                    <dd>{categoryLabel(selectedEvent.category)}</dd>
                  </div>
                </dl>
              </section>

              <section className="audit-detail-section">
                <h3>Actor & authorization context</h3>

                <dl className="audit-detail-grid">
                  <div>
                    <dt>Actor</dt>
                    <dd>{selectedEvent.actorName}</dd>
                  </div>

                  <div>
                    <dt>Actor type</dt>
                    <dd>{selectedEvent.actorType}</dd>
                  </div>

                  <div>
                    <dt>Role</dt>
                    <dd>{selectedEvent.actorRole}</dd>
                  </div>

                  <div>
                    <dt>Department</dt>
                    <dd>{selectedEvent.department}</dd>
                  </div>

                  <div>
                    <dt>Organization</dt>
                    <dd>{selectedEvent.organization}</dd>
                  </div>

                  <div>
                    <dt>Jurisdiction</dt>
                    <dd>{selectedEvent.jurisdiction}</dd>
                  </div>
                </dl>
              </section>

              <section className="audit-detail-section">
                <h3>Affected record</h3>

                <dl className="audit-detail-grid">
                  <div>
                    <dt>Entity type</dt>
                    <dd>{selectedEvent.entityType}</dd>
                  </div>

                  <div>
                    <dt>Entity ID</dt>
                    <dd>{selectedEvent.entityId}</dd>
                  </div>

                  <div>
                    <dt>Reference</dt>
                    <dd>{selectedEvent.referenceNumber}</dd>
                  </div>

                  <div>
                    <dt>Reason</dt>
                    <dd>{selectedEvent.reason}</dd>
                  </div>
                </dl>
              </section>

              <section className="audit-detail-section">
                <h3>Request trace</h3>

                <dl className="audit-detail-grid">
                  <div>
                    <dt>Request reference</dt>
                    <dd>{selectedEvent.requestReference}</dd>
                  </div>

                  <div>
                    <dt>IP address</dt>
                    <dd>
                      {selectedEvent.ipAddress ?? "Not applicable"}
                    </dd>
                  </div>
                </dl>
              </section>

              <div className="audit-provenance">
                <ShieldCheck size={17} />

                <p>
                  This record is displayed as demo audit data. Production
                  records must be generated server-side and protected against
                  unauthorized modification.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}