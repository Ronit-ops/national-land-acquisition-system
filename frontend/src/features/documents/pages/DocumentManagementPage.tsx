import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  FolderOpen,
  History,
  LockKeyhole,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { demoDocuments } from "../data/documents";

import type {
  DocumentRecord,
  DocumentSensitivity,
  DocumentSource,
  DocumentStatus,
  DocumentType,
  DocumentVerificationStatus,
  DocumentVersionStatus,
} from "../types/document";

const documentTypeLabels: Record<DocumentType, string> = {
  LAND_RECORD: "Land Record",
  OWNERSHIP_RECORD: "Ownership Record",
  RIGHT_HOLDER_RECORD: "Right-Holder Record",
  PRELIMINARY_NOTIFICATION: "Preliminary Notification",
  HEARING_NOTICE: "Hearing Notice",
  HEARING_RECORD: "Hearing Record",
  DECLARATION: "Declaration",
  VALUATION_REPORT: "Valuation Report",
  AWARD: "Award",
  COMPENSATION_RECORD: "Compensation Record",
  R_AND_R_RECORD: "R&R Record",
  POSSESSION_NOTICE: "Possession Notice",
  POSSESSION_RECORD: "Possession Record",
  FIELD_EVIDENCE: "Field Evidence",
  OTHER: "Other",
};

const documentStatusLabels: Record<DocumentStatus, string> = {
  AVAILABLE: "Available",
  PROCESSING: "Processing",
  UNDER_VERIFICATION: "Under Verification",
  VERIFIED: "Verified",
  DISPUTED: "Disputed",
  NOT_AVAILABLE: "Not Available",
  WITHHELD: "Withheld",
};

const verificationLabels: Record<DocumentVerificationStatus, string> = {
  NOT_VERIFIED: "Not Verified",
  UNDER_REVIEW: "Under Review",
  VERIFIED: "Verified",
  DISPUTED: "Disputed",
};

const sourceLabels: Record<DocumentSource, string> = {
  REVENUE_RECORD: "Revenue Record",
  ACQUISITION_DEPARTMENT: "Acquisition Department",
  PROJECT_AUTHORITY: "Project Authority",
  COURT_RECORD: "Court Record",
  FIELD_VERIFICATION: "Field Verification",
  SYSTEM_GENERATED: "System Generated",
  CITIZEN_SUBMISSION: "Citizen Submission",
  OTHER: "Other",
};

const sensitivityLabels: Record<DocumentSensitivity, string> = {
  PUBLIC: "Public",
  OFFICER_ONLY: "Officer Only",
  RESTRICTED: "Restricted",
  HIGHLY_RESTRICTED: "Highly Restricted",
};

const versionStatusLabels: Record<DocumentVersionStatus, string> = {
  CURRENT: "Current",
  SUPERSEDED: "Superseded",
  ARCHIVED: "Archived",
};

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusClass(status: DocumentStatus): string {
  switch (status) {
    case "VERIFIED":
      return "document-status document-status--verified";

    case "UNDER_VERIFICATION":
    case "PROCESSING":
      return "document-status document-status--pending";

    case "DISPUTED":
      return "document-status document-status--danger";

    case "WITHHELD":
      return "document-status document-status--restricted";

    default:
      return "document-status";
  }
}

function getVerificationClass(
  status: DocumentVerificationStatus,
): string {
  switch (status) {
    case "VERIFIED":
      return "document-verification document-verification--verified";

    case "DISPUTED":
      return "document-verification document-verification--danger";

    case "UNDER_REVIEW":
      return "document-verification document-verification--pending";

    default:
      return "document-verification";
  }
}

function getVersionClass(status: DocumentVersionStatus): string {
  switch (status) {
    case "CURRENT":
      return "document-version document-version--current";

    case "SUPERSEDED":
      return "document-version document-version--superseded";

    case "ARCHIVED":
      return "document-version document-version--archived";
  }
}

