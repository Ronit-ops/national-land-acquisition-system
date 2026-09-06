import type { RRRecord } from "../types/rr";

export const rrRecords: RRRecord[] = [
  {
    id: "RR-PUN-2026-001",
    acquisitionCaseId: "ACQ-PUN-2026-00421",
    parcelId: "PUN-001245",
    recordedRightHolder: "Rajesh Kumar",

    affectedFamilyCount: 1,
    rrCategory: "Agricultural Land Affected",
    entitlementStatus: "Eligible",

    assistanceAmount: 450000,
    rrPackage: "Livelihood restoration + relocation assistance",

    relocationStatus: "PENDING",
    rehabilitationStatus: "IN_PROGRESS",
    rrStatus: "UNDER_IMPLEMENTATION",

    pendingAction: "Complete relocation assistance",
    targetDate: "2026-10-15",
  },

  {
    id: "RR-PUN-2026-002",
    acquisitionCaseId: "ACQ-PUN-2026-00422",
    parcelId: "PUN-001246",
    recordedRightHolder: "Meena Patil",

    affectedFamilyCount: 1,
    rrCategory: "Residential Structure Affected",
    entitlementStatus: "Under Verification",

    assistanceAmount: 625000,
    rrPackage: "Housing assistance + shifting support",

    relocationStatus: "IN_PROGRESS",
    rehabilitationStatus: "NOT_STARTED",
    rrStatus: "ENTITLEMENT_IDENTIFIED",

    pendingAction: "Complete entitlement verification",
    targetDate: "2026-09-30",
  },

  {
    id: "RR-PUN-2026-003",
    acquisitionCaseId: "ACQ-PUN-2026-00423",
    parcelId: "PUN-001247",
    recordedRightHolder: "Abdul Rahman",

    affectedFamilyCount: 2,
    rrCategory: "Agricultural Land Affected",
    entitlementStatus: "Eligible",

    assistanceAmount: 780000,
    rrPackage: "Livelihood restoration package",

    relocationStatus: "NOT_REQUIRED",
    rehabilitationStatus: "IN_PROGRESS",
    rrStatus: "ON_HOLD",

    pendingAction: "Resolve compensation-related hold",
    targetDate: null,
  },

  {
    id: "RR-NAG-2026-004",
    acquisitionCaseId: "ACQ-NAG-2026-00117",
    parcelId: "NAG-004812",
    recordedRightHolder: "Sunita Deshmukh",

    affectedFamilyCount: 1,
    rrCategory: "Agricultural Land Affected",
    entitlementStatus: "Eligible",

    assistanceAmount: 315000,
    rrPackage: "Livelihood restoration assistance",

    relocationStatus: "COMPLETED",
    rehabilitationStatus: "COMPLETED",
    rrStatus: "COMPLETED",

    pendingAction: "No pending action",
    targetDate: null,
  },
];
