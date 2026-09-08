import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  MapPin,
  Satellite,
  ShieldCheck,
  UserCheck,
  XCircle,
  Clock3,
  ExternalLink,
  MessageSquareText,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import {
  findAIAlertReviewById,
  getAIAlertReviewMetrics,
} from "../features/satellite/utils/aiAlertReviewLookup";

import {
  findAIAlertReviewByAlertId,
} from "../features/satellite/utils/aiAlertReviewLookup";

import {
  getSatelliteAlerts,
} from "../features/satellite/utils/satelliteLookup";

import {
  updateAIAlertReview,
  addAIAlertReviewNote,
} from "../features/satellite/data/aiAlertReviewData";

import type {
  AIAlertReviewDecision,
  AIAlertReviewPriority,
} from "../features/satellite/types/aiAlertReview";

import type { AIChangeAlert } from "../features/satellite/types/satellite";

import "./ai-alert-review.css";

const decisionLabels: Record<AIAlertReviewDecision, string> = {
  PENDING: "Pending Review",
  CONFIRMED_CHANGE: "Confirmed Change",
  NO_CHANGE_CONFIRMED: "No Change Confirmed",
  INCONCLUSIVE: "Inconclusive",
  DISMISSED: "Dismissed",
};

const priorityLabels: Record<AIAlertReviewPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

