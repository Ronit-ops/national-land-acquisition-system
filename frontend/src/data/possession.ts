import type { PossessionRecord } from "../types/possession";

export const possessionRecords: PossessionRecord[] = [
  {
    id: "POS-PUN-2026-001",

    acquisitionCaseId: "ACQ-PUN-2026-00421",
    parcelId: "PUN-001245",
    surveyNumber: "145/2A",

    recordedRightHolder: "Rajesh Kumar",

    district: "Pune",
    village: "Wagholi",

    awardStatus: "Award Passed",
    compensationStatus: "Partially Paid",
    rrStatus: "Under Implementation",

    possessionStatus: "NOT_READY",
    verificationStatus: "FIELD_VERIFICATION_PENDING",

    possessionNoticeDate: "2026-08-25",
    scheduledHandoverDate: null,
    possessionDate: null,

    handoverAuthority: null,

    pendingAction: "Complete R&R relocation assistance",
    blockingReason: "R&R relocation assistance is still pending",

    siteVerified: false,
  },

  {
    id: "POS-PUN-2026-002",

    acquisitionCaseId: "ACQ-PUN-2026-00422",
    parcelId: "PUN-001246",
    surveyNumber: "146/1",

    recordedRightHolder: "Meena Patil",

    district: "Pune",
    village: "Kharadi",

    awardStatus: "Under Preparation",
    compensationStatus: "Not Due",
    rrStatus: "Entitlement Identified",

    possessionStatus: "ON_HOLD",
    verificationStatus: "NOT_VERIFIED",

    possessionNoticeDate: null,
    scheduledHandoverDate: null,
    possessionDate: null,

    handoverAuthority: null,

    pendingAction: "Complete award and entitlement verification",
    blockingReason: "Award and R&R entitlement processes are incomplete",

    siteVerified: false,
  },

  {
    id: "POS-PUN-2026-003",

    acquisitionCaseId: "ACQ-PUN-2026-00423",
    parcelId: "PUN-001247",
    surveyNumber: "147/3B",

    recordedRightHolder: "Abdul Rahman",

    district: "Pune",
    village: "Manjari",

    awardStatus: "Challenged",
    compensationStatus: "On Hold",
    rrStatus: "On Hold",

    possessionStatus: "ON_HOLD",
    verificationStatus: "NOT_VERIFIED",

    possessionNoticeDate: null,
    scheduledHandoverDate: null,
    possessionDate: null,

    handoverAuthority: null,

    pendingAction: "Resolve acquisition case hold",
    blockingReason: "Award challenge and compensation hold",

    siteVerified: false,
  },

  {
    id: "POS-NAG-2026-004",

    acquisitionCaseId: "ACQ-NAG-2026-00117",
    parcelId: "NAG-004812",
    surveyNumber: "82/4",

    recordedRightHolder: "Sunita Deshmukh",

    district: "Nagpur",
    village: "Hingna",

    awardStatus: "Award Passed",
    compensationStatus: "Paid",
    rrStatus: "Completed",

    possessionStatus: "POSSESSION_COMPLETED",
    verificationStatus: "FIELD_VERIFIED",

    possessionNoticeDate: "2026-08-10",
    scheduledHandoverDate: "2026-08-20",
    possessionDate: "2026-08-22",

    handoverAuthority: "District Land Acquisition Officer",

    pendingAction: "No pending action",
    blockingReason: null,

    siteVerified: true,
  },

  {
    id: "POS-NAS-2026-005",

    acquisitionCaseId: "ACQ-NAS-2026-00087",
    parcelId: "NAS-003102",
    surveyNumber: "61/2B",

    recordedRightHolder: "Priya Kulkarni",

    district: "Nashik",
    village: "Sinnar",

    awardStatus: "Award Passed",
    compensationStatus: "Paid",
    rrStatus: "Completed",

    possessionStatus: "READY_FOR_HANDOVER",
    verificationStatus: "FIELD_VERIFIED",

    possessionNoticeDate: "2026-08-28",
    scheduledHandoverDate: null,
    possessionDate: null,

    handoverAuthority: "Sub-Divisional Land Acquisition Officer",

    pendingAction: "Schedule physical handover",
    blockingReason: null,

    siteVerified: true,
  },
];