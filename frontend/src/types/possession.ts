export type PossessionStatus =
  | "NOT_READY"
  | "READY_FOR_HANDOVER"
  | "HANDOVER_SCHEDULED"
  | "POSSESSION_COMPLETED"
  | "ON_HOLD";

export type PossessionVerificationStatus =
  | "NOT_VERIFIED"
  | "FIELD_VERIFICATION_PENDING"
  | "FIELD_VERIFIED";

export type PossessionRecord = {
  id: string;

  acquisitionCaseId: string;
  parcelId: string;
  surveyNumber: string;

  recordedRightHolder: string;

  district: string;
  village: string;

  awardStatus: string;
  compensationStatus: string;
  rrStatus: string;

  possessionStatus: PossessionStatus;
  verificationStatus: PossessionVerificationStatus;

  possessionNoticeDate: string | null;
  scheduledHandoverDate: string | null;
  possessionDate: string | null;

  handoverAuthority: string | null;

  pendingAction: string;
  blockingReason: string | null;

  siteVerified: boolean;
};