import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  Satellite,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fieldVerificationRecords } from "../data/fieldVerification";
import type {
  FieldEvidence,
  FieldVerificationRecord,
} from "../types/fieldVerification";

function formatDate(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(status: FieldVerificationRecord["verificationStatus"]) {
  return status.replaceAll("_", " ");
}

function outcomeLabel(outcome: FieldVerificationRecord["outcome"]) {
  if (!outcome) {
    return "Pending";
  }

  return outcome.replaceAll("_", " ");
}

function severityClass(
  severity: FieldVerificationRecord["aiSeverity"],
) {
  return `field-verification-severity field-verification-severity--${severity.toLowerCase()}`;
}

function evidenceIcon(type: FieldEvidence["type"]) {
  if (type === "GPS_CAPTURE") {
    return <MapPin size={17} />;
  }

  if (type === "DOCUMENT") {
    return <FileText size={17} />;
  }

  if (type === "OFFICER_NOTE") {
    return <MessageSquare size={17} />;
  }

  return <Satellite size={17} />;
}

function FieldVerificationReviewPage() {
  const { verificationId } = useParams();
  const navigate = useNavigate();

  const record = fieldVerificationRecords.find(
    (item) => item.id === verificationId,
  );

  if (!record) {
    return (
      <section className="field-verification-not-found">
        <div className="field-verification-not-found__icon">
          <TriangleAlert size={22} />
        </div>

        <span className="application-welcome__eyebrow">
          FIELD VERIFICATION
        </span>

        <h2>Verification record not found</h2>

        <p>
          The requested field verification record does not exist in the
          current demonstration dataset.
        </p>

        <Link
          to="/app/field-verification"
          className="field-verification-button"
        >
          <ArrowLeft size={16} />
          Back to Field Verification
        </Link>
      </section>
    );
  }

  const availableEvidence = record.evidence.filter(
    (item) => item.available,
  );

  return (
    <div className="field-verification-review">
      <div className="field-verification-review__topbar">
        <button
          type="button"
          className="field-verification-back"
          onClick={() => navigate("/app/field-verification")}
        >
          <ArrowLeft size={17} />
          Back to Field Verification
        </button>

        <div className="field-verification-review__actions">
          <span className="field-verification-status">
            {statusLabel(record.verificationStatus)}
          </span>

          <span className={severityClass(record.aiSeverity)}>
            {record.aiSeverity} PRIORITY
          </span>
        </div>
      </div>

      <section className="field-verification-review__hero">
        <div>
          <span className="application-welcome__eyebrow">
            FIELD EVIDENCE REVIEW
          </span>

          <h2>{record.id}</h2>

          <p>
            Review the field evidence associated with the AI observation
            before recording an authorized verification outcome.
          </p>
        </div>

        <div className="field-verification-review__hero-meta">
          <div>
            <span>AI Alert</span>
            <strong>{record.aiAlertId}</strong>
          </div>

          <div>
            <span>Last updated</span>
            <strong>{formatDateTime(record.updatedAt)}</strong>
          </div>
        </div>
      </section>

      <section className="field-verification-summary-grid">
        <article className="field-verification-summary-card">
          <span className="field-verification-summary-card__icon">
            <MapPin size={18} />
          </span>

          <div>
            <span>Parcel</span>
            <strong>{record.parcelId}</strong>
            <small>Survey {record.surveyNumber}</small>
          </div>
        </article>

        <article className="field-verification-summary-card">
          <span className="field-verification-summary-card__icon">
            <ClipboardCheck size={18} />
          </span>

          <div>
            <span>AI observation</span>
            <strong>{record.changeType}</strong>
            <small>{record.aiConfidence}% confidence</small>
          </div>
        </article>

        <article className="field-verification-summary-card">
          <span className="field-verification-summary-card__icon">
            <UserRound size={18} />
          </span>

          <div>
            <span>Assigned officer</span>
            <strong>{record.assignedOfficer}</strong>
            <small>Visit: {formatDate(record.visitDate)}</small>
          </div>
        </article>

        <article className="field-verification-summary-card">
          <span className="field-verification-summary-card__icon">
            <FileText size={18} />
          </span>

          <div>
            <span>Evidence</span>
            <strong>{availableEvidence.length} items</strong>
            <small>
              {record.photoCount} photos · {record.documentCount} documents
            </small>
          </div>
        </article>
      </section>

      <div className="field-verification-review__layout">
        <main className="field-verification-review__main">
          <section className="field-verification-panel">
            <div className="field-verification-panel__header">
              <div>
                <span className="field-verification-panel__eyebrow">
                  AI OBSERVATION
                </span>

                <h3>What triggered the verification?</h3>
              </div>

              <span className={severityClass(record.aiSeverity)}>
                {record.aiConfidence}% confidence
              </span>
            </div>

            <div className="field-verification-observation">
              <div className="field-verification-observation__icon">
                <Satellite size={22} />
              </div>

              <div>
                <strong>{record.changeType}</strong>

                <p>
                  The AI system identified a potential spatial change
                  associated with this parcel. This is an observation and
                  does not constitute a legal determination.
                </p>
              </div>
            </div>

            <div className="field-verification-facts">
              <div>
                <span>Parcel</span>
                <strong>{record.parcelId}</strong>
              </div>

              <div>
                <span>Survey number</span>
                <strong>{record.surveyNumber}</strong>
              </div>

              <div>
                <span>Acquisition case</span>
                <strong>{record.acquisitionCaseId}</strong>
              </div>

              <div>
                <span>Recorded right-holder</span>
                <strong>{record.recordedRightHolder}</strong>
              </div>

              <div>
                <span>District</span>
                <strong>{record.district}</strong>
              </div>

              <div>
                <span>Village</span>
                <strong>{record.village}</strong>
              </div>
            </div>
          </section>

          <section className="field-verification-panel">
            <div className="field-verification-panel__header">
              <div>
                <span className="field-verification-panel__eyebrow">
                  FIELD FINDINGS
                </span>

                <h3>What was observed on site?</h3>
              </div>

              <span className="field-verification-evidence-count">
                {record.photoCount} photos
              </span>
            </div>

            <div className="field-verification-findings">
              <article>
                <span>Observed change</span>
                <p>{record.findings.observedChange}</p>
              </article>

              <article>
                <span>Site condition</span>
                <p>{record.findings.siteCondition}</p>
              </article>

              <article>
                <span>Boundary observation</span>
                <p>{record.findings.boundaryObservation}</p>
              </article>

              <article>
                <span>Officer remarks</span>
                <p>{record.findings.officerRemarks}</p>
              </article>
            </div>
          </section>

          <section className="field-verification-panel">
            <div className="field-verification-panel__header">
              <div>
                <span className="field-verification-panel__eyebrow">
                  EVIDENCE
                </span>

                <h3>Submitted field evidence</h3>
              </div>

              <span className="field-verification-evidence-count">
                {availableEvidence.length} available
              </span>
            </div>

            <div className="field-verification-evidence-list">
              {availableEvidence.map((evidence) => (
                <article
                  key={evidence.id}
                  className="field-verification-evidence"
                >
                  <span className="field-verification-evidence__icon">
                    {evidenceIcon(evidence.type)}
                  </span>

                  <div className="field-verification-evidence__body">
                    <strong>{evidence.title}</strong>
                    <p>{evidence.description}</p>

                    <small>
                      {evidence.type.replaceAll("_", " ")} ·{" "}
                      {formatDateTime(evidence.capturedAt)} ·{" "}
                      {evidence.capturedBy}
                    </small>
                  </div>

                  <span className="field-verification-evidence__available">
                    Available
                  </span>
                </article>
              ))}
            </div>
          </section>

          {record.gpsCaptured && (
            <section className="field-verification-panel">
              <div className="field-verification-panel__header">
                <div>
                  <span className="field-verification-panel__eyebrow">
                    LOCATION EVIDENCE
                  </span>

                  <h3>GPS capture</h3>
                </div>

                <span className="field-verification-gps-status">
                  <CheckCircle2 size={15} />
                  Captured
                </span>
              </div>

              <div className="field-verification-gps">
                <div className="field-verification-gps__visual">
                  <MapPin size={30} />
                </div>

                <div>
                  <strong>Inspection location captured</strong>
                  <p>
                    Latitude: {record.gpsLatitude?.toFixed(5)}
                    <br />
                    Longitude: {record.gpsLongitude?.toFixed(5)}
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>

        <aside className="field-verification-review__side">
          <section className="field-verification-panel field-verification-panel--sticky">
            <div className="field-verification-panel__header">
              <div>
                <span className="field-verification-panel__eyebrow">
                  VERIFICATION
                </span>

                <h3>Review outcome</h3>
              </div>

              <ShieldCheck size={20} />
            </div>

            <div className="field-verification-current-status">
              <span>Current outcome</span>
              <strong>{outcomeLabel(record.outcome)}</strong>
            </div>

            <div className="field-verification-outcome-options">
              <button type="button" className="field-verification-outcome">
                <CheckCircle2 size={18} />
                <span>
                  <strong>Verified</strong>
                  <small>
                    Field evidence supports the observed change.
                  </small>
                </span>
              </button>

              <button type="button" className="field-verification-outcome">
                <XCircle size={18} />
                <span>
                  <strong>Not Confirmed</strong>
                  <small>
                    Field inspection does not confirm the AI observation.
                  </small>
                </span>
              </button>

              <button type="button" className="field-verification-outcome">
                <TriangleAlert size={18} />
                <span>
                  <strong>Further Review</strong>
                  <small>
                    Additional evidence or inspection is required.
                  </small>
                </span>
              </button>
            </div>

            <div className="field-verification-review-note">
              <Clock3 size={16} />

              <p>
                Outcome actions are currently demonstration controls.
                Production submission will require backend authorization,
                validation and audit logging.
              </p>
            </div>

            <button
              type="button"
              className="field-verification-submit"
              disabled
            >
              Submit Verification Outcome
            </button>
          </section>

          <section className="field-verification-panel">
            <div className="field-verification-panel__header">
              <div>
                <span className="field-verification-panel__eyebrow">
                  REVIEW NOTES
                </span>

                <h3>Current record note</h3>
              </div>
            </div>

            <p className="field-verification-review-note-text">
              {record.reviewRemarks}
            </p>
          </section>

          <section className="field-verification-panel">
            <div className="field-verification-panel__header">
              <div>
                <span className="field-verification-panel__eyebrow">
                  PROVENANCE
                </span>

                <h3>Evidence chain</h3>
              </div>
            </div>

            <div className="field-verification-provenance">
              <div>
                <span>AI Alert</span>
                <strong>{record.aiAlertId}</strong>
              </div>

              <div>
                <span>Field verification</span>
                <strong>{record.id}</strong>
              </div>

              <div>
                <span>Created</span>
                <strong>{formatDateTime(record.createdAt)}</strong>
              </div>

              <div>
                <span>Updated</span>
                <strong>{formatDateTime(record.updatedAt)}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default FieldVerificationReviewPage;