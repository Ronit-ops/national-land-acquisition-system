import type { FieldVerificationRecord } from "../types/fieldVerification";

export const fieldVerificationRecords: FieldVerificationRecord[] = [
  {
    id: "FV-PUN-2026-0098",
    aiAlertId: "AI-ALT-PUN-2026-0187",
    parcelId: "PUN-001245",
    surveyNumber: "145/2A",
    acquisitionCaseId: "ACQ-PUN-2026-00421",
    district: "Pune",
    village: "Wagholi",
    recordedRightHolder: "Rajesh Kumar",
    changeType: "Possible Structure Development",
    aiConfidence: 87,
    aiSeverity: "HIGH",
    assignedOfficer: "Field Officer — Pune",
    visitDate: "2026-09-12",
    verificationStatus: "EVIDENCE_SUBMITTED",
    gpsCaptured: true,
    gpsLatitude: 18.57542,
    gpsLongitude: 73.97681,
    photoCount: 4,
    documentCount: 2,
    findings: {
      observedChange:
        "A permanent structure was observed within the inspected parcel area.",
      siteCondition:
        "The site contains a newly observed built structure and surrounding disturbed ground.",
      boundaryObservation:
        "The observed structure appears to be located within the recorded parcel boundary shown for field inspection.",
      officerRemarks:
        "Field evidence has been submitted for review. Final administrative determination is pending.",
    },
    outcome: null,
    reviewRemarks:
      "Evidence submitted by field officer. Authorized officer review is pending.",
    evidence: [
      {
        id: "EVD-PUN-0098-01",
        type: "SITE_PHOTO",
        title: "Site photograph 01",
        description: "Photograph captured during the physical site inspection.",
        capturedAt: "2026-09-12T10:14:00",
        capturedBy: "Field Officer — Pune",
        available: true,
      },
      {
        id: "EVD-PUN-0098-02",
        type: "SITE_PHOTO",
        title: "Site photograph 02",
        description:
          "Photograph showing the observed structure and surrounding area.",
        capturedAt: "2026-09-12T10:17:00",
        capturedBy: "Field Officer — Pune",
        available: true,
      },
      {
        id: "EVD-PUN-0098-03",
        type: "GPS_CAPTURE",
        title: "GPS location capture",
        description: "Location captured during field verification.",
        capturedAt: "2026-09-12T10:20:00",
        capturedBy: "Field Officer — Pune",
        available: true,
      },
      {
        id: "EVD-PUN-0098-04",
        type: "DOCUMENT",
        title: "Field inspection document",
        description:
          "Supporting document associated with the site inspection.",
        capturedAt: "2026-09-12T10:28:00",
        capturedBy: "Field Officer — Pune",
        available: true,
      },
      {
        id: "EVD-PUN-0098-05",
        type: "DOCUMENT",
        title: "Supporting site record",
        description:
          "Additional supporting record submitted with the inspection.",
        capturedAt: "2026-09-12T10:31:00",
        capturedBy: "Field Officer — Pune",
        available: true,
      },
    ],
    createdAt: "2026-09-08T09:30:00",
    updatedAt: "2026-09-12T10:35:00",
  },
  {
    id: "FV-NAG-2026-0042",
    aiAlertId: "AI-ALT-NAG-2026-0112",
    parcelId: "NAG-004812",
    surveyNumber: "82/4",
    acquisitionCaseId: "ACQ-NAG-2026-00117",
    district: "Nagpur",
    village: "Hingna",
    recordedRightHolder: "Sunita Deshmukh",
    changeType: "Possible Land-use Change",
    aiConfidence: 74,
    aiSeverity: "MEDIUM",
    assignedOfficer: "Field Officer — Nagpur",
    visitDate: "2026-09-10",
    verificationStatus: "UNDER_REVIEW",
    gpsCaptured: true,
    gpsLatitude: 21.09234,
    gpsLongitude: 79.01128,
    photoCount: 3,
    documentCount: 1,
    findings: {
      observedChange:
        "A visible surface change was observed compared with the satellite baseline.",
      siteCondition:
        "The inspected area shows recent surface disturbance.",
      boundaryObservation:
        "The observed condition falls within the parcel area inspected during the visit.",
      officerRemarks:
        "Additional review is recommended before recording a final verification outcome.",
    },
    outcome: "REQUIRES_FURTHER_REVIEW",
    reviewRemarks:
      "Further evidence review is required before the verification record is closed.",
    evidence: [
      {
        id: "EVD-NAG-0042-01",
        type: "SITE_PHOTO",
        title: "Site photograph 01",
        description: "Photograph captured during site inspection.",
        capturedAt: "2026-09-10T11:08:00",
        capturedBy: "Field Officer — Nagpur",
        available: true,
      },
      {
        id: "EVD-NAG-0042-02",
        type: "SITE_PHOTO",
        title: "Site photograph 02",
        description:
          "Photograph showing the observed surface condition.",
        capturedAt: "2026-09-10T11:11:00",
        capturedBy: "Field Officer — Nagpur",
        available: true,
      },
      {
        id: "EVD-NAG-0042-03",
        type: "SITE_PHOTO",
        title: "Site photograph 03",
        description: "Additional contextual site photograph.",
        capturedAt: "2026-09-10T11:14:00",
        capturedBy: "Field Officer — Nagpur",
        available: true,
      },
      {
        id: "EVD-NAG-0042-04",
        type: "DOCUMENT",
        title: "Inspection note",
        description: "Supporting field inspection note.",
        capturedAt: "2026-09-10T11:25:00",
        capturedBy: "Field Officer — Nagpur",
        available: true,
      },
    ],
    createdAt: "2026-09-06T14:20:00",
    updatedAt: "2026-09-10T11:30:00",
  },
  {
    id: "FV-NAS-2026-0027",
    aiAlertId: "AI-ALT-NAS-2026-0064",
    parcelId: "NAS-003102",
    surveyNumber: "61/2B",
    acquisitionCaseId: "ACQ-NAS-2026-00087",
    district: "Nashik",
    village: "Sinnar",
    recordedRightHolder: "Priya Kulkarni",
    changeType: "Possible Vegetation / Surface Change",
    aiConfidence: 68,
    aiSeverity: "LOW",
    assignedOfficer: "Field Officer — Nashik",
    visitDate: "2026-09-08",
    verificationStatus: "VERIFIED",
    gpsCaptured: true,
    gpsLatitude: 19.84531,
    gpsLongitude: 73.99821,
    photoCount: 2,
    documentCount: 1,
    findings: {
      observedChange:
        "The satellite-observed change was inspected and no corresponding new permanent structure was observed.",
      siteCondition:
        "The inspected parcel primarily contains agricultural vegetation and seasonal surface variation.",
      boundaryObservation:
        "No material boundary issue was observed during the field inspection.",
      officerRemarks:
        "The observed satellite variation appears consistent with seasonal surface or vegetation change.",
    },
    outcome: "NOT_CONFIRMED",
    reviewRemarks:
      "AI observation was not confirmed as a material physical development during field inspection.",
    evidence: [
      {
        id: "EVD-NAS-0027-01",
        type: "SITE_PHOTO",
        title: "Agricultural site photograph",
        description:
          "Photograph showing the inspected agricultural parcel.",
        capturedAt: "2026-09-08T09:12:00",
        capturedBy: "Field Officer — Nashik",
        available: true,
      },
      {
        id: "EVD-NAS-0027-02",
        type: "SITE_PHOTO",
        title: "Parcel context photograph",
        description:
          "Additional photograph showing surrounding parcel context.",
        capturedAt: "2026-09-08T09:15:00",
        capturedBy: "Field Officer — Nashik",
        available: true,
      },
      {
        id: "EVD-NAS-0027-03",
        type: "GPS_CAPTURE",
        title: "GPS location capture",
        description: "Location captured during the inspection.",
        capturedAt: "2026-09-08T09:17:00",
        capturedBy: "Field Officer — Nashik",
        available: true,
      },
    ],
    createdAt: "2026-09-04T12:15:00",
    updatedAt: "2026-09-08T09:25:00",
  },
];
