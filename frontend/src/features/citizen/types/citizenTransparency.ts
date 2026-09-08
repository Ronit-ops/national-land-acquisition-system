export type CitizenPublicationStatus =
  | "PUBLISHED"
  | "SCHEDULED"
  | "WITHDRAWN"
  | "NOT_PUBLISHED";

export type CitizenInformationVisibility =
  | "PUBLIC"
  | "CITIZEN_AUTHORIZED"
  | "RESTRICTED";

export type CitizenTransparencySource =
  | "OFFICIAL_RECORD"
  | "PUBLISHED_NOTIFICATION"
  | "CASE_WORKFLOW"
  | "CITIZEN_SUBMISSION"
  | "DEMONSTRATION_DATA";

export type CitizenTransparencyItemType =
  | "PROJECT"
  | "NOTIFICATION"
  | "OBJECTION"
  | "HEARING"
  | "AWARD"
  | "COMPENSATION"
  | "R_AND_R"
  | "POSSESSION"
  | "DOCUMENT"
  | "CASE_UPDATE";

export type CitizenPublication = {
  id: string;

  type: CitizenTransparencyItemType;

  title: string;

  description: string;

  referenceNumber: string | null;

  publicationStatus: CitizenPublicationStatus;

  visibility: CitizenInformationVisibility;

  source: CitizenTransparencySource;

  publishedDate: string | null;

  effectiveDate: string | null;

  lastUpdated: string;

  citizenVisible: boolean;

  documentId?: string;

  caseReference?: string;

  projectId?: string;
};

export type CitizenProjectTransparency = {
  projectId: string;

  projectName: string;

  projectAuthority: string;

  district: string;

  description: string;

  projectStatus:
    | "PROPOSED"
    | "REGISTERED"
    | "UNDER_ACQUISITION"
    | "IMPLEMENTATION"
    | "COMPLETED"
    | "ON_HOLD";

  publicInformationStatus: CitizenPublicationStatus;

  totalAffectedParcels: number | null;

  citizenVisibleUpdates: number;

  lastPublishedUpdate: string | null;

  source: CitizenTransparencySource;

  visibility: CitizenInformationVisibility;
};

export type CitizenTransparencySummary = {
  publishedNotifications: number;

  upcomingHearings: number;

  activeCases: number;

  availableDocuments: number;

  recentUpdates: number;

  lastUpdated: string;
};

export type CitizenTransparencyDataset = {
  projects: CitizenProjectTransparency[];

  publications: CitizenPublication[];

  summary: CitizenTransparencySummary;
};