import type { CitizenCaseRecord } from "../types/citizenCase";

export const citizenCaseRecords: CitizenCaseRecord[] = [
  {
    id: "CIT-PUN-2026-00421",
    caseReference: "ACQ-PUN-2026-00421",
    projectName: "Pune Ring Road Expansion",
    projectAuthority: "State Infrastructure Development Authority",
    district: "Pune",
    village: "Wagholi",

    recordedRightHolder: "Rajesh Kumar",

    parcel: {
      parcelId: "PUN-001245",
      surveyNumber: "145/2A",
      district: "Pune",
      village: "Wagholi",
      areaHectares: 1.84,
      landUse: "Agricultural",
    },

    currentStage: "R_AND_R",
    status: "ACTIVE",

    notification: {
      id: "NOT-PUN-2026-00421",
      type: "Preliminary Notification",
      title: "Preliminary land acquisition notification",
      issueDate: "2026-06-12",
      serviceDate: "2026-06-20",
      status: "SERVED",
      referenceNumber: "PN/PUN/2026/00421",
    },

    objection: {
      id: "OBJ-PUN-2026-0184",
      submittedDate: "2026-07-04",
      category: "Land valuation / acquisition impact",
      status: "HEARING_SCHEDULED",
      hearingRequired: true,
    },

    hearing: {
      id: "HRG-PUN-2026-0092",
      hearingDate: "2026-09-18",
      venue: "Sub-Divisional Office Pune",
      mode: "IN_PERSON",
      status: "SCHEDULED",
    },

    award: {
      status: "PASSED",
      awardDate: "2026-08-18",
      referenceNumber: "AWD/PUN/2026/00421",
    },

    compensation: {
      status: "PARTIALLY_PAID",
      awardedAmount: 2015000,
      paidAmount: 1200000,
      pendingAmount: 815000,
      paymentDate: null,
    },

    rr: {
      status: "UNDER_IMPLEMENTATION",
      assistanceAmount: 450000,
      packageDescription:
        "Livelihood restoration and relocation assistance",
      relocationStatus: "PENDING",
      rehabilitationStatus: "IN_PROGRESS",
    },

    possession: {
      status: "NOT_READY",
      noticeDate: "2026-08-25",
      scheduledDate: null,
      possessionDate: null,
    },

    timeline: [
      {
        id: "TL-PUN-001",
        stage: "PROJECT_REGISTERED",
        title: "Project registered",
        description:
          "The infrastructure project was registered for land requirement assessment.",
        date: "2026-04-10",
        completed: true,
        current: false,
      },
      {
        id: "TL-PUN-002",
        stage: "LAND_IDENTIFICATION",
        title: "Land parcel identified",
        description:
          "The parcel was identified as part of the project land requirement.",
        date: "2026-05-02",
        completed: true,
        current: false,
      },
      {
        id: "TL-PUN-003",
        stage: "PRELIMINARY_NOTIFICATION",
        title: "Preliminary notification issued",
        description:
          "The preliminary acquisition notification was issued and served.",
        date: "2026-06-12",
        completed: true,
        current: false,
      },
      {
        id: "TL-PUN-004",
        stage: "OBJECTION",
        title: "Objection submitted",
        description:
          "An objection was submitted and is being processed.",
        date: "2026-07-04",
        completed: true,
        current: false,
      },
      {
        id: "TL-PUN-005",
        stage: "HEARING",
        title: "Hearing scheduled",
        description:
          "A hearing has been scheduled for the submitted objection.",
        date: "2026-09-18",
        completed: false,
        current: true,
      },
      {
        id: "TL-PUN-006",
        stage: "AWARD",
        title: "Award passed",
        description:
          "The acquisition award has been recorded.",
        date: "2026-08-18",
        completed: true,
        current: false,
      },
      {
        id: "TL-PUN-007",
        stage: "COMPENSATION",
        title: "Compensation payment",
        description:
          "Compensation has been partially paid.",
        date: "2026-08-24",
        completed: true,
        current: false,
      },
      {
        id: "TL-PUN-008",
        stage: "R_AND_R",
        title: "Rehabilitation & resettlement",
        description:
          "R&R implementation is currently in progress.",
        date: null,
        completed: false,
        current: true,
      },
      {
        id: "TL-PUN-009",
        stage: "POSSESSION",
        title: "Possession",
        description:
          "Physical possession is not yet ready for handover.",
        date: null,
        completed: false,
        current: false,
      },
    ],

    lastUpdated: "2026-09-06",
  },

  {
    id: "CIT-NAG-2026-00117",
    caseReference: "ACQ-NAG-2026-00117",
    projectName: "Nagpur Logistics Corridor",
    projectAuthority: "National Infrastructure Development Authority",
    district: "Nagpur",
    village: "Hingna",

    recordedRightHolder: "Sunita Deshmukh",

    parcel: {
      parcelId: "NAG-004812",
      surveyNumber: "82/4",
      district: "Nagpur",
      village: "Hingna",
      areaHectares: 0.89,
      landUse: "Agricultural",
    },

    currentStage: "POSSESSION",
    status: "COMPLETED",

    notification: {
      id: "NOT-NAG-2026-00117",
      type: "Award Notice",
      title: "Land acquisition award notice",
      issueDate: "2026-07-15",
      serviceDate: "2026-07-20",
      status: "ACKNOWLEDGED",
      referenceNumber: "AN/NAG/2026/00117",
    },

    objection: {
      id: null,
      submittedDate: null,
      category: null,
      status: "NOT_FILED",
      hearingRequired: false,
    },

    hearing: {
      id: null,
      hearingDate: null,
      venue: null,
      mode: null,
      status: "NOT_SCHEDULED",
    },

    award: {
      status: "PASSED",
      awardDate: "2026-08-02",
      referenceNumber: "AWD/NAG/2026/00117",
    },

    compensation: {
      status: "PAID",
      awardedAmount: 975000,
      paidAmount: 975000,
      pendingAmount: 0,
      paymentDate: "2026-08-24",
    },

    rr: {
      status: "COMPLETED",
      assistanceAmount: 315000,
      packageDescription: "Livelihood restoration assistance",
      relocationStatus: "COMPLETED",
      rehabilitationStatus: "COMPLETED",
    },

    possession: {
      status: "POSSESSION_COMPLETED",
      noticeDate: "2026-08-10",
      scheduledDate: "2026-08-20",
      possessionDate: "2026-08-22",
    },

    timeline: [
      {
        id: "TL-NAG-001",
        stage: "PROJECT_REGISTERED",
        title: "Project registered",
        description:
          "The project was registered for acquisition processing.",
        date: "2026-03-18",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAG-002",
        stage: "LAND_IDENTIFICATION",
        title: "Land parcel identified",
        description:
          "The parcel was identified for the project.",
        date: "2026-04-02",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAG-003",
        stage: "PRELIMINARY_NOTIFICATION",
        title: "Notification issued",
        description:
          "The acquisition notification was issued and acknowledged.",
        date: "2026-05-10",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAG-004",
        stage: "AWARD",
        title: "Award passed",
        description:
          "The acquisition award was passed.",
        date: "2026-08-02",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAG-005",
        stage: "COMPENSATION",
        title: "Compensation paid",
        description:
          "The awarded compensation was fully paid.",
        date: "2026-08-24",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAG-006",
        stage: "R_AND_R",
        title: "R&R completed",
        description:
          "Rehabilitation and resettlement activities were completed.",
        date: "2026-08-26",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAG-007",
        stage: "POSSESSION",
        title: "Possession completed",
        description:
          "Physical possession was completed following the required process.",
        date: "2026-08-22",
        completed: true,
        current: true,
      },
    ],

    lastUpdated: "2026-08-26",
  },

  {
    id: "CIT-NAS-2026-00087",
    caseReference: "ACQ-NAS-2026-00087",
    projectName: "Nashik Industrial Connectivity Project",
    projectAuthority: "State Industrial Infrastructure Authority",
    district: "Nashik",
    village: "Sinnar",

    recordedRightHolder: "Priya Kulkarni",

    parcel: {
      parcelId: "NAS-003102",
      surveyNumber: "61/2B",
      district: "Nashik",
      village: "Sinnar",
      areaHectares: 1.31,
      landUse: "Agricultural",
    },

    currentStage: "POSSESSION",
    status: "ACTIVE",

    notification: {
      id: "NOT-NAS-2026-00087",
      type: "Declaration",
      title: "Land acquisition declaration",
      issueDate: "2026-07-28",
      serviceDate: "2026-08-02",
      status: "SERVED",
      referenceNumber: "DEC/NAS/2026/00087",
    },

    objection: {
      id: null,
      submittedDate: null,
      category: null,
      status: "NOT_FILED",
      hearingRequired: false,
    },

    hearing: {
      id: null,
      hearingDate: null,
      venue: null,
      mode: null,
      status: "NOT_SCHEDULED",
    },

    award: {
      status: "PASSED",
      awardDate: "2026-08-19",
      referenceNumber: "AWD/NAS/2026/00087",
    },

    compensation: {
      status: "PAID",
      awardedAmount: 1460000,
      paidAmount: 1460000,
      pendingAmount: 0,
      paymentDate: "2026-08-29",
    },

    rr: {
      status: "COMPLETED",
      assistanceAmount: 390000,
      packageDescription: "Livelihood restoration assistance",
      relocationStatus: "COMPLETED",
      rehabilitationStatus: "COMPLETED",
    },

    possession: {
      status: "READY_FOR_HANDOVER",
      noticeDate: "2026-08-28",
      scheduledDate: null,
      possessionDate: null,
    },

    timeline: [
      {
        id: "TL-NAS-001",
        stage: "PROJECT_REGISTERED",
        title: "Project registered",
        description:
          "The project was registered for land acquisition processing.",
        date: "2026-04-20",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAS-002",
        stage: "LAND_IDENTIFICATION",
        title: "Land parcel identified",
        description:
          "The parcel was identified for the project requirement.",
        date: "2026-05-06",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAS-003",
        stage: "PRELIMINARY_NOTIFICATION",
        title: "Preliminary notification",
        description:
          "The preliminary acquisition notification was processed.",
        date: "2026-06-14",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAS-004",
        stage: "DECLARATION",
        title: "Declaration issued",
        description:
          "The land acquisition declaration was issued.",
        date: "2026-07-28",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAS-005",
        stage: "AWARD",
        title: "Award passed",
        description:
          "The acquisition award has been recorded.",
        date: "2026-08-19",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAS-006",
        stage: "COMPENSATION",
        title: "Compensation paid",
        description:
          "Awarded compensation has been fully paid.",
        date: "2026-08-29",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAS-007",
        stage: "R_AND_R",
        title: "R&R completed",
        description:
          "R&R activities have been completed.",
        date: "2026-08-30",
        completed: true,
        current: false,
      },
      {
        id: "TL-NAS-008",
        stage: "POSSESSION",
        title: "Ready for physical handover",
        description:
          "The parcel is ready for physical handover.",
        date: null,
        completed: false,
        current: true,
      },
    ],

    lastUpdated: "2026-08-30",
  },
];