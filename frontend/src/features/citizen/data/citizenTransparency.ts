import type {
  CitizenPublication,
  CitizenProjectTransparency,
  CitizenTransparencyDataset,
} from "../types/citizenTransparency";

const citizenProjects: CitizenProjectTransparency[] = [
  {
    projectId: "PRJ-PUN-2026-001",
    projectName: "Pune Ring Road Development Project",
    projectAuthority: "Public Works Department, Government of Maharashtra",
    district: "Pune",
    description:
      "Public infrastructure project requiring acquisition of identified land parcels for road development.",
    projectStatus: "UNDER_ACQUISITION",
    publicInformationStatus: "PUBLISHED",
    totalAffectedParcels: 184,
    citizenVisibleUpdates: 8,
    lastPublishedUpdate: "2026-09-06",
    source: "OFFICIAL_RECORD",
    visibility: "PUBLIC",
  },
  {
    projectId: "PRJ-NAS-2026-002",
    projectName: "Nashik Industrial Corridor Expansion",
    projectAuthority: "Industrial Development Authority",
    district: "Nashik",
    description:
      "Industrial infrastructure expansion project involving identified land parcels within the notified project area.",
    projectStatus: "REGISTERED",
    publicInformationStatus: "PUBLISHED",
    totalAffectedParcels: 96,
    citizenVisibleUpdates: 5,
    lastPublishedUpdate: "2026-09-04",
    source: "OFFICIAL_RECORD",
    visibility: "PUBLIC",
  },
  {
    projectId: "PRJ-NAG-2026-003",
    projectName: "Nagpur Regional Transport Improvement",
    projectAuthority: "Regional Transport Authority",
    district: "Nagpur",
    description:
      "Regional transport improvement programme with land acquisition activities for supporting infrastructure.",
    projectStatus: "IMPLEMENTATION",
    publicInformationStatus: "PUBLISHED",
    totalAffectedParcels: 72,
    citizenVisibleUpdates: 11,
    lastPublishedUpdate: "2026-09-05",
    source: "OFFICIAL_RECORD",
    visibility: "PUBLIC",
  },
];

