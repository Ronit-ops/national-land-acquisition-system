export type AwardStatus =
  | "NOT_STARTED"
  | "UNDER_PREPARATION"
  | "PASSED"
  | "CHALLENGED";

export type PaymentStatus =
  | "NOT_DUE"
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "ON_HOLD";

export type CompensationRecord = {
  id: string;
  acquisitionCaseId: string;
  parcelId: string;
  surveyNumber: string;
  recordedRightHolder: string;
  district: string;
  village: string;

  valuationAmount: number;
  awardAmount: number;
  awardStatus: AwardStatus;
  awardDate: string | null;

  compensationAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: PaymentStatus;
  paymentDate: string | null;

  rrLinked: boolean;
  possessionReady: boolean;
};
