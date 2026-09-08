import type {
  AIAlertReview,
  AIAlertReviewEvidence,
  AIAlertReviewNote,
  CreateAIAlertReviewInput,
  UpdateAIAlertReviewInput,
  AddAIAlertReviewNoteInput,
} from "../types/aiAlertReview";

const createEvidence = (
  evidence: AIAlertReviewEvidence,
): AIAlertReviewEvidence => evidence;

const createNote = (
  note: AIAlertReviewNote,
): AIAlertReviewNote => note;

export const initialAIAlertReviews: AIAlertReview[] = [
  {
    id: "AIR-REV-001",
    alertId: "AI-ALERT-001",
    decision: "PENDING",
    priority: "HIGH",

    assignedOfficerId: "GOV-FVO-001",
    assignedOfficerName: "Sanjay Patil",
    assignedOfficerDesignation: "Field Verification Officer",

    reviewSummary:
      "Satellite imagery indicates a potential surface and land-use change within the monitored parcel. Officer review is pending.",

    nextAction: "REVIEW_COMPARISON",

    fieldVerificationRequired: false,

    evidence: [
      createEvidence({
        id: "EVD-001",
        type: "SATELLITE_COMPARISON",
        title: "Before / After Satellite Comparison",
        description:
          "Temporal comparison between the available before and after observations for the detected change.",
        referenceId: "SAT-CMP-001",
        available: true,
      }),
      createEvidence({
        id: "EVD-002",
        type: "SATELLITE_OBSERVATION",
        title: "Latest Satellite Observation",
        description:
          "Latest processed satellite observation associated with the alert.",
        referenceId: "SAT-OBS-004",
        available: true,
      }),
      createEvidence({
        id: "EVD-003",
        type: "PARCEL_RECORD",
        title: "Linked Parcel Record",
        description:
          "Parcel information associated with the detected area.",
        referenceId: "PARCEL-PN-001",
        available: true,
      }),
    ],

    notes: [],

    createdAt: "2026-09-05T09:15:00Z",
    updatedAt: "2026-09-05T09:15:00Z",
  },

  {
    id: "AIR-REV-002",
    alertId: "AI-ALERT-002",
    decision: "INCONCLUSIVE",
    priority: "MEDIUM",

    assignedOfficerId: "GOV-DLAO-001",
    assignedOfficerName: "Anil Deshmukh",
    assignedOfficerDesignation: "District Land Acquisition Officer",

    reviewedAt: "2026-09-04T11:30:00Z",

    reviewSummary:
      "The observed change is visible in the temporal imagery, but available imagery quality is insufficient to determine the nature of the change with confidence.",

    officerDetermination:
      "Change appears present, but its land-use classification cannot be confirmed from the available evidence.",

    nextAction: "REQUEST_FIELD_VERIFICATION",

    fieldVerificationRequired: true,
    fieldVerificationId: "FV-2026-002",

    evidence: [
      createEvidence({
        id: "EVD-004",
        type: "SATELLITE_COMPARISON",
        title: "Temporal Change Comparison",
        description:
          "Before and after imagery showing the area flagged by the change-detection model.",
        referenceId: "SAT-CMP-002",
        available: true,
      }),
      createEvidence({
        id: "EVD-005",
        type: "SATELLITE_OBSERVATION",
        title: "Cloud-affected Observation",
        description:
          "The latest observation has reduced interpretability because of image-quality limitations.",
        referenceId: "SAT-OBS-006",
        available: true,
      }),
    ],

    notes: [
      createNote({
        id: "NOTE-002",
        authorId: "GOV-DLAO-001",
        authorName: "Anil Deshmukh",
        authorDesignation: "District Land Acquisition Officer",
        note:
          "Request field verification before treating the observed change as confirmed.",
        createdAt: "2026-09-04T11:30:00Z",
      }),
    ],

    createdAt: "2026-09-03T08:45:00Z",
    updatedAt: "2026-09-04T11:30:00Z",
  },

  {
    id: "AIR-REV-003",
    alertId: "AI-ALERT-003",
    decision: "CONFIRMED_CHANGE",
    priority: "HIGH",

    assignedOfficerId: "GOV-FVO-001",
    assignedOfficerName: "Sanjay Patil",
    assignedOfficerDesignation: "Field Verification Officer",

    reviewedAt: "2026-09-02T14:20:00Z",

    reviewSummary:
      "The detected construction-related change is visible in the temporal imagery and has been supported by field evidence.",

    officerDetermination:
      "Physical change is confirmed based on satellite comparison and field verification evidence.",

    nextAction: "VIEW_EVIDENCE",

    fieldVerificationRequired: true,
    fieldVerificationId: "FV-2026-001",

    evidence: [
      createEvidence({
        id: "EVD-006",
        type: "SATELLITE_COMPARISON",
        title: "Construction Change Comparison",
        description:
          "Temporal imagery showing the change detected between the selected observation dates.",
        referenceId: "SAT-CMP-003",
        available: true,
      }),
      createEvidence({
        id: "EVD-007",
        type: "FIELD_EVIDENCE",
        title: "Field Verification Record",
        description:
          "Officer-submitted field evidence supporting the observed physical change.",
        referenceId: "FV-2026-001",
        available: true,
      }),
      createEvidence({
        id: "EVD-008",
        type: "PARCEL_RECORD",
        title: "Linked Parcel Record",
        description:
          "Parcel record associated with the detected construction change.",
        referenceId: "PARCEL-NK-001",
        available: true,
      }),
    ],

    notes: [
      createNote({
        id: "NOTE-003",
        authorId: "GOV-FVO-001",
        authorName: "Sanjay Patil",
        authorDesignation: "Field Verification Officer",
        note:
          "Field inspection supports the presence of the physical change identified in the satellite comparison.",
        createdAt: "2026-09-02T14:20:00Z",
      }),
    ],

    createdAt: "2026-09-01T10:10:00Z",
    updatedAt: "2026-09-02T14:20:00Z",
  },

  {
    id: "AIR-REV-004",
    alertId: "AI-ALERT-004",
    decision: "NO_CHANGE_CONFIRMED",
    priority: "LOW",

    assignedOfficerId: "GOV-REV-001",
    assignedOfficerName: "Priya Joshi",
    assignedOfficerDesignation: "Revenue Officer",

    reviewedAt: "2026-08-31T10:05:00Z",

    reviewSummary:
      "The apparent difference was reviewed against the available temporal imagery and was determined not to represent a material physical change.",

    officerDetermination:
      "No material physical change confirmed from the available evidence.",

    nextAction: "DISMISS_ALERT",

    fieldVerificationRequired: false,

    evidence: [
      createEvidence({
        id: "EVD-009",
        type: "SATELLITE_COMPARISON",
        title: "Temporal Comparison",
        description:
          "Before and after observations reviewed by the officer.",
        referenceId: "SAT-CMP-004",
        available: true,
      }),
    ],

    notes: [
      createNote({
        id: "NOTE-004",
        authorId: "GOV-REV-001",
        authorName: "Priya Joshi",
        authorDesignation: "Revenue Officer",
        note:
          "Observed variation appears attributable to imagery conditions rather than a material physical change.",
        createdAt: "2026-08-31T10:05:00Z",
      }),
    ],

    createdAt: "2026-08-30T09:00:00Z",
    updatedAt: "2026-08-31T10:05:00Z",
  },
];

