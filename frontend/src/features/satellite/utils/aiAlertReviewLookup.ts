import type {
  AIAlertReview,
  AIAlertReviewDecision,
  AIAlertReviewPriority,
  AIAlertReviewSummary,
} from "../types/aiAlertReview";

import {
  getAIAlertReviewByAlertId,
  getAIAlertReviewById,
  getAIAlertReviewSummary,
  getAIAlertReviews,
} from "../data/aiAlertReviewData";

export interface AIAlertReviewScope {
  jurisdiction?: string;
  jurisdictionType?: string;
}

export interface AIAlertReviewFilters {
  decision?: AIAlertReviewDecision;
  priority?: AIAlertReviewPriority;
  assignedOfficerId?: string;
  fieldVerificationRequired?: boolean;
}

const matchesScope = (
  review: AIAlertReview,
  _scope?: AIAlertReviewScope,
): boolean => {
  /*
   * Current demo review records do not yet carry authoritative
   * district/project identifiers.
   *
   * Therefore scope filtering is intentionally conservative.
   * Once backend records contain jurisdiction identifiers,
   * this function becomes the enforcement point for scoped review data.
   */
  void review;

  return true;
};

export const getScopedAIAlertReviews = (
  scope?: AIAlertReviewScope,
  filters?: AIAlertReviewFilters,
): AIAlertReview[] => {
  return getAIAlertReviews().filter((review) => {
    if (!matchesScope(review, scope)) {
      return false;
    }

    if (
      filters?.decision &&
      review.decision !== filters.decision
    ) {
      return false;
    }

    if (
      filters?.priority &&
      review.priority !== filters.priority
    ) {
      return false;
    }

    if (
      filters?.assignedOfficerId &&
      review.assignedOfficerId !== filters.assignedOfficerId
    ) {
      return false;
    }

    if (
      filters?.fieldVerificationRequired !== undefined &&
      review.fieldVerificationRequired !==
        filters.fieldVerificationRequired
    ) {
      return false;
    }

    return true;
  });
};

export const findAIAlertReviewById = (
  reviewId: string,
): AIAlertReview | undefined => {
  return getAIAlertReviewById(reviewId);
};

export const findAIAlertReviewByAlertId = (
  alertId: string,
): AIAlertReview | undefined => {
  return getAIAlertReviewByAlertId(alertId);
};

export const getPendingAIAlertReviews = (
  scope?: AIAlertReviewScope,
): AIAlertReview[] => {
  return getScopedAIAlertReviews(scope, {
    decision: "PENDING",
  });
};

export const getFieldVerificationReviews = (
  scope?: AIAlertReviewScope,
): AIAlertReview[] => {
  return getScopedAIAlertReviews(scope, {
    fieldVerificationRequired: true,
  });
};

export const getHighPriorityAIAlertReviews = (
  scope?: AIAlertReviewScope,
): AIAlertReview[] => {
  return getScopedAIAlertReviews(scope).filter(
    (review) =>
      review.priority === "HIGH" ||
      review.priority === "CRITICAL",
  );
};

export const getAIAlertReviewMetrics = (
  _scope?: AIAlertReviewScope,
): AIAlertReviewSummary => {
  /*
   * The demo dataset is currently aggregated.
   * This lookup function gives the UI a stable contract that can
   * later become jurisdiction-aware without changing page code.
   */
  return getAIAlertReviewSummary();
};