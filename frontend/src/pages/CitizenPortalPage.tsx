import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileCheck2,
  FileText,
  Gavel,
  IndianRupee,
  Info,
  LandPlot,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { findCitizenCase } from "../features/citizen/utils/citizenCaseLookup";

import { getCitizenDocuments } from "../features/citizen/utils/citizenDocumentLookup";

import {
  getCitizenCaseTransparency,
  getCitizenTransparencySummary,
  getRecentCitizenUpdates,
  getUpcomingCitizenHearings,
  getPublishedCitizenProjects,
} from "../features/citizen/utils/citizenTransparencyLookup";

import type {
  CitizenCaseRecord,
  CitizenCaseStage,
  CitizenCaseStatus,
} from "../features/citizen/types/citizenCase";

import type {
  CitizenDocument,
  CitizenDocumentType,
} from "../features/citizen/types/citizenDocument";

import type {
  CitizenPublication,
  CitizenProjectTransparency,
} from "../features/citizen/types/citizenTransparency";

function formatDate(value: string | null): string {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatCurrency(value: number | null): string {
  if (value === null) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function stageLabel(stage: CitizenCaseStage): string {
  const labels: Record<CitizenCaseStage, string> = {
    PROJECT_REGISTERED: "Project Registered",
    LAND_IDENTIFICATION: "Land Identified",
    PRELIMINARY_NOTIFICATION: "Preliminary Notification",
    OBJECTION: "Objection",
    HEARING: "Hearing",
    DECLARATION: "Declaration",
    VALUATION: "Valuation",
    AWARD: "Award",
    COMPENSATION: "Compensation",
    R_AND_R: "R&R",
    POSSESSION: "Possession",
    CLOSED: "Closed",
  };

  return labels[stage];
}

function statusLabel(status: CitizenCaseStatus): string {
  const labels: Record<CitizenCaseStatus, string> = {
    ACTIVE: "Active",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
    CLOSED: "Closed",
  };

  return labels[status];
}

function documentTypeLabel(type: CitizenDocumentType): string {
  const labels: Record<CitizenDocumentType, string> = {
    NOTICE: "Notice",
    DECLARATION: "Declaration",
    HEARING_NOTICE: "Hearing Notice",
    AWARD: "Award",
    COMPENSATION_RECORD: "Compensation",
    RR_RECORD: "R&R",
    POSSESSION_NOTICE: "Possession",
  };

  return labels[type];
}

function publicationTypeLabel(
  publication: CitizenPublication,
): string {
  const labels: Record<CitizenPublication["type"], string> = {
    PROJECT: "Project",
    NOTIFICATION: "Notification",
    OBJECTION: "Objection",
    HEARING: "Hearing",
    AWARD: "Award",
    COMPENSATION: "Compensation",
    R_AND_R: "R&R",
    POSSESSION: "Possession",
    DOCUMENT: "Document",
    CASE_UPDATE: "Case Update",
  };

  return labels[publication.type];
}

function sourceLabel(publication: CitizenPublication): string {
  const labels: Record<CitizenPublication["source"], string> = {
    OFFICIAL_RECORD: "Official Record",
    PUBLISHED_NOTIFICATION: "Published Notification",
    CASE_WORKFLOW: "Case Workflow",
    CITIZEN_SUBMISSION: "Citizen Submission",
    DEMONSTRATION_DATA: "Demonstration Data",
  };

  return labels[publication.source];
}

function projectStatusLabel(
  project: CitizenProjectTransparency,
): string {
  const labels: Record<
    CitizenProjectTransparency["projectStatus"],
    string
  > = {
    PROPOSED: "Proposed",
    REGISTERED: "Registered",
    UNDER_ACQUISITION: "Under Acquisition",
    IMPLEMENTATION: "Implementation",
    COMPLETED: "Completed",
    ON_HOLD: "On Hold",
  };

  return labels[project.projectStatus];
}

function CitizenPortalPage() {
  const [caseReference, setCaseReference] = useState("");
  const [selectedCase, setSelectedCase] =
    useState<CitizenCaseRecord | null>(null);
  const [searched, setSearched] = useState(false);

  const documents = useMemo(() => {
    if (!selectedCase) {
      return [];
    }

    return getCitizenDocuments(selectedCase.caseReference);
  }, [selectedCase]);

  const transparencySummary = useMemo(
    () => getCitizenTransparencySummary(),
    [],
  );

  const caseTransparency = useMemo(() => {
    if (!selectedCase) {
      return [];
    }

    return getCitizenCaseTransparency(
      selectedCase.caseReference,
    );
  }, [selectedCase]);

  const upcomingHearings = useMemo(
    () => getUpcomingCitizenHearings().slice(0, 4),
    [],
  );

  const recentUpdates = useMemo(
    () => getRecentCitizenUpdates().slice(0, 6),
    [],
  );

  const publicProjects = useMemo(
    () => getPublishedCitizenProjects().slice(0, 4),
    [],
  );

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const record = findCitizenCase(caseReference);

    setSelectedCase(record ?? null);
    setSearched(true);
  }

  function clearSearch() {
    setCaseReference("");
    setSelectedCase(null);
    setSearched(false);
  }

  function handleDocumentAccess(
    document: CitizenDocument,
  ) {
    if (document.status !== "AVAILABLE") {
      return;
    }

    window.alert(
      `Demonstration document access\n\n${document.title}\n${document.referenceNumber}\n\nA secure government document repository will provide the actual document in production.`,
    );
  }

  function handlePublicationAccess(
    publication: CitizenPublication,
  ) {
    window.alert(
      `Citizen transparency record\n\n${publication.title}\n${publication.referenceNumber}\n\nSource: ${sourceLabel(publication)}\n\nThis demonstration environment does not connect to a live government document repository.`,
    );
  }

  return (
    <main className="citizen-page">
      <header className="citizen-header">
        <div className="citizen-header__inner">
          <div className="citizen-brand">
            <div
              className="citizen-brand__mark"
              aria-hidden="true"
            >
              <LandPlot size={21} />
            </div>

            <div>
              <span className="citizen-brand__title">
                AAKAR | आकार
              </span>

              <span className="citizen-brand__subtitle">
                National Land Acquisition &amp; Management System
              </span>
            </div>
          </div>

          <div className="citizen-header__right">
            <span className="citizen-header__language">
              English
            </span>

            <div className="citizen-header__security">
              <ShieldCheck
                size={16}
                aria-hidden="true"
              />
              Secure Citizen Access
            </div>
          </div>
        </div>
      </header>

      <section className="citizen-hero">
        <div className="citizen-container">
          <div className="citizen-hero__content">
            <span className="citizen-eyebrow">
              CITIZEN SERVICES
            </span>

            <h1>
              Track your land acquisition case
            </h1>

            <p>
              View the current status of your acquisition case,
              published notifications, hearings, award,
              compensation, rehabilitation and resettlement,
              possession information, and other citizen-visible
              updates.
            </p>
          </div>

          <form
            className="citizen-search-card"
            onSubmit={handleSearch}
          >
            <div className="citizen-search-card__heading">
              <div>
                <span className="citizen-search-card__eyebrow">
                  CASE ACCESS
                </span>

                <h2>
                  Enter your case reference
                </h2>
              </div>

              <div
                className="citizen-search-card__icon"
                aria-hidden="true"
              >
                <Search size={20} />
              </div>
            </div>

            <label htmlFor="case-reference">
              Acquisition Case Reference
            </label>

            <div className="citizen-search-card__input">
              <Search
                size={18}
                aria-hidden="true"
              />

              <input
                id="case-reference"
                type="text"
                value={caseReference}
                onChange={(event) =>
                  setCaseReference(event.target.value)
                }
                placeholder="Example: ACQ-PUN-2026-00421"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              className="citizen-primary-button"
            >
              View Case Status

              <ArrowRight
                size={17}
                aria-hidden="true"
              />
            </button>

            <p className="citizen-search-card__help">
              Use the case reference provided in your official
              acquisition communication.
            </p>
          </form>
        </div>
      </section>

      <section className="citizen-content">
        <div className="citizen-container">
          {searched && !selectedCase && (
            <section className="citizen-result citizen-result--error">
              <div className="citizen-result__icon">
                <Info size={20} />
              </div>

              <div>
                <strong>
                  Case not found
                </strong>

                <p>
                  We could not find a case matching that
                  reference in the current demonstration
                  environment. Please check the reference and
                  try again.
                </p>
              </div>
            </section>
          )}

          {!searched && (
            <>
              <section className="citizen-section">
                <div className="citizen-section__heading">
                  <div>
                    <span className="citizen-eyebrow">
                      PUBLIC TRANSPARENCY
                    </span>

                    <h2>
                      Published land acquisition information
                    </h2>
                  </div>
                </div>

                <div className="citizen-overview-grid">
                  <article className="citizen-overview-card">
                    <div className="citizen-overview-card__icon">
                      <FileText size={19} />
                    </div>

                    <span>
                      Published Notifications
                    </span>

                    <strong>
                      {
                        transparencySummary.publishedNotifications
                      }
                    </strong>

                    <small>
                      Citizen-visible publications
                    </small>
                  </article>

                  <article className="citizen-overview-card">
                    <div className="citizen-overview-card__icon">
                      <CalendarDays size={19} />
                    </div>

                    <span>
                      Upcoming Hearings
                    </span>

                    <strong>
                      {transparencySummary.upcomingHearings}
                    </strong>

                    <small>
                      Published hearing information
                    </small>
                  </article>

                  <article className="citizen-overview-card">
                    <div className="citizen-overview-card__icon">
                      <ClipboardList size={19} />
                    </div>

                    <span>
                      Active Cases
                    </span>

                    <strong>
                      {transparencySummary.activeCases}
                    </strong>

                    <small>
                      Citizen-visible case information
                    </small>
                  </article>

                  <article className="citizen-overview-card">
                    <div className="citizen-overview-card__icon">
                      <FileCheck2 size={19} />
                    </div>

                    <span>
                      Available Documents
                    </span>

                    <strong>
                      {transparencySummary.availableDocuments}
                    </strong>

                    <small>
                      Published for citizen access
                    </small>
                  </article>
                </div>
              </section>

              <section className="citizen-section">
                <div className="citizen-section__heading">
                  <div>
                    <span className="citizen-eyebrow">
                      PUBLIC PROJECTS
                    </span>

                    <h2>
                      Projects with published information
                    </h2>
                  </div>
                </div>

                <div className="citizen-status-grid">
                  {publicProjects.map((project) => (
                    <article
                      key={project.projectId}
                      className="citizen-status-card"
                    >
                      <div className="citizen-status-card__header">
                        <div className="citizen-status-card__icon">
                          <LandPlot size={19} />
                        </div>

                        <div>
                          <span>
                            {project.district}
                          </span>

                          <strong>
                            {project.projectName}
                          </strong>
                        </div>
                      </div>

                      <div className="citizen-status-card__rows">
                        <div>
                          <span>
                            Authority
                          </span>

                          <strong>
                            {project.projectAuthority}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Status
                          </span>

                          <strong>
                            {projectStatusLabel(project)}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Affected parcels
                          </span>

                          <strong>
                            {project.totalAffectedParcels}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Published updates
                          </span>

                          <strong>
                            {project.citizenVisibleUpdates}
                          </strong>
                        </div>

                        <div className="citizen-status-card__full-row">
                          <span>
                            Latest publication
                          </span>

                          <strong>
                            {formatDate(
                              project.lastPublishedUpdate,
                            )}
                          </strong>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="citizen-section">
                <div className="citizen-section__heading">
                  <div>
                    <span className="citizen-eyebrow">
                      HEARINGS
                    </span>

                    <h2>
                      Upcoming published hearings
                    </h2>
                  </div>
                </div>

                {upcomingHearings.length > 0 ? (
                  <div className="citizen-document-list">
                    {upcomingHearings.map(
                      (publication) => (
                        <article
                          key={publication.id}
                          className="citizen-document-card"
                        >
                          <div className="citizen-document-card__icon">
                            <CalendarDays
                              size={20}
                              aria-hidden="true"
                            />
                          </div>

                          <div className="citizen-document-card__body">
                            <div className="citizen-document-card__top">
                              <div>
                                <span className="citizen-document-type">
                                  HEARING
                                </span>

                                <h3>
                                  {publication.title}
                                </h3>
                              </div>

                              <span className="citizen-document-status citizen-document-status--available">
                                Published
                              </span>
                            </div>

                            <p>
                              {publication.description}
                            </p>

                            <div className="citizen-document-card__meta">
                              <span>
                                Ref.{" "}
                                {publication.referenceNumber}
                              </span>

                              <span>
                                Effective{" "}
                                {formatDate(
                                  publication.effectiveDate,
                                )}
                              </span>

                              <span>
                                {sourceLabel(publication)}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="citizen-document-action"
                            onClick={() =>
                              handlePublicationAccess(
                                publication,
                              )
                            }
                          >
                            <ArrowRight
                              size={16}
                              aria-hidden="true"
                            />

                            View
                          </button>
                        </article>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="citizen-documents-empty">
                    <CalendarDays size={23} />

                    <strong>
                      No upcoming hearings published
                    </strong>

                    <p>
                      Published hearing information will
                      appear here when available.
                    </p>
                  </div>
                )}
              </section>

              <section className="citizen-section">
                <div className="citizen-section__heading">
                  <div>
                    <span className="citizen-eyebrow">
                      RECENT UPDATES
                    </span>

                    <h2>
                      Latest citizen-visible publications
                    </h2>
                  </div>
                </div>

                <div className="citizen-document-list">
                  {recentUpdates.map(
                    (publication) => (
                      <article
                        key={publication.id}
                        className="citizen-document-card"
                      >
                        <div className="citizen-document-card__icon">
                          <FileCheck2
                            size={20}
                            aria-hidden="true"
                          />
                        </div>

                        <div className="citizen-document-card__body">
                          <div className="citizen-document-card__top">
                            <div>
                              <span className="citizen-document-type">
                                {publicationTypeLabel(
                                  publication,
                                )}
                              </span>

                              <h3>
                                {publication.title}
                              </h3>
                            </div>

                            <span className="citizen-document-status citizen-document-status--available">
                              Published
                            </span>
                          </div>

                          <p>
                            {publication.description}
                          </p>

                          <div className="citizen-document-card__meta">
                            <span>
                              Ref.{" "}
                              {publication.referenceNumber}
                            </span>

                            <span>
                              Published{" "}
                              {formatDate(
                                publication.publishedDate,
                              )}
                            </span>

                            <span>
                              {sourceLabel(publication)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="citizen-document-action"
                          onClick={() =>
                            handlePublicationAccess(
                              publication,
                            )
                          }
                        >
                          <ArrowRight
                            size={16}
                            aria-hidden="true"
                          />

                          View
                        </button>
                      </article>
                    ),
                  )}
                </div>
              </section>
            </>
          )}

          {selectedCase && (
            <>
              <div className="citizen-case-header">
                <div>
                  <span className="citizen-eyebrow">
                    ACQUISITION CASE
                  </span>

                  <div className="citizen-case-header__title-row">
                    <h2>
                      {selectedCase.caseReference}
                    </h2>

                    <span
                      className={`citizen-status citizen-status--${selectedCase.status.toLowerCase()}`}
                    >
                      {statusLabel(selectedCase.status)}
                    </span>
                  </div>

                  <p>
                    {selectedCase.projectName}
                  </p>
                </div>

                <button
                  type="button"
                  className="citizen-clear-button"
                  onClick={clearSearch}
                  aria-label="Clear case"
                >
                  <X size={17} />
                  Clear
                </button>
              </div>

              <section className="citizen-overview-grid">
                <article className="citizen-overview-card">
                  <div className="citizen-overview-card__icon">
                    <LandPlot size={19} />
                  </div>

                  <span>
                    Parcel
                  </span>

                  <strong>
                    {selectedCase.parcel.parcelId}
                  </strong>

                  <small>
                    Survey No.{" "}
                    {selectedCase.parcel.surveyNumber}
                  </small>
                </article>

                <article className="citizen-overview-card">
                  <div className="citizen-overview-card__icon">
                    <MapPin size={19} />
                  </div>

                  <span>
                    Location
                  </span>

                  <strong>
                    {selectedCase.village}
                  </strong>

                  <small>
                    {selectedCase.district}
                  </small>
                </article>

                <article className="citizen-overview-card">
                  <div className="citizen-overview-card__icon">
                    <CalendarDays size={19} />
                  </div>

                  <span>
                    Current Stage
                  </span>

                  <strong>
                    {stageLabel(
                      selectedCase.currentStage,
                    )}
                  </strong>

                  <small>
                    Updated{" "}
                    {formatDate(
                      selectedCase.lastUpdated,
                    )}
                  </small>
                </article>

                <article className="citizen-overview-card">
                  <div className="citizen-overview-card__icon">
                    <Users size={19} />
                  </div>

                  <span>
                    Recorded Right-Holder
                  </span>

                  <strong>
                    {selectedCase.recordedRightHolder}
                  </strong>

                  <small>
                    Recorded information shown for this case
                  </small>
                </article>
              </section>

              {caseTransparency.length > 0 && (
                <section className="citizen-section">
                  <div className="citizen-section__heading">
                    <div>
                      <span className="citizen-eyebrow">
                        PUBLISHED CASE INFORMATION
                      </span>

                      <h2>
                        Official updates for this case
                      </h2>
                    </div>
                  </div>

                  <div className="citizen-document-list">
                    {caseTransparency.map(
                      (publication) => (
                        <article
                          key={publication.id}
                          className="citizen-document-card"
                        >
                          <div className="citizen-document-card__icon">
                            <FileCheck2
                              size={20}
                              aria-hidden="true"
                            />
                          </div>

                          <div className="citizen-document-card__body">
                            <div className="citizen-document-card__top">
                              <div>
                                <span className="citizen-document-type">
                                  {publicationTypeLabel(
                                    publication,
                                  )}
                                </span>

                                <h3>
                                  {publication.title}
                                </h3>
                              </div>

                              <span className="citizen-document-status citizen-document-status--available">
                                Published
                              </span>
                            </div>

                            <p>
                              {publication.description}
                            </p>

                            <div className="citizen-document-card__meta">
                              <span>
                                Ref.{" "}
                                {publication.referenceNumber}
                              </span>

                              <span>
                                Published{" "}
                                {formatDate(
                                  publication.publishedDate,
                                )}
                              </span>

                              <span>
                                {sourceLabel(
                                  publication,
                                )}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="citizen-document-action"
                            onClick={() =>
                              handlePublicationAccess(
                                publication,
                              )
                            }
                          >
                            <ArrowRight
                              size={16}
                              aria-hidden="true"
                            />

                            View
                          </button>
                        </article>
                      ),
                    )}
                  </div>
                </section>
              )}

              <section className="citizen-section">
                <div className="citizen-section__heading">
                  <div>
                    <span className="citizen-eyebrow">
                      CASE PROGRESS
                    </span>

                    <h2>
                      Acquisition lifecycle
                    </h2>
                  </div>
                </div>

                <div className="citizen-timeline">
                  {selectedCase.timeline.map(
                    (item) => (
                      <div
                        key={item.id}
                        className={`citizen-timeline__item ${
                          item.current
                            ? "citizen-timeline__item--current"
                            : ""
                        }`}
                      >
                        <div className="citizen-timeline__marker">
                          {item.completed ? (
                            <CheckCircle2
                              size={19}
                              aria-hidden="true"
                            />
                          ) : (
                            <span />
                          )}
                        </div>

                        <div className="citizen-timeline__body">
                          <div className="citizen-timeline__top">
                            <strong>
                              {item.title}
                            </strong>

                            {item.date && (
                              <time
                                dateTime={item.date}
                              >
                                {formatDate(
                                  item.date,
                                )}
                              </time>
                            )}
                          </div>

                          <p>
                            {item.description}
                          </p>

                          {item.current && (
                            <span className="citizen-current-label">
                              Current stage
                            </span>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>

              <section className="citizen-status-grid">
                <article className="citizen-status-card">
                  <div className="citizen-status-card__header">
                    <div className="citizen-status-card__icon">
                      <FileText size={19} />
                    </div>

                    <div>
                      <span>
                        Notification
                      </span>

                      <strong>
                        {selectedCase.notification.type}
                      </strong>
                    </div>
                  </div>

                  <div className="citizen-status-card__rows">
                    <div>
                      <span>
                        Reference
                      </span>

                      <strong>
                        {
                          selectedCase.notification
                            .referenceNumber
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Status
                      </span>

                      <strong>
                        {selectedCase.notification.status.replace(
                          /_/g,
                          " ",
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Issued
                      </span>

                      <strong>
                        {formatDate(
                          selectedCase.notification
                            .issueDate,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Served
                      </span>

                      <strong>
                        {formatDate(
                          selectedCase.notification
                            .serviceDate,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>

                <article className="citizen-status-card">
                  <div className="citizen-status-card__header">
                    <div className="citizen-status-card__icon">
                      <Gavel size={19} />
                    </div>

                    <div>
                      <span>
                        Objection &amp; Hearing
                      </span>

                      <strong>
                        {selectedCase.objection.id
                          ? "Proceeding available"
                          : "No objection filed"}
                      </strong>
                    </div>
                  </div>

                  <div className="citizen-status-card__rows">
                    <div>
                      <span>
                        Objection
                      </span>

                      <strong>
                        {selectedCase.objection.status.replace(
                          /_/g,
                          " ",
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Submitted
                      </span>

                      <strong>
                        {formatDate(
                          selectedCase.objection
                            .submittedDate,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Hearing
                      </span>

                      <strong>
                        {selectedCase.hearing.status.replace(
                          /_/g,
                          " ",
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Hearing date
                      </span>

                      <strong>
                        {formatDate(
                          selectedCase.hearing
                            .hearingDate,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>

                <article className="citizen-status-card">
                  <div className="citizen-status-card__header">
                    <div className="citizen-status-card__icon">
                      <ClipboardList size={19} />
                    </div>

                    <div>
                      <span>
                        Award
                      </span>

                      <strong>
                        {selectedCase.award.status.replace(
                          /_/g,
                          " ",
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="citizen-status-card__rows">
                    <div>
                      <span>
                        Award reference
                      </span>

                      <strong>
                        {selectedCase.award
                          .referenceNumber ??
                          "Not available"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Award date
                      </span>

                      <strong>
                        {formatDate(
                          selectedCase.award.awardDate,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>

                <article className="citizen-status-card">
                  <div className="citizen-status-card__header">
                    <div className="citizen-status-card__icon">
                      <IndianRupee size={19} />
                    </div>

                    <div>
                      <span>
                        Compensation
                      </span>

                      <strong>
                        {selectedCase.compensation.status.replace(
                          /_/g,
                          " ",
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="citizen-status-card__rows">
                    <div>
                      <span>
                        Awarded amount
                      </span>

                      <strong>
                        {formatCurrency(
                          selectedCase.compensation
                            .awardedAmount,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Paid amount
                      </span>

                      <strong>
                        {formatCurrency(
                          selectedCase.compensation
                            .paidAmount,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Pending amount
                      </span>

                      <strong>
                        {formatCurrency(
                          selectedCase.compensation
                            .pendingAmount,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Payment date
                      </span>

                      <strong>
                        {formatDate(
                          selectedCase.compensation
                            .paymentDate,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>

                <article className="citizen-status-card">
                  <div className="citizen-status-card__header">
                    <div className="citizen-status-card__icon">
                      <Users size={19} />
                    </div>

                    <div>
                      <span>
                        Rehabilitation &amp; Resettlement
                      </span>

                      <strong>
                        {selectedCase.rr.status.replace(
                          /_/g,
                          " ",
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="citizen-status-card__rows">
                    <div>
                      <span>
                        Assistance
                      </span>

                      <strong>
                        {formatCurrency(
                          selectedCase.rr
                            .assistanceAmount,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Relocation
                      </span>

                      <strong>
                        {selectedCase.rr.relocationStatus.replace(
                          /_/g,
                          " ",
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Rehabilitation
                      </span>

                      <strong>
                        {selectedCase.rr.rehabilitationStatus.replace(
                          /_/g,
                          " ",
                        )}
                      </strong>
                    </div>

                    <div className="citizen-status-card__full-row">
                      <span>
                        Package
                      </span>

                      <strong>
                        {selectedCase.rr
                          .packageDescription ??
                          "Not available"}
                      </strong>
                    </div>
                  </div>
                </article>

                <article className="citizen-status-card">
                  <div className="citizen-status-card__header">
                    <div className="citizen-status-card__icon">
                      <LandPlot size={19} />
                    </div>

                    <div>
                      <span>
                        Possession
                      </span>

                      <strong>
                        {selectedCase.possession.status.replace(
                          /_/g,
                          " ",
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="citizen-status-card__rows">
                    <div>
                      <span>
                        Possession notice
                      </span>

                      <strong>
                        {formatDate(
                          selectedCase.possession
                            .noticeDate,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Handover date
                      </span>

                      <strong>
                        {formatDate(
                          selectedCase.possession
                            .scheduledDate,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Possession date
                      </span>

                      <strong>
                        {formatDate(
                          selectedCase.possession
                            .possessionDate,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              </section>

              <section className="citizen-documents-section">
                <div className="citizen-section__heading">
                  <div>
                    <span className="citizen-eyebrow">
                      OFFICIAL RECORDS
                    </span>

                    <h2>
                      Documents available for this case
                    </h2>
                  </div>
                </div>

                {documents.length > 0 ? (
                  <div className="citizen-document-list">
                    {documents.map(
                      (document) => (
                        <article
                          key={document.id}
                          className="citizen-document-card"
                        >
                          <div className="citizen-document-card__icon">
                            {document.status ===
                            "AVAILABLE" ? (
                              <FileCheck2
                                size={20}
                                aria-hidden="true"
                              />
                            ) : (
                              <FileText
                                size={20}
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          <div className="citizen-document-card__body">
                            <div className="citizen-document-card__top">
                              <div>
                                <span className="citizen-document-type">
                                  {documentTypeLabel(
                                    document.type,
                                  )}
                                </span>

                                <h3>
                                  {document.title}
                                </h3>
                              </div>

                              <span
                                className={`citizen-document-status citizen-document-status--${document.status.toLowerCase()}`}
                              >
                                {document.status.replace(
                                  /_/g,
                                  " ",
                                )}
                              </span>
                            </div>

                            <p>
                              {document.description}
                            </p>

                            <div className="citizen-document-card__meta">
                              <span>
                                Ref.{" "}
                                {document.referenceNumber}
                              </span>

                              <span>
                                {formatDate(
                                  document.issueDate,
                                )}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="citizen-document-action"
                            disabled={
                              document.status !==
                              "AVAILABLE"
                            }
                            onClick={() =>
                              handleDocumentAccess(
                                document,
                              )
                            }
                          >
                            <Download
                              size={16}
                              aria-hidden="true"
                            />

                            {document.status ===
                            "AVAILABLE"
                              ? "View"
                              : "Processing"}
                          </button>
                        </article>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="citizen-documents-empty">
                    <FileText size={23} />

                    <strong>
                      No citizen-visible documents available
                    </strong>

                    <p>
                      Documents will appear here when they are
                      officially published for citizen access.
                    </p>
                  </div>
                )}
              </section>

              <section className="citizen-parcel-section">
                <div>
                  <span className="citizen-eyebrow">
                    PARCEL INFORMATION
                  </span>

                  <h2>
                    Land parcel associated with this case
                  </h2>
                </div>

                <div className="citizen-parcel-grid">
                  <div>
                    <span>
                      Parcel ID
                    </span>

                    <strong>
                      {selectedCase.parcel.parcelId}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Survey Number
                    </span>

                    <strong>
                      {selectedCase.parcel.surveyNumber}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Area
                    </span>

                    <strong>
                      {selectedCase.parcel.areaHectares.toFixed(
                        2,
                      )}{" "}
                      ha
                    </strong>
                  </div>

                  <div>
                    <span>
                      Land Use
                    </span>

                    <strong>
                      {selectedCase.parcel.landUse}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Village
                    </span>

                    <strong>
                      {selectedCase.parcel.village}
                    </strong>
                  </div>

                  <div>
                    <span>
                      District
                    </span>

                    <strong>
                      {selectedCase.parcel.district}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="citizen-information-note">
                <Info
                  size={19}
                  aria-hidden="true"
                />

                <div>
                  <strong>
                    Information shown to citizens
                  </strong>

                  <p>
                    This portal displays only officially
                    published or citizen-authorized information.
                    Internal officer remarks, internal workflow
                    information, AI analysis, audit records,
                    restricted records, and information belonging
                    to other parties are not displayed here.
                  </p>
                </div>
              </section>
            </>
          )}

          {!searched && (
            <section className="citizen-empty-state">
              <div className="citizen-empty-state__icon">
                <Search size={25} />
              </div>

              <h2>
                Check your acquisition case status
              </h2>

              <p>
                Enter the acquisition case reference provided in
                your official communication to view the latest
                available case information.
              </p>

              <div className="citizen-empty-state__steps">
                <div>
                  <span>1</span>
                  <strong>
                    Enter reference
                  </strong>
                </div>

                <ArrowRight
                  size={16}
                  aria-hidden="true"
                />

                <div>
                  <span>2</span>
                  <strong>
                    Verify access
                  </strong>
                </div>

                <ArrowRight
                  size={16}
                  aria-hidden="true"
                />

                <div>
                  <span>3</span>
                  <strong>
                    Track your case
                  </strong>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      <footer className="citizen-footer">
        <div className="citizen-container citizen-footer__inner">
          <div>
            <strong>
              AAKAR | आकार
            </strong>

            <span>
              Shaping land. Empowering development
            </span>
          </div>

          <span>
            Demonstration environment · No live government
            records
          </span>
        </div>
      </footer>
    </main>
  );
}

export default CitizenPortalPage;