let aiAlertReviews: AIAlertReview[] = [...initialAIAlertReviews];

const generateReviewId = (): string => {
  return `AIR-REV-${String(aiAlertReviews.length + 1).padStart(3, "0")}`;
};

const generateNoteId = (review: AIAlertReview): string => {
  return `NOTE-${String(review.notes.length + 1).padStart(3, "0")}`;
};

export const getAIAlertReviews = (): AIAlertReview[] => {
  return [...aiAlertReviews];
};

export const getAIAlertReviewById = (
  reviewId: string,
): AIAlertReview | undefined => {
  return aiAlertReviews.find((review) => review.id === reviewId);
};

export const getAIAlertReviewByAlertId = (
  alertId: string,
): AIAlertReview | undefined => {
  return aiAlertReviews.find((review) => review.alertId === alertId);
};

export const getAIAlertReviewsByDecision = (
  decision: AIAlertReview["decision"],
): AIAlertReview[] => {
  return aiAlertReviews.filter((review) => review.decision === decision);
};

export const getAIAlertReviewsByPriority = (
  priority: AIAlertReview["priority"],
): AIAlertReview[] => {
  return aiAlertReviews.filter((review) => review.priority === priority);
};

export const getAIAlertReviewSummary = () => {
  const total = aiAlertReviews.length;

  const pending = aiAlertReviews.filter(
    (review) => review.decision === "PENDING",
  ).length;

  const confirmedChanges = aiAlertReviews.filter(
    (review) => review.decision === "CONFIRMED_CHANGE",
  ).length;

  const fieldVerificationRequired = aiAlertReviews.filter(
    (review) => review.fieldVerificationRequired,
  ).length;

  const inconclusive = aiAlertReviews.filter(
    (review) => review.decision === "INCONCLUSIVE",
  ).length;

  const dismissed = aiAlertReviews.filter(
    (review) =>
      review.decision === "DISMISSED" ||
      review.decision === "NO_CHANGE_CONFIRMED",
  ).length;

  const highPriority = aiAlertReviews.filter(
    (review) =>
      review.priority === "HIGH" || review.priority === "CRITICAL",
  ).length;

  return {
    total,
    pending,
    confirmedChanges,
    fieldVerificationRequired,
    inconclusive,
    dismissed,
    highPriority,
  };
};