function getSensitivityClass(
  sensitivity: DocumentSensitivity,
): string {
  switch (sensitivity) {
    case "PUBLIC":
      return "document-sensitivity document-sensitivity--public";

    case "OFFICER_ONLY":
      return "document-sensitivity document-sensitivity--officer";

    case "RESTRICTED":
      return "document-sensitivity document-sensitivity--restricted";

    case "HIGHLY_RESTRICTED":
      return "document-sensitivity document-sensitivity--high";
  }
}

function DocumentStatusIcon({
  status,
}: {
  status: DocumentStatus;
}) {
  if (status === "VERIFIED") {
    return <CheckCircle2 size={14} />;
  }

  if (
    status === "UNDER_VERIFICATION" ||
    status === "PROCESSING"
  ) {
    return <Clock3 size={14} />;
  }

  if (status === "DISPUTED") {
    return <AlertTriangle size={14} />;
  }

  return <CircleHelp size={14} />;
}

function getVersionLineage(
  selectedDocument: DocumentRecord,
): DocumentRecord[] {
  const lineage: DocumentRecord[] = [];

  const visited = new Set<string>();

  let current: DocumentRecord | undefined = selectedDocument;

  while (current && !visited.has(current.id)) {
    lineage.push(current);

    visited.add(current.id);

    if (!current.previousVersionId) {
      break;
    }

    current = demoDocuments.find(
      (document) =>
        document.id === current?.previousVersionId,
    );
  }

  return lineage;
}

function isVersionRelated(
  document: DocumentRecord,
  selectedDocument: DocumentRecord,
): boolean {
  return (
    document.id !== selectedDocument.id &&
    document.acquisitionCaseId ===
      selectedDocument.acquisitionCaseId &&
    document.parcelId === selectedDocument.parcelId &&
    document.type === selectedDocument.type
  );
}