const formatDate = (value?: string): string => {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getDecisionClass = (
  decision: AIAlertReviewDecision,
): string => {
  switch (decision) {
    case "CONFIRMED_CHANGE":
      return "decision-confirmed";

    case "NO_CHANGE_CONFIRMED":
      return "decision-no-change";

    case "INCONCLUSIVE":
      return "decision-inconclusive";

    case "DISMISSED":
      return "decision-dismissed";

    default:
      return "decision-pending";
  }
};

const getPriorityClass = (
  priority: AIAlertReviewPriority,
): string => {
  switch (priority) {
    case "CRITICAL":
      return "priority-critical";

    case "HIGH":
      return "priority-high";

    case "MEDIUM":
      return "priority-medium";

    default:
      return "priority-low";
  }
};

const getAlertById = (
  alerts: AIChangeAlert[],
  alertId: string,
): AIChangeAlert | undefined => {
  return alerts.find((alert) => alert.id === alertId);
};

export default function AIAlertReviewPage() {
  const navigate = useNavigate();
  const { reviewId, alertId } = useParams();

  const { user } = useAuth();

  const alerts = getSatelliteAlerts();

  const review = useMemo(() => {
    if (reviewId) {
      return findAIAlertReviewById(reviewId);
    }

    if (alertId) {
      return findAIAlertReviewByAlertId(alertId);
    }

    return undefined;
  }, [reviewId, alertId]);

  const alert = useMemo(() => {
    if (!review) {
      return undefined;
    }

    return getAlertById(alerts, review.alertId);
  }, [alerts, review]);

  const metrics = getAIAlertReviewMetrics();

  const [selectedDecision, setSelectedDecision] =
    useState<AIAlertReviewDecision>(
      review?.decision ?? "PENDING",
    );

  const [selectedPriority, setSelectedPriority] =
    useState<AIAlertReviewPriority>(
      review?.priority ?? "MEDIUM",
    );

  const [determination, setDetermination] = useState(
    review?.officerDetermination ?? "",
  );

  const [note, setNote] = useState("");

  const [showNoteComposer, setShowNoteComposer] =
    useState(false);

  const [savedMessage, setSavedMessage] =
    useState("");

  if (!review || !alert) {
    return (
      <main className="ai-review-page">
        <div className="ai-review-empty">
          <div className="ai-review-empty-icon">
            <AlertTriangle size={26} />
          </div>

          <h1>AI alert review unavailable</h1>

          <p>
            The requested review record could not be found in the
            current demonstration dataset.
          </p>

          <button
            type="button"
            className="ai-review-primary-button"
            onClick={() => navigate("/app/satellite")}
          >
            <ArrowLeft size={17} />
            Return to Satellite Intelligence
          </button>
        </div>
      </main>
    );
  }

  const handleSaveReview = () => {
    const updated = updateAIAlertReview(review.id, {
      decision: selectedDecision,
      priority: selectedPriority,
      officerDetermination:
        determination.trim() || undefined,
      reviewedAt:
        selectedDecision === "PENDING"
          ? review.reviewedAt
          : new Date().toISOString(),
      fieldVerificationRequired:
        selectedDecision === "INCONCLUSIVE"
          ? true
          : review.fieldVerificationRequired,
      nextAction:
        selectedDecision === "INCONCLUSIVE"
          ? "REQUEST_FIELD_VERIFICATION"
          : review.nextAction,
    });

    if (updated) {
      setSavedMessage(
        "Officer review saved in the current demonstration workspace.",
      );

      window.setTimeout(() => {
        setSavedMessage("");
      }, 3500);
    }
  };

  const handleAddNote = () => {
    if (!note.trim()) {
      return;
    }

    addAIAlertReviewNote({
      reviewId: review.id,
      authorId: user?.id ?? "DEMO-OFFICER",
      authorName: user?.name ?? "Demo Officer",
      authorDesignation:
        user?.designation ?? "Government Officer",
      note: note.trim(),
    });

    setNote("");
    setShowNoteComposer(false);

    setSavedMessage("Review note added.");

    window.setTimeout(() => {
      setSavedMessage("");
    }, 3000);
  };

  return (
    <main className="ai-review-page">
      <div className="ai-review-container">
        <div className="ai-review-breadcrumb">
          <Link to="/app/satellite">
            Satellite Intelligence
          </Link>

          <ChevronRight size={14} />

          <span>AI Alert Review</span>
        </div>

        <header className="ai-review-header">
          <div className="ai-review-header-copy">
            <button
              type="button"
              className="ai-review-back-button"
              onClick={() => navigate("/app/satellite")}
            >
              <ArrowLeft size={17} />
              Back to Satellite Intelligence
            </button>

            <div className="ai-review-eyebrow">
              <span className="ai-review-eyebrow-dot" />
              AI INTELLIGENCE REVIEW
            </div>

            <h1>{alert.title}</h1>

            <p>
              Review the machine-generated observation, supporting
              evidence, and determine the appropriate human-led
              next action.
            </p>
          </div>

          <div className="ai-review-header-status">
            <span
              className={`ai-review-status-badge ${getDecisionClass(
                review.decision,
              )}`}
            >
              {review.decision === "CONFIRMED_CHANGE" ? (
                <CheckCircle2 size={15} />
              ) : review.decision === "DISMISSED" ? (
                <XCircle size={15} />
              ) : (
                <Clock3 size={15} />
              )}

              {decisionLabels[review.decision]}
            </span>

            <span
              className={`ai-review-priority-badge ${getPriorityClass(
                review.priority,
              )}`}
            >
              {priorityLabels[review.priority]} priority
            </span>
          </div>
        </header>

        {savedMessage && (
          <div className="ai-review-save-banner">
            <CheckCircle2 size={17} />
            {savedMessage}
          </div>
        )}

        <section className="ai-review-safeguard">
          <div className="ai-review-safeguard-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <strong>Human verification required</strong>

            <p>
              This alert represents an AI-generated observation.
              It does not establish ownership, encroachment,
              acquisition status, or any legal fact. Officer
              determination and field evidence remain authoritative
              for operational decisions.
            </p>
          </div>
        </section>

        <section className="ai-review-grid">
          <div className="ai-review-main-column">
            <article className="ai-review-card ai-review-detection-card">
              <div className="ai-review-card-header">
                <div>
                  <span className="ai-review-card-kicker">
                    MACHINE OBSERVATION
                  </span>

                  <h2>What the AI detected</h2>
                </div>

                <div className="ai-review-confidence">
                  <span>AI confidence</span>
                  <strong>{alert.confidencePercentage}%</strong>
                </div>
              </div>

              <div className="ai-review-detection-summary">
                <div className="ai-review-detection-icon">
                  <Satellite size={22} />
                </div>

                <div>
                  <strong>{alert.changeType.replaceAll("_", " ")}</strong>

                  <p>{alert.description}</p>
                </div>
              </div>

              <div className="ai-review-confidence-track">
                <div
                  className="ai-review-confidence-fill"
                  style={{
                    width: `${Math.min(
                      Math.max(alert.confidencePercentage, 0),
                      100,
                    )}%`,
                  }}
                />
              </div>

              <div className="ai-review-confidence-scale">
                <span>Lower confidence</span>
                <span>Higher confidence</span>
              </div>
            </article>

            <article className="ai-review-card">
              <div className="ai-review-card-header">
                <div>
                  <span className="ai-review-card-kicker">
                    MODEL EXPLANATION
                  </span>

                  <h2>Why was this alert generated?</h2>
                </div>

                <AlertTriangle size={20} />
              </div>

              <div className="ai-review-explanation-list">
                {alert.explanation.map((item, index) => (
                  <div
                    className="ai-review-explanation-item"
                    key={`${alert.id}-explanation-${index}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>

                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="ai-review-card">
              <div className="ai-review-card-header">
                <div>
                  <span className="ai-review-card-kicker">
                    SUPPORTING EVIDENCE
                  </span>

                  <h2>Evidence available for review</h2>
                </div>
              </div>

              <div className="ai-review-evidence-list">
                {review.evidence.map((evidence) => (
                  <div
                    className="ai-review-evidence-item"
                    key={evidence.id}
                  >
                    <div className="ai-review-evidence-icon">
                      {evidence.type === "SATELLITE_COMPARISON" ? (
                        <Satellite size={18} />
                      ) : evidence.type === "FIELD_EVIDENCE" ? (
                        <ClipboardCheck size={18} />
                      ) : evidence.type === "DOCUMENT" ? (
                        <FileText size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                    </div>

                    <div className="ai-review-evidence-copy">
                      <strong>{evidence.title}</strong>

                      <p>{evidence.description}</p>

                      {evidence.referenceId && (
                        <span>
                          Reference: {evidence.referenceId}
                        </span>
                      )}
                    </div>

                    {evidence.available && (
                      <button
                        type="button"
                        className="ai-review-evidence-action"
                        onClick={() => {
                          if (
                            evidence.type ===
                            "SATELLITE_COMPARISON"
                          ) {
                            navigate(
                              "/app/satellite/comparison",
                            );
                          }
                        }}
                      >
                        Open
                        <ExternalLink size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </article>

            <article className="ai-review-card">
              <div className="ai-review-card-header">
                <div>
                  <span className="ai-review-card-kicker">
                    OFFICER DETERMINATION
                  </span>

                  <h2>Record review outcome</h2>
                </div>

                <UserCheck size={20} />
              </div>

              <div className="ai-review-form">
                <div className="ai-review-form-group">
                  <label htmlFor="review-decision">
                    Determination
                  </label>

                  <select
                    id="review-decision"
                    value={selectedDecision}
                    onChange={(event) =>
                      setSelectedDecision(
                        event.target.value as AIAlertReviewDecision,
                      )
                    }
                  >
                    {Object.entries(decisionLabels).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="ai-review-form-group">
                  <label htmlFor="review-priority">
                    Review priority
                  </label>

                  <select
                    id="review-priority"
                    value={selectedPriority}
                    onChange={(event) =>
                      setSelectedPriority(
                        event.target.value as AIAlertReviewPriority,
                      )
                    }
                  >
                    {Object.entries(priorityLabels).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="ai-review-form-group ai-review-form-full">
                  <label htmlFor="officer-determination">
                    Officer determination
                  </label>

                  <textarea
                    id="officer-determination"
                    rows={5}
                    value={determination}
                    onChange={(event) =>
                      setDetermination(event.target.value)
                    }
                    placeholder="Record the evidence-based determination made after reviewing the available information."
                  />

                  <span className="ai-review-field-hint">
                    Keep the determination evidence-based. Do not
                    treat the AI confidence score as a legal finding.
                  </span>
                </div>

                <div className="ai-review-form-actions">
                  <button
                    type="button"
                    className="ai-review-secondary-button"
                    onClick={() =>
                      setSelectedDecision("INCONCLUSIVE")
                    }
                  >
                    Request Field Verification
                  </button>

                  <button
                    type="button"
                    className="ai-review-primary-button"
                    onClick={handleSaveReview}
                  >
                    <CheckCircle2 size={17} />
                    Save Determination
                  </button>
                </div>
              </div>
            </article>
          </div>

          <aside className="ai-review-side-column">
            <article className="ai-review-card ai-review-context-card">
              <div className="ai-review-card-header">
                <div>
                  <span className="ai-review-card-kicker">
                    ALERT CONTEXT
                  </span>

                  <h2>Linked records</h2>
                </div>
              </div>

              <div className="ai-review-context-list">
                <div>
                  <span>Alert ID</span>
                  <strong>{alert.id}</strong>
                </div>

                <div>
                  <span>Project</span>
                  <strong>
                    {alert.projectName ?? "Not linked"}
                  </strong>
                </div>

                <div>
                  <span>District</span>
                  <strong>
                    {alert.district ?? "Not recorded"}
                  </strong>
                </div>

                <div>
                  <span>Parcel</span>
                  <strong>
                    {alert.parcelId ?? "Not linked"}
                  </strong>
                </div>

                <div>
                  <span>Detected</span>
                  <strong>{formatDate(alert.detectedDate)}</strong>
                </div>

                <div>
                  <span>Change area</span>
                  <strong>
                    {alert.changedAreaHectares
                      ? `${alert.changedAreaHectares} ha`
                      : "Not estimated"}
                  </strong>
                </div>
              </div>
            </article>

            <article className="ai-review-card">
              <div className="ai-review-card-header">
                <div>
                  <span className="ai-review-card-kicker">
                    REVIEW ASSIGNMENT
                  </span>

                  <h2>Responsible officer</h2>
                </div>

                <UserCheck size={20} />
              </div>

              <div className="ai-review-officer">
                <div className="ai-review-officer-avatar">
                  {(review.assignedOfficerName ?? "O")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>
                    {review.assignedOfficerName ??
                      "Unassigned"}
                  </strong>

                  <p>
                    {review.assignedOfficerDesignation ??
                      "Officer assignment pending"}
                  </p>
                </div>
              </div>

              <div className="ai-review-assignment-meta">
                <div>
                  <span>Last reviewed</span>
                  <strong>
                    {formatDate(review.reviewedAt)}
                  </strong>
                </div>

                <div>
                  <span>Review priority</span>
                  <strong>
                    {priorityLabels[review.priority]}
                  </strong>
                </div>
              </div>
            </article>

            <article className="ai-review-card ai-review-next-action">
              <div className="ai-review-card-header">
                <div>
                  <span className="ai-review-card-kicker">
                    RECOMMENDED NEXT ACTION
                  </span>

                  <h2>Operational follow-up</h2>
                </div>
              </div>

              <div className="ai-review-next-action-body">
                <ClipboardCheck size={21} />

                <p>
                  {alert.recommendedAction}
                </p>
              </div>

              <button
                type="button"
                className="ai-review-full-button"
                onClick={() =>
                  navigate("/app/satellite/comparison")
                }
              >
                Open Temporal Comparison
                <ChevronRight size={16} />
              </button>
            </article>

            <article className="ai-review-card">
              <div className="ai-review-card-header">
                <div>
                  <span className="ai-review-card-kicker">
                    REVIEW NOTES
                  </span>

                  <h2>Officer notes</h2>
                </div>

                <MessageSquareText size={19} />
              </div>

              <div className="ai-review-notes">
                {review.notes.length === 0 ? (
                  <div className="ai-review-no-notes">
                    No officer notes have been recorded.
                  </div>
                ) : (
                  review.notes.map((reviewNote) => (
                    <div
                      className="ai-review-note"
                      key={reviewNote.id}
                    >
                      <div className="ai-review-note-meta">
                        <strong>
                          {reviewNote.authorName}
                        </strong>

                        <span>
                          {formatDate(reviewNote.createdAt)}
                        </span>
                      </div>

                      <p>{reviewNote.note}</p>
                    </div>
                  ))
                )}
              </div>

              {showNoteComposer ? (
                <div className="ai-review-note-composer">
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(event) =>
                      setNote(event.target.value)
                    }
                    placeholder="Add a review note..."
                  />

                  <div className="ai-review-note-actions">
                    <button
                      type="button"
                      className="ai-review-text-button"
                      onClick={() => {
                        setNote("");
                        setShowNoteComposer(false);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="ai-review-primary-button"
                      onClick={handleAddNote}
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="ai-review-full-button ai-review-note-button"
                  onClick={() => setShowNoteComposer(true)}
                >
                  <MessageSquareText size={16} />
                  Add Review Note
                </button>
              )}
            </article>

            <article className="ai-review-card ai-review-location-card">
              <div className="ai-review-location-icon">
                <MapPin size={19} />
              </div>

              <div>
                <span>Linked geography</span>

                <strong>
                  {alert.district ?? "Jurisdiction not recorded"}
                </strong>

                <p>
                  Parcel-level context will be connected to the
                  authoritative GIS and land-record services in the
                  backend integration layer.
                </p>
              </div>
            </article>

            <div className="ai-review-mini-metrics">
              <div>
                <strong>{metrics.total}</strong>
                <span>Total reviews</span>
              </div>

              <div>
                <strong>{metrics.pending}</strong>
                <span>Pending</span>
              </div>

              <div>
                <strong>{metrics.fieldVerificationRequired}</strong>
                <span>Field verification</span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}