export const createAIAlertReview = (
  input: CreateAIAlertReviewInput,
): AIAlertReview => {
  const now = new Date().toISOString();

  const review: AIAlertReview = {
    id: generateReviewId(),
    alertId: input.alertId,

    decision: "PENDING",

    priority: input.priority,

    assignedOfficerId: input.assignedOfficerId,
    assignedOfficerName: input.assignedOfficerName,
    assignedOfficerDesignation: input.assignedOfficerDesignation,

    reviewSummary: input.reviewSummary,
    officerDetermination: input.officerDetermination,

    nextAction: input.nextAction,

    fieldVerificationRequired:
      input.fieldVerificationRequired ?? false,

    evidence: [],

    notes: [],

    createdAt: now,
    updatedAt: now,
  };

  aiAlertReviews = [...aiAlertReviews, review];

  return review;
};

export const updateAIAlertReview = (
  reviewId: string,
  input: UpdateAIAlertReviewInput,
): AIAlertReview | undefined => {
  const existingReview = aiAlertReviews.find(
    (review) => review.id === reviewId,
  );

  if (!existingReview) {
    return undefined;
  }

  const updatedReview: AIAlertReview = {
    ...existingReview,

    decision: input.decision ?? existingReview.decision,

    priority: input.priority ?? existingReview.priority,

    reviewSummary:
      input.reviewSummary ?? existingReview.reviewSummary,

    officerDetermination:
      input.officerDetermination ??
      existingReview.officerDetermination,

    nextAction:
      input.nextAction ?? existingReview.nextAction,

    fieldVerificationRequired:
      input.fieldVerificationRequired ??
      existingReview.fieldVerificationRequired,

    fieldVerificationId:
      input.fieldVerificationId ??
      existingReview.fieldVerificationId,

    reviewedAt:
      input.reviewedAt ??
      existingReview.reviewedAt,

    updatedAt: new Date().toISOString(),
  };

  aiAlertReviews = aiAlertReviews.map((review) =>
    review.id === reviewId ? updatedReview : review,
  );

  return updatedReview;
};

export const addAIAlertReviewNote = (
  input: AddAIAlertReviewNoteInput,
): AIAlertReview | undefined => {
  const existingReview = aiAlertReviews.find(
    (review) => review.id === input.reviewId,
  );

  if (!existingReview) {
    return undefined;
  }

  const note: AIAlertReviewNote = {
    id: generateNoteId(existingReview),
    authorId: input.authorId,
    authorName: input.authorName,
    authorDesignation: input.authorDesignation,
    note: input.note,
    createdAt: new Date().toISOString(),
  };

  const updatedReview: AIAlertReview = {
    ...existingReview,
    notes: [...existingReview.notes, note],
    updatedAt: new Date().toISOString(),
  };

  aiAlertReviews = aiAlertReviews.map((review) =>
    review.id === input.reviewId ? updatedReview : review,
  );

  return updatedReview;
};

export const resetAIAlertReviews = (): void => {
  aiAlertReviews = [...initialAIAlertReviews];
};