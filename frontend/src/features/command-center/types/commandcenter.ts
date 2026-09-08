export type CommandCenterStatus =
  | "ON_TRACK"
  | "ATTENTION"
  | "DELAYED"
  | "CRITICAL";

export type CommandCenterPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type CommandCenterMetric = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  supportingText: string;
  trend?: string;
  status?: CommandCenterStatus;
};

export type AcquisitionWorkflowStage = {
  id: string;
  sequence: number;
  name: string;
  activeCases: number;
  progressPercentage: number;
  status: CommandCenterStatus;
};

export type ProjectHealthSummary = {
  id: string;
  projectId: string;
  projectName: string;
  district: string;
  status: CommandCenterStatus;
  description: string;
};

export type AttentionItem = {
  id: string;
  title: string;
  description: string;
  priority: CommandCenterPriority;
  module: string;
  route: string;
};

export type IntelligenceSignal = {
  id: string;
  title: string;
  description: string;
  value: number;
  module: "SATELLITE" | "AI_ALERTS" | "FIELD_VERIFICATION";
};

export type CommandCenterDataset = {
  generatedAt: string;
  dataMode: "DEMO";
  metrics: CommandCenterMetric[];
  workflowStages: AcquisitionWorkflowStage[];
  projectHealth: ProjectHealthSummary[];
  attentionItems: AttentionItem[];
  intelligenceSignals: IntelligenceSignal[];
};