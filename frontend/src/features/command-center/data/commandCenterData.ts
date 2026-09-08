import type {
  AttentionItem,
  AcquisitionWorkflowStage,
  CommandCenterDataset,
  CommandCenterMetric,
  IntelligenceSignal,
  ProjectHealthSummary,
} from "../types/commandcenter";

const metrics: CommandCenterMetric[] = [
  {
    id: "metric-active-cases",
    label: "Active Acquisition Cases",
    value: "128",
    unit: "cases",
    supportingText: "Cases currently moving through the acquisition lifecycle.",
    trend: "+6.4%",
    status: "ATTENTION",
  },
  {
    id: "metric-land-acquired",
    label: "Land Acquired",
    value: "1,842.6",
    unit: "ha",
    supportingText: "Land recorded as acquired across the authorized scope.",
    trend: "+4.8%",
    status: "ON_TRACK",
  },
  {
    id: "metric-compensation",
    label: "Compensation Pending",
    value: "₹8.42 Cr",
    supportingText: "Compensation amount currently pending.",
    trend: "-3.2%",
    status: "ATTENTION",
  },
  {
    id: "metric-attention",
    label: "Requires Attention",
    value: "17",
    unit: "items",
    supportingText: "Operational items requiring officer review.",
    trend: "-8.1%",
    status: "CRITICAL",
  },
];

const workflowStages: AcquisitionWorkflowStage[] = [
  {
    id: "stage-land-identification",
    sequence: 1,
    name: "Land Identification",
    activeCases: 38,
    progressPercentage: 74,
    status: "ATTENTION",
  },
  {
    id: "stage-preliminary-notification",
    sequence: 2,
    name: "Preliminary Notification",
    activeCases: 51,
    progressPercentage: 68,
    status: "ATTENTION",
  },
  {
    id: "stage-objection",
    sequence: 3,
    name: "Objection",
    activeCases: 34,
    progressPercentage: 76,
    status: "ON_TRACK",
  },
  {
    id: "stage-hearing",
    sequence: 4,
    name: "Hearing",
    activeCases: 42,
    progressPercentage: 71,
    status: "ATTENTION",
  },
  {
    id: "stage-valuation",
    sequence: 5,
    name: "Valuation",
    activeCases: 39,
    progressPercentage: 73,
    status: "ATTENTION",
  },
  {
    id: "stage-award",
    sequence: 6,
    name: "Award",
    activeCases: 27,
    progressPercentage: 82,
    status: "ON_TRACK",
  },
  {
    id: "stage-compensation",
    sequence: 7,
    name: "Compensation",
    activeCases: 48,
    progressPercentage: 69,
    status: "ATTENTION",
  },
  {
    id: "stage-possession",
    sequence: 8,
    name: "Possession",
    activeCases: 52,
    progressPercentage: 64,
    status: "DELAYED",
  },
];

const projectHealth: ProjectHealthSummary[] = [
  {
    id: "project-health-pun-001",
    projectId: "PRJ-PUN-001",
    projectName: "Pune Ring Road Development",
    district: "Pune",
    status: "ATTENTION",
    description:
      "Strong acquisition progress, with compensation and possession activities requiring continued review.",
  },
  {
    id: "project-health-nas-002",
    projectId: "PRJ-NAS-002",
    projectName: "Nashik Logistics Corridor",
    district: "Nashik",
    status: "DELAYED",
    description:
      "Workflow delays are concentrated around notification, hearing, compensation and possession activities.",
  },
  {
    id: "project-health-nag-003",
    projectId: "PRJ-NAG-003",
    projectName: "Nagpur Regional Infrastructure Project",
    district: "Nagpur",
    status: "ON_TRACK",
    description:
      "Overall acquisition progress remains stable with comparatively lower operational backlog.",
  },
];

const attentionItems: AttentionItem[] = [
  {
    id: "attention-compensation-pun",
    title: "Compensation pending requires review",
    description:
      "Multiple compensation records remain pending in the Pune Ring Road project.",
    priority: "HIGH",
    module: "COMPENSATION",
    route: "/app/compensation",
  },
  {
    id: "attention-possession-nas",
    title: "Possession workflow requires intervention",
    description:
      "Pending possession activities are affecting the downstream project schedule.",
    priority: "HIGH",
    module: "POSSESSION",
    route: "/app/possession",
  },
  {
    id: "attention-field-verification",
    title: "Field verification backlog",
    description:
      "Open field verification items require assignment and officer review.",
    priority: "MEDIUM",
    module: "FIELD_VERIFICATION",
    route: "/app/field-verification",
  },
  {
    id: "attention-documents",
    title: "Document version requires review",
    description:
      "A revised award document is available for record-lineage review.",
    priority: "MEDIUM",
    module: "DOCUMENTS",
    route: "/app/documents",
  },
];

const intelligenceSignals: IntelligenceSignal[] = [
  {
    id: "signal-satellite-change",
    title: "Potential land-use change detected",
    description:
      "Satellite observation indicates a possible change near an active acquisition parcel.",
    value: 87,
    module: "SATELLITE",
  },
  {
    id: "signal-ai-alert",
    title: "Potential boundary change detected",
    description:
      "AI-assisted imagery comparison identified a change requiring field verification.",
    value: 81,
    module: "AI_ALERTS",
  },
  {
    id: "signal-project-progress",
    title: "Project progress variance detected",
    description:
      "Observed project progress is below the current operational expectation.",
    value: 78,
    module: "AI_ALERTS",
  },
  {
    id: "signal-field-escalation",
    title: "Field verification escalation",
    description:
      "Several field verification items remain unresolved and require officer review.",
    value: 92,
    module: "FIELD_VERIFICATION",
  },
];

export const commandCenterData: CommandCenterDataset = {
  generatedAt: "2026-09-07T12:00:00+05:30",
  dataMode: "DEMO",
  metrics,
  workflowStages,
  projectHealth,
  attentionItems,
  intelligenceSignals,
};