import { commandCenterData } from "../data/commandCenterData";
import type {
  AttentionItem,
  AcquisitionWorkflowStage,
  CommandCenterDataset,
  CommandCenterMetric,
  IntelligenceSignal,
  ProjectHealthSummary,
} from "../types/commandcenter";

export type CommandCenterScope = {
  jurisdiction: string;
  jurisdictionType: string;
};

export type CommandCenterFilters = {
  district?: string;
  status?: string;
  priority?: string;
  module?: string;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function isStateWideScope(scope: CommandCenterScope): boolean {
  return normalize(scope.jurisdictionType) === "state";
}

function matchesDistrict(
  district: string,
  scope: CommandCenterScope,
): boolean {
  if (isStateWideScope(scope)) {
    return true;
  }

  return normalize(district) === normalize(scope.jurisdiction);
}

export function getCommandCenterDataset(): CommandCenterDataset {
  return commandCenterData;
}

export function getCommandCenterMetrics(): CommandCenterMetric[] {
  return commandCenterData.metrics;
}

export function getCommandCenterWorkflowStages(): AcquisitionWorkflowStage[] {
  return commandCenterData.workflowStages;
}

export function getCommandCenterProjectHealth(
  scope?: CommandCenterScope,
): ProjectHealthSummary[] {
  if (!scope || isStateWideScope(scope)) {
    return commandCenterData.projectHealth;
  }

  return commandCenterData.projectHealth.filter((project) =>
    matchesDistrict(project.district, scope),
  );
}

export function getCommandCenterAttentionItems(
  filters: CommandCenterFilters = {},
  scope?: CommandCenterScope,
): AttentionItem[] {
  return commandCenterData.attentionItems.filter((item) => {
    if (filters.priority && item.priority !== filters.priority) {
      return false;
    }

    if (filters.module && item.module !== filters.module) {
      return false;
    }

    if (
      scope &&
      !isStateWideScope(scope) &&
      item.module !== "FIELD_VERIFICATION" &&
      !matchesDistrict(
        getDistrictFromRouteReference(item.route),
        scope,
      )
    ) {
      return false;
    }

    return true;
  });
}

export function getCommandCenterIntelligenceSignals(
  filters: CommandCenterFilters = {},
  scope?: CommandCenterScope,
): IntelligenceSignal[] {
  return commandCenterData.intelligenceSignals.filter((signal) => {
    if (filters.module && signal.module !== filters.module) {
      return false;
    }

    if (
      scope &&
      !isStateWideScope(scope) &&
      !matchesDistrict(
        getDistrictFromSignal(signal),
        scope,
      )
    ) {
      return false;
    }

    return true;
  });
}

export function getCommandCenterProjectsByDistrict(
  district: string,
): ProjectHealthSummary[] {
  if (!district || district === "ALL") {
    return commandCenterData.projectHealth;
  }

  return commandCenterData.projectHealth.filter(
    (project) =>
      normalize(project.district) === normalize(district),
  );
}

export function getCommandCenterAttentionByPriority(
  priority: string,
): AttentionItem[] {
  if (!priority || priority === "ALL") {
    return commandCenterData.attentionItems;
  }

  return commandCenterData.attentionItems.filter(
    (item) => item.priority === priority,
  );
}

export function getCommandCenterSignalsByModule(
  module: string,
): IntelligenceSignal[] {
  if (!module || module === "ALL") {
    return commandCenterData.intelligenceSignals;
  }

  return commandCenterData.intelligenceSignals.filter(
    (signal) => signal.module === module,
  );
}

export function getScopedCommandCenterDataset(
  scope: CommandCenterScope,
): CommandCenterDataset {
  const projectHealth = getCommandCenterProjectHealth(scope);

  const attentionItems = getCommandCenterAttentionItems(
    {},
    scope,
  );

  const intelligenceSignals =
    getCommandCenterIntelligenceSignals({}, scope);

  return {
    ...commandCenterData,
    projectHealth,
    attentionItems,
    intelligenceSignals,
  };
}

export function getCommandCenterSummary(
  scope?: CommandCenterScope,
) {
  const dataset = scope
    ? getScopedCommandCenterDataset(scope)
    : commandCenterData;

  return {
    generatedAt: dataset.generatedAt,
    dataMode: dataset.dataMode,
    metricCount: dataset.metrics.length,
    workflowStageCount: dataset.workflowStages.length,
    projectCount: dataset.projectHealth.length,
    attentionCount: dataset.attentionItems.length,
    intelligenceSignalCount:
      dataset.intelligenceSignals.length,
  };
}

/**
 * Demo-only district inference.
 *
 * The current Command Center type model does not store district
 * directly on AttentionItem or IntelligenceSignal. Until the
 * backend introduces authoritative references, these helpers
 * provide deterministic demo scoping from existing identifiers.
 */
function getDistrictFromRouteReference(
  route: string,
): string {
  if (route.includes("pun")) {
    return "Pune";
  }

  if (route.includes("nas")) {
    return "Nashik";
  }

  if (route.includes("nag")) {
    return "Nagpur";
  }

  /*
   * Generic module routes currently do not contain a district.
   * Returning an empty value prevents an unscoped item from being
   * incorrectly attributed to a specific district.
   */
  return "";
}

function getDistrictFromSignal(
  signal: IntelligenceSignal,
): string {
  /*
   * Current demo identifiers encode the operational origin.
   * This is temporary and will be replaced by an authoritative
   * district/project reference from the backend.
   */
  if (signal.id.includes("pun")) {
    return "Pune";
  }

  if (signal.id.includes("nas")) {
    return "Nashik";
  }

  if (signal.id.includes("nag")) {
    return "Nagpur";
  }

  return "";
}