const citizenPublications: CitizenPublication[] = [
  {
    id: "PUB-PUN-001",
    type: "NOTIFICATION",
    title: "Preliminary Land Acquisition Notification",
    description:
      "Published notification concerning land parcels identified for the Pune Ring Road Development Project.",
    referenceNumber: "PN-NOT-2026-0142",
    publicationStatus: "PUBLISHED",
    visibility: "PUBLIC",
    source: "PUBLISHED_NOTIFICATION",
    publishedDate: "2026-08-18",
    effectiveDate: "2026-08-20",
    lastUpdated: "2026-08-20T10:30:00",
    citizenVisible: true,
    caseReference: "ACQ-PUN-2026-00421",
    projectId: "PRJ-PUN-2026-001",
  },
  {
    id: "PUB-PUN-002",
    type: "HEARING",
    title: "Land Acquisition Hearing Scheduled",
    description:
      "A hearing has been scheduled for affected interested parties associated with the acquisition case.",
    referenceNumber: "HR-PUN-2026-0068",
    publicationStatus: "PUBLISHED",
    visibility: "CITIZEN_AUTHORIZED",
    source: "CASE_WORKFLOW",
    publishedDate: "2026-09-01",
    effectiveDate: "2026-09-18",
    lastUpdated: "2026-09-01T14:15:00",
    citizenVisible: true,
    caseReference: "ACQ-PUN-2026-00421",
    projectId: "PRJ-PUN-2026-001",
  },
  {
    id: "PUB-PUN-003",
    type: "CASE_UPDATE",
    title: "Acquisition case moved to valuation",
    description:
      "The acquisition case has progressed to the valuation stage following completion of the applicable proceedings.",
    referenceNumber: "ACQ-PUN-2026-00421",
    publicationStatus: "PUBLISHED",
    visibility: "CITIZEN_AUTHORIZED",
    source: "CASE_WORKFLOW",
    publishedDate: "2026-09-07",
    effectiveDate: "2026-09-07",
    lastUpdated: "2026-09-07T11:20:00",
    citizenVisible: true,
    caseReference: "ACQ-PUN-2026-00421",
    projectId: "PRJ-PUN-2026-001",
  },
  {
    id: "PUB-PUN-004",
    type: "DOCUMENT",
    title: "Published Hearing Notice",
    description:
      "Citizen-visible hearing notice associated with the acquisition case.",
    referenceNumber: "DOC-PUN-HR-2026-0068",
    publicationStatus: "PUBLISHED",
    visibility: "CITIZEN_AUTHORIZED",
    source: "PUBLISHED_NOTIFICATION",
    publishedDate: "2026-09-01",
    effectiveDate: "2026-09-18",
    lastUpdated: "2026-09-01T14:20:00",
    citizenVisible: true,
    documentId: "CDOC-PUN-003",
    caseReference: "ACQ-PUN-2026-00421",
    projectId: "PRJ-PUN-2026-001",
  },
  {
    id: "PUB-PUN-005",
    type: "AWARD",
    title: "Award Information",
    description:
      "Citizen-visible award information published for the applicable acquisition case.",
    referenceNumber: "AWD-PUN-2026-0021",
    publicationStatus: "PUBLISHED",
    visibility: "CITIZEN_AUTHORIZED",
    source: "OFFICIAL_RECORD",
    publishedDate: "2026-08-29",
    effectiveDate: "2026-08-29",
    lastUpdated: "2026-08-29T16:00:00",
    citizenVisible: true,
    caseReference: "ACQ-PUN-2026-00421",
    projectId: "PRJ-PUN-2026-001",
  },
  {
    id: "PUB-PUN-006",
    type: "COMPENSATION",
    title: "Compensation payment status updated",
    description:
      "The citizen-visible compensation status for the acquisition case has been updated.",
    referenceNumber: "COMP-PUN-2026-001",
    publicationStatus: "PUBLISHED",
    visibility: "CITIZEN_AUTHORIZED",
    source: "CASE_WORKFLOW",
    publishedDate: "2026-09-05",
    effectiveDate: "2026-09-05",
    lastUpdated: "2026-09-05T12:10:00",
    citizenVisible: true,
    caseReference: "ACQ-PUN-2026-00421",
    projectId: "PRJ-PUN-2026-001",
  },
  {
    id: "PUB-NAS-001",
    type: "PROJECT",
    title: "Industrial Corridor Project Information",
    description:
      "Public project information for the Nashik Industrial Corridor Expansion.",
    referenceNumber: "PRJ-NAS-2026-002",
    publicationStatus: "PUBLISHED",
    visibility: "PUBLIC",
    source: "OFFICIAL_RECORD",
    publishedDate: "2026-07-15",
    effectiveDate: "2026-07-15",
    lastUpdated: "2026-09-04T09:30:00",
    citizenVisible: true,
    projectId: "PRJ-NAS-2026-002",
  },
  {
    id: "PUB-NAS-002",
    type: "NOTIFICATION",
    title: "Land Identification Notice",
    description:
      "Public notice relating to land parcels identified for the industrial corridor expansion.",
    referenceNumber: "NAS-NOT-2026-0088",
    publicationStatus: "PUBLISHED",
    visibility: "PUBLIC",
    source: "PUBLISHED_NOTIFICATION",
    publishedDate: "2026-08-12",
    effectiveDate: "2026-08-14",
    lastUpdated: "2026-08-14T11:00:00",
    citizenVisible: true,
    projectId: "PRJ-NAS-2026-002",
  },
  {
    id: "PUB-NAG-001",
    type: "PROJECT",
    title: "Regional Transport Project Information",
    description:
      "Public project information for the Nagpur Regional Transport Improvement programme.",
    referenceNumber: "PRJ-NAG-2026-003",
    publicationStatus: "PUBLISHED",
    visibility: "PUBLIC",
    source: "OFFICIAL_RECORD",
    publishedDate: "2026-06-22",
    effectiveDate: "2026-06-22",
    lastUpdated: "2026-09-05T10:45:00",
    citizenVisible: true,
    projectId: "PRJ-NAG-2026-003",
  },
  {
    id: "PUB-NAG-002",
    type: "POSSESSION",
    title: "Possession process update",
    description:
      "Citizen-visible update regarding the possession stage of the acquisition process.",
    referenceNumber: "POS-NAG-2026-0044",
    publicationStatus: "PUBLISHED",
    visibility: "CITIZEN_AUTHORIZED",
    source: "CASE_WORKFLOW",
    publishedDate: "2026-09-03",
    effectiveDate: "2026-09-10",
    lastUpdated: "2026-09-03T15:25:00",
    citizenVisible: true,
    caseReference: "ACQ-NAG-2026-00218",
    projectId: "PRJ-NAG-2026-003",
  },
  {
    id: "PUB-NAG-003",
    type: "R_AND_R",
    title: "Rehabilitation and resettlement update",
    description:
      "Citizen-visible update regarding rehabilitation and resettlement implementation.",
    referenceNumber: "RR-NAG-2026-0017",
    publicationStatus: "PUBLISHED",
    visibility: "CITIZEN_AUTHORIZED",
    source: "CASE_WORKFLOW",
    publishedDate: "2026-09-05",
    effectiveDate: "2026-09-05",
    lastUpdated: "2026-09-05T13:40:00",
    citizenVisible: true,
    caseReference: "ACQ-NAG-2026-00218",
    projectId: "PRJ-NAG-2026-003",
  },

  /*
   * Deliberately non-visible record.
   *
   * This demonstrates that the publication layer can contain
   * government information while preventing restricted records
   * from reaching the citizen portal.
   */
  {
    id: "PUB-INT-001",
    type: "CASE_UPDATE",
    title: "Internal officer workflow note",
    description:
      "Internal operational information not intended for citizen display.",
    referenceNumber: "INT-WORKFLOW-2026-019",
    publicationStatus: "PUBLISHED",
    visibility: "RESTRICTED",
    source: "CASE_WORKFLOW",
    publishedDate: "2026-09-06",
    effectiveDate: "2026-09-06",
    lastUpdated: "2026-09-06T17:30:00",
    citizenVisible: false,
    caseReference: "ACQ-PUN-2026-00421",
    projectId: "PRJ-PUN-2026-001",
  },
];

