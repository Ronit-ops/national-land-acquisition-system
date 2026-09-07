export type CitizenCaseStage =
  | "PROJECT_REGISTERED"
  | "LAND_IDENTIFICATION"
  | "PRELIMINARY_NOTIFICATION"
  | "OBJECTION"
  | "HEARING"
  | "DECLARATION"
  | "VALUATION"
  | "AWARD"
  | "COMPENSATION"
  | "R_AND_R"
  | "POSSESSION"
  | "CLOSED";

export type CitizenCaseStatus =
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "CLOSED";

export type CitizenNotificationStatus =
  | "NOT_ISSUED"
  | "ISSUED"
  | "SERVED"
  | "ACKNOWLEDGED";

export type CitizenObjectionStatus =
  | "NOT_FILED"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "HEARING_SCHEDULED"
  | "HEARD"
  | "DISPOSED";

export type CitizenHearingStatus =
  | "NOT_SCHEDULED"
  | "SCHEDULED"
  | "COMPLETED"
  | "ADJOURNED";

export type CitizenAwardStatus =
  | "NOT_STARTED"
  | "UNDER_PREPARATION"
  | "PASSED"
  | "CHALLENGED";

export type CitizenPaymentStatus =
  | "NOT_DUE"
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "ON_HOLD";

export type CitizenRRStatus =
  | "NOT_STARTED"
  | "ENTITLEMENT_IDENTIFIED"
  | "UNDER_IMPLEMENTATION"
  | "COMPLETED"
  | "ON_HOLD";

export type CitizenPossessionStatus =
  | "NOT_READY"
  | "READY_FOR_HANDOVER"
  | "HANDOVER_SCHEDULED"
  | "POSSESSION_COMPLETED"
  | "ON_HOLD";

export type CitizenTimelineItem = {
  id: string;
  stage: CitizenCaseStage;
  title: string;
  description: string;
  date: string | null;
  completed: boolean;
  current: boolean;
};

export type CitizenNotice = {
  id: string;
  type: string;
  title: string;
  issueDate: string | null;
  serviceDate: string | null;
  status: CitizenNotificationStatus;
  referenceNumber: string;
};

export type CitizenObjection = {
  id: string | null;
  submittedDate: string | null;
  category: string | null;
  status: CitizenObjectionStatus;
  hearingRequired: boolean;
};

export type CitizenHearing = {
  id: string | null;
  hearingDate: string | null;
  venue: string | null;
  mode: "IN_PERSON" | "VIRTUAL" | "HYBRID" | null;
  status: CitizenHearingStatus;
};

export type CitizenAward = {
  status: CitizenAwardStatus;
  awardDate: string | null;
  referenceNumber: string | null;
};

export type CitizenCompensation = {
  status: CitizenPaymentStatus;
  awardedAmount: number | null;
  paidAmount: number;
  pendingAmount: number | null;
  paymentDate: string | null;
};

export type CitizenRR = {
  status: CitizenRRStatus;
  assistanceAmount: number | null;
  packageDescription: string | null;
  relocationStatus: string;
  rehabilitationStatus: string;
};

export type CitizenPossession = {
  status: CitizenPossessionStatus;
  noticeDate: string | null;
  scheduledDate: string | null;
  possessionDate: string | null;
};

export type CitizenParcel = {
  parcelId: string;
  surveyNumber: string;
  district: string;
  village: string;
  areaHectares: number;
  landUse: string;
};

export type CitizenCaseRecord = {
  id: string;
  caseReference: string;
  projectName: string;
  projectAuthority: string;
  district: string;
  village: string;

  /*
   * Citizen-visible identity information only.
   * This represents the recorded right-holder label available
   * to the authenticated citizen for the demo case.
   */
  recordedRightHolder: string;

  parcel: CitizenParcel;

  currentStage: CitizenCaseStage;
  status: CitizenCaseStatus;

  notification: CitizenNotice;
  objection: CitizenObjection;
  hearing: CitizenHearing;
  award: CitizenAward;
  compensation: CitizenCompensation;
  rr: CitizenRR;
  possession: CitizenPossession;

  timeline: CitizenTimelineItem[];

  lastUpdated: string;
};