export default function DocumentManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [typeFilter, setTypeFilter] = useState<
    "ALL" | DocumentType
  >("ALL");

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | DocumentStatus
  >("ALL");

  const [verificationFilter, setVerificationFilter] =
    useState<"ALL" | DocumentVerificationStatus>("ALL");

  const [sourceFilter, setSourceFilter] = useState<
    "ALL" | DocumentSource
  >("ALL");

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<string | null>(null);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery =
      searchQuery.trim().toLowerCase();

    return demoDocuments.filter((document) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          document.documentNumber,
          document.title,
          document.acquisitionCaseId,
          document.parcelId,
          document.surveyNumber,
          document.recordedRightHolder,
          document.district,
          document.village,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(normalizedQuery),
          );

      const matchesType =
        typeFilter === "ALL" ||
        document.type === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        document.status === statusFilter;

      const matchesVerification =
        verificationFilter === "ALL" ||
        document.verificationStatus ===
          verificationFilter;

      const matchesSource =
        sourceFilter === "ALL" ||
        document.source === sourceFilter;

      return (
        matchesQuery &&
        matchesType &&
        matchesStatus &&
        matchesVerification &&
        matchesSource
      );
    });
  }, [
    searchQuery,
    typeFilter,
    statusFilter,
    verificationFilter,
    sourceFilter,
  ]);

  const selectedDocument = useMemo<
    DocumentRecord | null
  >(() => {
    if (!selectedDocumentId) {
      return null;
    }

    return (
      demoDocuments.find(
        (document) =>
          document.id === selectedDocumentId,
      ) ?? null
    );
  }, [selectedDocumentId]);

  const versionLineage = useMemo(() => {
    if (!selectedDocument) {
      return [];
    }

    return getVersionLineage(selectedDocument);
  }, [selectedDocument]);

  const relatedVersionRecords = useMemo(() => {
    if (!selectedDocument) {
      return [];
    }

    return demoDocuments
      .filter((document) =>
        isVersionRelated(
          document,
          selectedDocument,
        ),
      )
      .sort(
        (a, b) =>
          b.versionNumber - a.versionNumber,
      );
  }, [selectedDocument]);

  const totalDocuments = demoDocuments.length;

  const verifiedDocuments =
    demoDocuments.filter(
      (document) =>
        document.verificationStatus ===
        "VERIFIED",
    ).length;

  const pendingDocuments =
    demoDocuments.filter(
      (document) =>
        document.verificationStatus ===
          "UNDER_REVIEW" ||
        document.status ===
          "UNDER_VERIFICATION",
    ).length;

  const restrictedDocuments =
    demoDocuments.filter(
      (document) =>
        document.sensitivity ===
          "RESTRICTED" ||
        document.sensitivity ===
          "HIGHLY_RESTRICTED",
    ).length;

  const citizenVisibleDocuments =
    demoDocuments.filter(
      (document) => document.citizenVisible,
    ).length;

  const currentVersions =
    demoDocuments.filter(
      (document) =>
        document.versionStatus === "CURRENT",
    ).length;

  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setVerificationFilter("ALL");
    setSourceFilter("ALL");
  };

  return (
    <div className="document-page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="document-page__header">
        <div>
          <div className="document-page__eyebrow">
            Records &amp; Evidence
          </div>

          <h1>
            Document &amp; Record Management
          </h1>

          <p>
            Centralized document visibility across
            acquisition cases, parcels, proceedings,
            compensation, R&amp;R and possession.
          </p>
        </div>

        <div className="document-page__header-actions">
          <button
            type="button"
            className="document-secondary-button"
          >
            <FolderOpen size={16} />

            Record Repository
          </button>
        </div>
      </div>

      {/* =====================================================
          PROVENANCE NOTICE
          ===================================================== */}

      <div className="document-provenance-notice">
        <ShieldCheck size={17} />

        <div>
          <strong>
            Document provenance is preserved
          </strong>

          <span>
            Recorded source, verification state,
            sensitivity and version history are
            displayed separately. Demo records shown
            here are simulated and are not live
            government records.
          </span>
        </div>
      </div>

      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <section
        className="document-summary-grid"
        aria-label="Document summary"
      >
        <div className="document-summary-card">
          <div className="document-summary-card__icon">
            <FileText size={18} />
          </div>

          <div>
            <span>Total Records</span>
            <strong>{totalDocuments}</strong>
          </div>
        </div>

        <div className="document-summary-card">
          <div className="document-summary-card__icon">
            <FileCheck2 size={18} />
          </div>

          <div>
            <span>Verified</span>
            <strong>{verifiedDocuments}</strong>
          </div>
        </div>

        <div className="document-summary-card">
          <div className="document-summary-card__icon">
            <Clock3 size={18} />
          </div>

          <div>
            <span>Pending Verification</span>
            <strong>{pendingDocuments}</strong>
          </div>
        </div>

        <div className="document-summary-card">
          <div className="document-summary-card__icon">
            <LockKeyhole size={18} />
          </div>

          <div>
            <span>Restricted</span>
            <strong>{restrictedDocuments}</strong>
          </div>
        </div>

        <div className="document-summary-card">
          <div className="document-summary-card__icon">
            <Eye size={18} />
          </div>

          <div>
            <span>Citizen Visible</span>
            <strong>{citizenVisibleDocuments}</strong>
          </div>
        </div>

        <div className="document-summary-card">
          <div className="document-summary-card__icon">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <span>Current Versions</span>
            <strong>{currentVersions}</strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          DOCUMENT WORKSPACE
          ===================================================== */}

      <section className="document-workspace">
        <div className="document-workspace__toolbar">
          <div className="document-search">
            <Search size={17} />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search document no., case, parcel, survey no. or right-holder"
              aria-label="Search documents"
            />
          </div>

          <div className="document-filter-icon">
            <Filter size={16} />

            Filters
          </div>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value as
                  | "ALL"
                  | DocumentType,
              )
            }
            aria-label="Filter by document type"
          >
            <option value="ALL">
              All Types
            </option>

            {Object.entries(
              documentTypeLabels,
            ).map(([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "ALL"
                  | DocumentStatus,
              )
            }
            aria-label="Filter by document status"
          >
            <option value="ALL">
              All Statuses
            </option>

            {Object.entries(
              documentStatusLabels,
            ).map(([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </select>

          <select
            value={verificationFilter}
            onChange={(event) =>
              setVerificationFilter(
                event.target.value as
                  | "ALL"
                  | DocumentVerificationStatus,
              )
            }
            aria-label="Filter by verification status"
          >
            <option value="ALL">
              All Verification
            </option>

            {Object.entries(
              verificationLabels,
            ).map(([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(event) =>
              setSourceFilter(
                event.target.value as
                  | "ALL"
                  | DocumentSource,
              )
            }
            aria-label="Filter by document source"
          >
            <option value="ALL">
              All Sources
            </option>

            {Object.entries(
              sourceLabels,
            ).map(([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="document-reset-button"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <div className="document-workspace__meta">
          <span>
            Showing{" "}
            <strong>
              {filteredDocuments.length}
            </strong>{" "}
            of{" "}
            <strong>
              {totalDocuments}
            </strong>{" "}
            records
          </span>

          {(searchQuery ||
            typeFilter !== "ALL" ||
            statusFilter !== "ALL" ||
            verificationFilter !== "ALL" ||
            sourceFilter !== "ALL") && (
            <span className="document-filter-state">
              Active filters applied
            </span>
          )}
        </div>

        <div className="document-table-wrap">
          <table className="document-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Record Context</th>
                <th>Source</th>
                <th>Status</th>
                <th>Verification</th>
                <th>Access</th>
                <th>Version</th>
                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody>
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="document-empty">
                      <Search size={24} />

                      <strong>
                        No matching records
                      </strong>

                      <span>
                        Try changing the search
                        term or clearing the
                        filters.
                      </span>

                      <button
                        type="button"
                        onClick={resetFilters}
                        className="document-empty__button"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map(
                  (document) => (
                    <tr
                      key={document.id}
                      className={
                        selectedDocumentId ===
                        document.id
                          ? "document-row document-row--selected"
                          : "document-row"
                      }
                    >
                      <td>
                        <button
                          type="button"
                          className="document-record-button"
                          onClick={() =>
                            setSelectedDocumentId(
                              document.id,
                            )
                          }
                        >
                          <div className="document-record-icon">
                            <FileText
                              size={17}
                            />
                          </div>

                          <div className="document-record-content">
                            <strong>
                              {
                                document.title
                              }
                            </strong>

                            <span>
                              {
                                document.documentNumber
                              }
                            </span>
                          </div>
                        </button>
                      </td>

                      <td>
                        <div className="document-context">
                          <strong>
                            {
                              document.acquisitionCaseId ??
                              "No case linked"
                            }
                          </strong>

                          <span>
                            {document.parcelId
                              ? `Parcel ${document.parcelId}`
                              : "No parcel linked"}
                          </span>

                          <span>
                            {document.recordedRightHolder
                              ? `Right-holder: ${document.recordedRightHolder}`
                              : "No recorded right-holder"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="document-source">
                          {
                            sourceLabels[
                              document.source
                            ]
                          }
                        </span>
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            document.status,
                          )}
                        >
                          <DocumentStatusIcon
                            status={
                              document.status
                            }
                          />

                          {
                            documentStatusLabels[
                              document.status
                            ]
                          }
                        </span>
                      </td>

                      <td>
                        <span
                          className={getVerificationClass(
                            document.verificationStatus,
                          )}
                        >
                          {
                            verificationLabels[
                              document
                                .verificationStatus
                            ]
                          }
                        </span>
                      </td>

                      <td>
                        <div className="document-access">
                          <span
                            className={getSensitivityClass(
                              document.sensitivity,
                            )}
                          >
                            {document.sensitivity !==
                              "PUBLIC" && (
                              <LockKeyhole
                                size={12}
                              />
                            )}

                            {
                              sensitivityLabels[
                                document
                                  .sensitivity
                              ]
                            }
                          </span>

                          {document.citizenVisible && (
                            <span className="document-citizen">
                              <Eye size={12} />
                              Citizen
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="document-version-cell">
                          <span
                            className={getVersionClass(
                              document.versionStatus,
                            )}
                          >
                            V
                            {
                              document.versionNumber
                            }
                          </span>

                          <span>
                            {
                              versionStatusLabels[
                                document
                                  .versionStatus
                              ]
                            }
                          </span>
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="document-view-button"
                          onClick={() =>
                            setSelectedDocumentId(
                              document.id,
                            )
                          }
                          aria-label={`View ${document.title}`}
                        >
                          <ChevronRight
                            size={18}
                          />
                        </button>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================
          DETAIL DRAWER
          ===================================================== */}

      {selectedDocument && (
        <div
          className="document-drawer-backdrop"
          onMouseDown={() =>
            setSelectedDocumentId(null)
          }
        >
          <aside
            className="document-drawer"
            aria-label="Document details"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* -------------------------------------------------
                DRAWER HEADER
                ------------------------------------------------- */}

            <div className="document-drawer__header">
              <div>
                <span>
                  Document Record
                </span>

                <h2>
                  {selectedDocument.title}
                </h2>

                <p>
                  {
                    selectedDocument.documentNumber
                  }
                </p>
              </div>

              <button
                type="button"
                className="document-drawer__close"
                onClick={() =>
                  setSelectedDocumentId(null)
                }
                aria-label="Close document details"
              >
                <X size={19} />
              </button>
            </div>

            {/* -------------------------------------------------
                DRAWER BODY
                ------------------------------------------------- */}

            <div className="document-drawer__body">
              {/* Status */}

              <div className="document-detail-status">
                <span
                  className={getStatusClass(
                    selectedDocument.status,
                  )}
                >
                  <DocumentStatusIcon
                    status={
                      selectedDocument.status
                    }
                  />

                  {
                    documentStatusLabels[
                      selectedDocument.status
                    ]
                  }
                </span>

                <span
                  className={getVerificationClass(
                    selectedDocument.verificationStatus,
                  )}
                >
                  {
                    verificationLabels[
                      selectedDocument
                        .verificationStatus
                    ]
                  }
                </span>

                <span
                  className={getVersionClass(
                    selectedDocument.versionStatus,
                  )}
                >
                  V
                  {
                    selectedDocument.versionNumber
                  }{" "}
                  {
                    versionStatusLabels[
                      selectedDocument
                        .versionStatus
                    ]
                  }
                </span>
              </div>

              {/* -------------------------------------------------
                  RECORD IDENTITY
                  ------------------------------------------------- */}

              <section className="document-detail-section">
                <div className="document-detail-section__title">
                  Record Identity
                </div>

                <dl className="document-detail-list">
                  <div>
                    <dt>Document Number</dt>

                    <dd>
                      {
                        selectedDocument.documentNumber
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>Document Type</dt>

                    <dd>
                      {
                        documentTypeLabels[
                          selectedDocument.type
                        ]
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>Issue Date</dt>

                    <dd>
                      {formatDate(
                        selectedDocument.issueDate,
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt>Received Date</dt>

                    <dd>
                      {formatDate(
                        selectedDocument.receivedDate,
                      )}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* -------------------------------------------------
                  RECORD CONTEXT
                  ------------------------------------------------- */}

              <section className="document-detail-section">
                <div className="document-detail-section__title">
                  Record Context
                </div>

                <dl className="document-detail-list">
                  <div>
                    <dt>Acquisition Case</dt>

                    <dd>
                      {
                        selectedDocument.acquisitionCaseId ??
                        "—"
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>Parcel</dt>

                    <dd>
                      {
                        selectedDocument.parcelId ??
                        "—"
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>Survey Number</dt>

                    <dd>
                      {
                        selectedDocument.surveyNumber ??
                        "—"
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>Recorded Right-Holder</dt>

                    <dd>
                      <span className="document-right-holder">
                        <UserRound size={14} />

                        {
                          selectedDocument.recordedRightHolder ??
                          "—"
                        }
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt>Location</dt>

                    <dd>
                      {
                        selectedDocument.village
                      }
                      ,{" "}
                      {
                        selectedDocument.district
                      }
                    </dd>
                  </div>
                </dl>
              </section>

              {/* -------------------------------------------------
                  PROVENANCE
                  ------------------------------------------------- */}

              <section className="document-detail-section">
                <div className="document-detail-section__title">
                  Provenance &amp; Verification
                </div>

                <div className="document-provenance-panel">
                  <div className="document-provenance-panel__row">
                    <ShieldCheck
                      size={16}
                    />

                    <div>
                      <span>
                        Source Record
                      </span>

                      <strong>
                        {
                          sourceLabels[
                            selectedDocument
                              .source
                          ]
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="document-provenance-panel__row">
                    <FileCheck2
                      size={16}
                    />

                    <div>
                      <span>
                        Verification State
                      </span>

                      <strong>
                        {
                          verificationLabels[
                            selectedDocument
                              .verificationStatus
                          ]
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="document-provenance-panel__row">
                    <FileText
                      size={16}
                    />

                    <div>
                      <span>
                        Source Reference
                      </span>

                      <strong>
                        {
                          selectedDocument
                            .sourceReference ??
                          "No source reference recorded"
                        }
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="document-provenance-note">
                  <strong>
                    Record ≠ Legal Determination
                  </strong>

                  <span>
                    The recorded right-holder shown
                    above reflects the associated
                    source record. It is not, by
                    itself, a legal determination of
                    ownership.
                  </span>
                </div>
              </section>

              {/* -------------------------------------------------
                  VERSION HISTORY
                  ------------------------------------------------- */}

              <section className="document-detail-section">
                <div className="document-detail-section__heading-row">
                  <div>
                    <div className="document-detail-section__title">
                      Version History
                    </div>

                    <p className="document-detail-section__description">
                      Traceable document lineage based
                      on recorded version references.
                    </p>
                  </div>

                  <History
                    size={17}
                  />
                </div>

                <div className="document-version-history">
                  {versionLineage.map(
                    (
                      version,
                      index,
                    ) => (
                      <div
                        className={
                          index === 0
                            ? "document-version-history__item document-version-history__item--current"
                            : "document-version-history__item"
                        }
                        key={
                          version.id
                        }
                      >
                        <div className="document-version-history__marker">
                          {index ===
                          0 ? (
                            <CheckCircle2
                              size={15}
                            />
                          ) : (
                            <History
                              size={14}
                            />
                          )}
                        </div>

                        <div className="document-version-history__content">
                          <div className="document-version-history__top">
                            <strong>
                              Version{" "}
                              {
                                version.versionNumber
                              }
                            </strong>

                            <span
                              className={getVersionClass(
                                version.versionStatus,
                              )}
                            >
                              {
                                versionStatusLabels[
                                  version
                                    .versionStatus
                                ]
                              }
                            </span>
                          </div>

                          <span className="document-version-history__number">
                            {
                              version.documentNumber
                            }
                          </span>

                          <span className="document-version-history__date">
                            Updated{" "}
                            {formatDateTime(
                              version.updatedAt,
                            )}
                          </span>

                          <span className="document-version-history__description">
                            {version.description}
                          </span>

                          {version.id !==
                            selectedDocument.id && (
                            <button
                              type="button"
                              className="document-version-history__button"
                              onClick={() =>
                                setSelectedDocumentId(
                                  version.id,
                                )
                              }
                            >
                              Open this version
                              <ChevronRight
                                size={14}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {relatedVersionRecords.length >
                  0 && (
                  <div className="document-related-records">
                    <div className="document-related-records__header">
                      <span>
                        Related version records
                      </span>

                      <strong>
                        {
                          relatedVersionRecords.length
                        }
                      </strong>
                    </div>

                    {relatedVersionRecords.map(
                      (version) => (
                        <button
                          type="button"
                          className="document-related-record"
                          key={
                            version.id
                          }
                          onClick={() =>
                            setSelectedDocumentId(
                              version.id,
                            )
                          }
                        >
                          <div>
                            <strong>
                              {
                                version.title
                              }
                            </strong>

                            <span>
                              {
                                version.documentNumber
                              }{" "}
                              · V
                              {
                                version.versionNumber
                              }
                            </span>
                          </div>

                          <ChevronRight
                            size={15}
                          />
                        </button>
                      ),
                    )}
                  </div>
                )}
              </section>

              {/* -------------------------------------------------
                  ACCESS CONTROL
                  ------------------------------------------------- */}

              <section className="document-detail-section">
                <div className="document-detail-section__title">
                  Access &amp; Visibility
                </div>

                <dl className="document-detail-list">
                  <div>
                    <dt>Sensitivity</dt>

                    <dd>
                      <span
                        className={getSensitivityClass(
                          selectedDocument.sensitivity,
                        )}
                      >
                        {selectedDocument
                          .sensitivity !==
                          "PUBLIC" && (
                          <LockKeyhole
                            size={12}
                          />
                        )}

                        {
                          sensitivityLabels[
                            selectedDocument
                              .sensitivity
                          ]
                        }
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt>Citizen Visible</dt>

                    <dd>
                      {selectedDocument.citizenVisible
                        ? "Yes"
                        : "No"}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* -------------------------------------------------
                  FILE INFORMATION
                  ------------------------------------------------- */}

              <section className="document-detail-section">
                <div className="document-detail-section__title">
                  File Information
                </div>

                <dl className="document-detail-list">
                  <div>
                    <dt>File Name</dt>

                    <dd>
                      {
                        selectedDocument.fileName ??
                        "—"
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>Format</dt>

                    <dd>
                      {
                        selectedDocument.mimeType ??
                        "—"
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>File Size</dt>

                    <dd>
                      {formatFileSize(
                        selectedDocument.fileSizeBytes,
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt>Repository Reference</dt>

                    <dd>
                      {
                        selectedDocument.fileReference ??
                        "—"
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>Uploaded By</dt>

                    <dd>
                      {
                        selectedDocument.uploadedBy ??
                        "—"
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>Uploaded At</dt>

                    <dd>
                      {formatDateTime(
                        selectedDocument.uploadedAt,
                      )}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* -------------------------------------------------
                  DESCRIPTION
                  ------------------------------------------------- */}

              <section className="document-detail-section">
                <div className="document-detail-section__title">
                  Description
                </div>

                <p className="document-description">
                  {
                    selectedDocument.description
                  }
                </p>
              </section>

              {/* -------------------------------------------------
                  DEMO ACTION NOTICE
                  ------------------------------------------------- */}

              <div className="document-demo-action">
                <ShieldCheck size={16} />

                <div>
                  <strong>
                    Controlled demo action
                  </strong>

                  <span>
                    The repository is simulated in
                    the frontend. No real government
                    document is being retrieved or
                    modified.
                  </span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------
                DRAWER FOOTER
                ------------------------------------------------- */}

            <div className="document-drawer__footer">
              <button
                type="button"
                className="document-secondary-button"
                onClick={() =>
                  setSelectedDocumentId(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="document-secondary-button"
                title="Download is disabled for demo records"
              >
                <Download size={15} />

                Download
              </button>

              <button
                type="button"
                className="document-primary-button"
                title="Record viewer will connect to repository storage in the backend"
              >
                <Eye size={16} />

                View Record
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}