const citizenTransparencyDataset: CitizenTransparencyDataset = {
  projects: citizenProjects,
  publications: citizenPublications,
  summary: {
    publishedNotifications: citizenPublications.filter(
      (publication) =>
        publication.type === "NOTIFICATION" &&
        publication.citizenVisible &&
        publication.visibility !== "RESTRICTED" &&
        publication.publicationStatus === "PUBLISHED",
    ).length,

    upcomingHearings: citizenPublications.filter(
      (publication) =>
        publication.type === "HEARING" &&
        publication.citizenVisible &&
        publication.visibility !== "RESTRICTED" &&
        publication.publicationStatus === "PUBLISHED",
    ).length,

    activeCases: citizenPublications.filter(
      (publication) =>
        publication.type === "CASE_UPDATE" &&
        publication.citizenVisible &&
        publication.visibility !== "RESTRICTED" &&
        publication.publicationStatus === "PUBLISHED",
    ).length,

    availableDocuments: citizenPublications.filter(
      (publication) =>
        publication.type === "DOCUMENT" &&
        publication.citizenVisible &&
        publication.visibility !== "RESTRICTED" &&
        publication.publicationStatus === "PUBLISHED",
    ).length,

    recentUpdates: citizenPublications.filter(
      (publication) =>
        publication.citizenVisible &&
        publication.visibility !== "RESTRICTED" &&
        publication.publicationStatus === "PUBLISHED",
    ).length,

    lastUpdated:
      citizenPublications
        .filter(
          (publication) =>
            publication.citizenVisible &&
            publication.visibility !== "RESTRICTED" &&
            publication.publicationStatus === "PUBLISHED",
        )
        .sort(
          (first, second) =>
            new Date(second.lastUpdated).getTime() -
            new Date(first.lastUpdated).getTime(),
        )[0]?.lastUpdated ??
      new Date().toISOString(),
  },
};

export function getCitizenTransparencyDataset(): CitizenTransparencyDataset {
  return {
    projects: [...citizenTransparencyDataset.projects],
    publications: [...citizenTransparencyDataset.publications],
    summary: {
      ...citizenTransparencyDataset.summary,
    },
  };
}

export function getCitizenTransparencyPublications(): CitizenPublication[] {
  return [...citizenTransparencyDataset.publications];
}

export function getCitizenTransparencyProjects(): CitizenProjectTransparency[] {
  return [...citizenTransparencyDataset.projects];
}