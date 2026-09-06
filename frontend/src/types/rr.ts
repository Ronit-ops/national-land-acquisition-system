export type RRStatus =
  | "NOT_STARTED"
  | "ENTITLEMENT_IDENTIFIED"
  | "UNDER_IMPLEMENTATION"
  | "COMPLETED"
  | "ON_HOLD";

export type RelocationStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export type RehabilitationStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type RRRecord = {
  id: string;
  acquisitionCaseId: string;
  parcelId: string;
  recordedRightHolder: string;

  affectedFamilyCount: number;
  rrCategory: string;
  entitlementStatus: string;

  assistanceAmount: number;
  rrPackage: string;

  relocationStatus: RelocationStatus;
  rehabilitationStatus: RehabilitationStatus;
  rrStatus: RRStatus;

  pendingAction: string;
  targetDate: string | null;
};
