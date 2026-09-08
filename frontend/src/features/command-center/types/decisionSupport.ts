export type DecisionPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type DecisionStatus =
  | "OPEN"
  | "IN_REVIEW"
  | "ACTION_REQUIRED"
  | "RESOLVED";

export type DecisionCategory =
  | "ACQUISITION"
  | "COMPENSATION"
  | "R_AND_R"
  | "POSSESSION"
  | "DOCUMENT"
  | "FIELD_VERIFICATION"
  | "SATELLITE"
  | "AI_ALERT"
  | "PROJECT";

export type DecisionActionType =
  | "REVIEW"
  | "VERIFY"
  | "OPEN_CASE"
  | "VIEW_DOCUMENT"
  | "VIEW_PROJECT"
  | "VIEW_ALERT";

export type DecisionSupportItem = {
  id: string;

  title: string;

  description: string;

  priority: DecisionPriority;

  status: DecisionStatus;

  category: DecisionCategory;

  actionType: DecisionActionType;

  route: string;

  districtId?: string;

  projectId?: string;

  caseId?: string;

  parcelId?: string;

  createdAt: string;

  dueAt?: string;

  supportingValue?: string;

  supportingLabel?: string;
};

export type DecisionSupportSummary = {
  total: number;

  critical: number;

  high: number;

  medium: number;

  low: number;

  actionRequired: number;

  overdue: number;
};