import type { GovernmentRole } from "./AuthContext";

export type GovernmentModule =
  | "COMMAND_CENTER"
  | "PROJECTS"
  | "LAND_PARCELS"
  | "ACQUISITION"
  | "PROCEEDINGS"
  | "COMPENSATION"
  | "RR"
  | "POSSESSION"
  | "GIS"
  | "SATELLITE"
  | "AI_ALERTS"
  | "FIELD_VERIFICATION"
  | "DOCUMENTS"
  | "NOTIFICATIONS"
  | "REPORTS"
  | "AUDIT"
  | "USER_MANAGEMENT";

export type JurisdictionType =
  | "DISTRICT"
  | "STATE"
  | "PROJECT";

export type RoleAccessPolicy = {
  role: GovernmentRole;
  label: string;
  description: string;
  jurisdictionTypes: JurisdictionType[];
  modules: GovernmentModule[];
};

const COMMON_OPERATIONAL_MODULES: GovernmentModule[] = [
  "COMMAND_CENTER",
  "PROJECTS",
  "LAND_PARCELS",
  "ACQUISITION",
  "PROCEEDINGS",
  "COMPENSATION",
  "RR",
  "POSSESSION",
  "GIS",
  "DOCUMENTS",
  "NOTIFICATIONS",
  "REPORTS",
];

export const ROLE_ACCESS_POLICIES: Record<
  GovernmentRole,
  RoleAccessPolicy
> = {
  DISTRICT_LAND_OFFICER: {
    role: "DISTRICT_LAND_OFFICER",
    label: "District Land Acquisition Officer",
    description:
      "District-level operational oversight of land acquisition cases, parcels and downstream processes.",
    jurisdictionTypes: ["DISTRICT"],
    modules: [
      ...COMMON_OPERATIONAL_MODULES,
      "SATELLITE",
      "AI_ALERTS",
      "FIELD_VERIFICATION",
      "AUDIT",
    ],
  },

  ACQUISITION_OFFICER: {
    role: "ACQUISITION_OFFICER",
    label: "Land Acquisition Officer",
    description:
      "Operational management of acquisition cases, proceedings, valuation and compensation workflows.",
    jurisdictionTypes: ["DISTRICT", "PROJECT"],
    modules: [
      "COMMAND_CENTER",
      "PROJECTS",
      "LAND_PARCELS",
      "ACQUISITION",
      "PROCEEDINGS",
      "COMPENSATION",
      "RR",
      "POSSESSION",
      "GIS",
      "DOCUMENTS",
      "NOTIFICATIONS",
      "REPORTS",
      "FIELD_VERIFICATION",
    ],
  },

  PROJECT_AUTHORITY: {
    role: "PROJECT_AUTHORITY",
    label: "Project Authority",
    description:
      "Project-level monitoring of land requirements, acquisition progress and project delivery.",
    jurisdictionTypes: ["PROJECT"],
    modules: [
      "COMMAND_CENTER",
      "PROJECTS",
      "LAND_PARCELS",
      "ACQUISITION",
      "COMPENSATION",
      "RR",
      "POSSESSION",
      "GIS",
      "SATELLITE",
      "AI_ALERTS",
      "DOCUMENTS",
      "NOTIFICATIONS",
      "REPORTS",
    ],
  },

  REVENUE_OFFICER: {
    role: "REVENUE_OFFICER",
    label: "Revenue Officer",
    description:
      "Revenue and land-record oriented access for parcel and right-holder verification workflows.",
    jurisdictionTypes: ["DISTRICT", "STATE"],
    modules: [
      "COMMAND_CENTER",
      "LAND_PARCELS",
      "ACQUISITION",
      "PROCEEDINGS",
      "GIS",
      "DOCUMENTS",
      "NOTIFICATIONS",
      "REPORTS",
      "AUDIT",
    ],
  },

  FIELD_VERIFICATION_OFFICER: {
    role: "FIELD_VERIFICATION_OFFICER",
    label: "Field Verification Officer",
    description:
      "Field-oriented review of assigned parcels, evidence and AI-generated observations.",
    jurisdictionTypes: ["DISTRICT", "PROJECT"],
    modules: [
      "COMMAND_CENTER",
      "LAND_PARCELS",
      "GIS",
      "SATELLITE",
      "AI_ALERTS",
      "FIELD_VERIFICATION",
      "DOCUMENTS",
      "NOTIFICATIONS",
    ],
  },

  STATE_ADMINISTRATOR: {
    role: "STATE_ADMINISTRATOR",
    label: "State Administrator",
    description:
      "State-level monitoring, administration, reporting and cross-district oversight.",
    jurisdictionTypes: ["STATE"],
    modules: [
      "COMMAND_CENTER",
      ...COMMON_OPERATIONAL_MODULES,
      "GIS",
      "SATELLITE",
      "AI_ALERTS",
      "FIELD_VERIFICATION",
      "DOCUMENTS",
      "REPORTS",
      "AUDIT",
      "USER_MANAGEMENT",
    ],
  },
};

export function getRoleAccessPolicy(
  role: GovernmentRole,
): RoleAccessPolicy {
  return ROLE_ACCESS_POLICIES[role];
}

export function hasModuleAccess(
  role: GovernmentRole,
  module: GovernmentModule,
): boolean {
  return ROLE_ACCESS_POLICIES[role].modules.includes(module);
}

export function isJurisdictionTypeAllowed(
  role: GovernmentRole,
  jurisdictionType: JurisdictionType,
): boolean {
  return ROLE_ACCESS_POLICIES[
    role
  ].jurisdictionTypes.includes(jurisdictionType);
}

export function getModuleLabel(
  module: GovernmentModule,
): string {
  const labels: Record<GovernmentModule, string> = {
    COMMAND_CENTER: "Command Center",
    PROJECTS: "Projects",
    LAND_PARCELS: "Land & Parcels",
    ACQUISITION: "Acquisition",
    PROCEEDINGS: "Proceedings",
    COMPENSATION: "Compensation",
    RR: "R&R",
    POSSESSION: "Possession",
    GIS: "GIS Intelligence",
    SATELLITE: "Satellite",
    AI_ALERTS: "AI Alerts",
    FIELD_VERIFICATION: "Field Verification",
    DOCUMENTS: "Documents",
    NOTIFICATIONS: "Notifications",
    REPORTS: "Reports",
    AUDIT: "Audit & Traceability",
    USER_MANAGEMENT: "Government Users",
  };

  return labels[module];
}