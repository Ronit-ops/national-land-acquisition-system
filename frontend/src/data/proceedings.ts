import type { ProceedingsRecord } from "../types/proceedings";

export const proceedingsRecords: ProceedingsRecord[] = [
  {
    id: "PROC-PUN-2026-00421",
    acquisitionCaseId: "ACQ-PUN-2026-00421",
    parcelId: "PUN-001245",
    surveyNumber: "145/2A",
    recordedRightHolder: "Rajesh Kumar",
    district: "Pune",
    village: "Wagholi",

    notification: {
      id: "NOT-PUN-2026-00421",
      type: "PRELIMINARY_NOTIFICATION",
      title: "Preliminary acquisition notification",
      publicationDate: "2026-06-12",
      effectiveDate: "2026-06-15",
      serviceDate: "2026-06-20",
      status: "SERVED",
      documentReference: "DOC-NOT-PUN-00421",
    },

    objection: {
      id: "OBJ-PUN-2026-0184",
      objectorName: "Rajesh Kumar",
      submissionDate: "2026-07-04",
      category: "Land valuation / acquisition impact",
      description:
        "Objector has submitted a representation concerning the proposed acquisition and associated compensation assessment.",
      status: "HEARING_SCHEDULED",
      supportingDocumentCount: 3,
    },

    hearing: {
      id: "HRG-PUN-2026-0092",
      hearingDate: "2026-09-18",
      venue: "Sub-Divisional Office, Pune",
      mode: "IN_PERSON",
      assignedOfficer: "Sub-Divisional Land Acquisition Officer",
      status: "SCHEDULED",
      attendanceRecorded: false,
      proceedingsRemarks: null,
      outcome: null,
    },

    priority: "HIGH",

    officerRemarks:
      "Objection has been received and supporting documents are available. Hearing is scheduled for authorized officer consideration.",

    nextAction: "Conduct scheduled hearing",

    nextActionDueDate: "2026-09-18",

    legalDecisionRecorded: false,

    createdAt: "2026-06-12T09:30:00",
    updatedAt: "2026-09-06T11:15:00",
  },

  {
    id: "PROC-PUN-2026-00422",
    acquisitionCaseId: "ACQ-PUN-2026-00422",
    parcelId: "PUN-001246",
    surveyNumber: "146/1",
    recordedRightHolder: "Meena Patil",
    district: "Pune",
    village: "Kharadi",

    notification: {
      id: "NOT-PUN-2026-00422",
      type: "PRELIMINARY_NOTIFICATION",
      title: "Preliminary acquisition notification",
      publicationDate: "2026-07-02",
      effectiveDate: "2026-07-05",
      serviceDate: "2026-07-10",
      status: "ACKNOWLEDGED",
      documentReference: "DOC-NOT-PUN-00422",
    },

    objection: {
      id: "OBJ-PUN-2026-0197",
      objectorName: "Meena Patil",
      submissionDate: "2026-07-24",
      category: "Right-holder representation",
      description:
        "Representation submitted regarding recorded right-holder information and acquisition impact.",
      status: "UNDER_SCRUTINY",
      supportingDocumentCount: 2,
    },

    hearing: {
      id: null,
      hearingDate: null,
      venue: null,
      mode: null,
      assignedOfficer: "Land Acquisition Officer — Pune",
      status: "NOT_SCHEDULED",
      attendanceRecorded: false,
      proceedingsRemarks: null,
      outcome: null,
    },

    priority: "MEDIUM",

    officerRemarks:
      "Objection documents are under preliminary scrutiny before hearing scheduling.",

    nextAction: "Complete objection document scrutiny",

    nextActionDueDate: "2026-09-22",

    legalDecisionRecorded: false,

    createdAt: "2026-07-02T10:20:00",
    updatedAt: "2026-09-05T15:40:00",
  },

  {
    id: "PROC-PUN-2026-00423",
    acquisitionCaseId: "ACQ-PUN-2026-00423",
    parcelId: "PUN-001247",
    surveyNumber: "147/3B",
    recordedRightHolder: "Abdul Rahman",
    district: "Pune",
    village: "Manjari",

    notification: {
      id: "NOT-PUN-2026-00423",
      type: "DECLARATION",
      title: "Acquisition declaration",
      publicationDate: "2026-05-28",
      effectiveDate: "2026-06-02",
      serviceDate: "2026-06-08",
      status: "SERVED",
      documentReference: "DOC-DEC-PUN-00423",
    },

    objection: {
      id: "OBJ-PUN-2026-0112",
      objectorName: "Abdul Rahman",
      submissionDate: "2026-06-21",
      category: "Acquisition challenge",
      description:
        "Representation challenging aspects of the acquisition proceeding has been submitted for authorized review.",
      status: "HEARD",
      supportingDocumentCount: 5,
    },

    hearing: {
      id: "HRG-PUN-2026-0061",
      hearingDate: "2026-08-12",
      venue: "District Collectorate, Pune",
      mode: "IN_PERSON",
      assignedOfficer: "District Land Acquisition Officer",
      status: "COMPLETED",
      attendanceRecorded: true,
      proceedingsRemarks:
        "Hearing completed. Additional records have been requested before recording the final administrative outcome.",
      outcome: "REQUIRES_FURTHER_REVIEW",
    },

    priority: "CRITICAL",

    officerRemarks:
      "Proceeding remains under review following the completed hearing. Additional records are required before an authorized decision is recorded.",

    nextAction: "Review additional records",

    nextActionDueDate: "2026-09-15",

    legalDecisionRecorded: false,

    createdAt: "2026-05-28T08:45:00",
    updatedAt: "2026-09-04T16:25:00",
  },

  {
    id: "PROC-NAG-2026-00117",
    acquisitionCaseId: "ACQ-NAG-2026-00117",
    parcelId: "NAG-004812",
    surveyNumber: "82/4",
    recordedRightHolder: "Sunita Deshmukh",
    district: "Nagpur",
    village: "Hingna",

    notification: {
      id: "NOT-NAG-2026-00117",
      type: "AWARD_NOTICE",
      title: "Award notice",
      publicationDate: "2026-07-15",
      effectiveDate: "2026-07-18",
      serviceDate: "2026-07-20",
      status: "ACKNOWLEDGED",
      documentReference: "DOC-AWD-NAG-00117",
    },

    objection: {
      id: null,
      objectorName: null,
      submissionDate: null,
      category: null,
      description: null,
      status: "NOT_RECEIVED",
      supportingDocumentCount: 0,
    },

    hearing: {
      id: null,
      hearingDate: null,
      venue: null,
      mode: null,
      assignedOfficer: null,
      status: "NOT_SCHEDULED",
      attendanceRecorded: false,
      proceedingsRemarks: null,
      outcome: null,
    },

    priority: "LOW",

    officerRemarks:
      "No objection has been recorded against the current proceeding in the demonstration dataset.",

    nextAction: "Proceed with downstream compensation and possession workflow",

    nextActionDueDate: null,

    legalDecisionRecorded: true,

    createdAt: "2026-07-15T09:00:00",
    updatedAt: "2026-08-24T13:10:00",
  },
];
