import { satelliteData } from "../data/satelliteData";
import type {
  AIChangeAlert,
  SatelliteComparison,
  SatelliteObservation,
  SatelliteProjectSummary,
} from "../types/satellite";

export type SatelliteScope = {
  jurisdiction: string;
  jurisdictionType: string;
};

export type SatelliteFilters = {
  district?: string;
  projectId?: string;
  severity?: AIChangeAlert["severity"];
  status?: AIChangeAlert["status"];
  changeType?: AIChangeAlert["changeType"];
};

function normalize(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function isStateWideScope(scope: SatelliteScope): boolean {
  return normalize(scope.jurisdictionType) === "state";
}

function matchesDistrict(
  district: string | undefined,
  scope: SatelliteScope,
): boolean {
  if (isStateWideScope(scope)) {
    return true;
  }

  if (!district) {
    return false;
  }

  return normalize(district) === normalize(scope.jurisdiction);
}

export function getSatelliteDataset(): typeof satelliteData {
  return satelliteData;
}

export function getSatelliteObservations(
  scope?: SatelliteScope,
): SatelliteObservation[] {
  if (!scope || isStateWideScope(scope)) {
    return satelliteData.observations;
  }

  return satelliteData.observations.filter((observation) =>
    matchesDistrict(observation.district, scope),
  );
}

export function getSatelliteComparisons(
  scope?: SatelliteScope,
): SatelliteComparison[] {
  if (!scope || isStateWideScope(scope)) {
    return satelliteData.comparisons;
  }

  const observationIds = new Set(
    getSatelliteObservations(scope).map((observation) => observation.id),
  );

  return satelliteData.comparisons.filter(
    (comparison) =>
      observationIds.has(comparison.beforeObservationId) ||
      observationIds.has(comparison.afterObservationId),
  );
}

export function getSatelliteAlerts(
  filters: SatelliteFilters = {},
  scope?: SatelliteScope,
): AIChangeAlert[] {
  return satelliteData.alerts.filter((alert) => {
    if (scope && !matchesDistrict(alert.district, scope)) {
      return false;
    }

    if (
      filters.district &&
      normalize(alert.district) !== normalize(filters.district)
    ) {
      return false;
    }

    if (filters.projectId && alert.projectId !== filters.projectId) {
      return false;
    }

    if (filters.severity && alert.severity !== filters.severity) {
      return false;
    }

    if (filters.status && alert.status !== filters.status) {
      return false;
    }

    if (filters.changeType && alert.changeType !== filters.changeType) {
      return false;
    }

    return true;
  });
}

export function getSatelliteProjectSummaries(
  scope?: SatelliteScope,
): SatelliteProjectSummary[] {
  if (!scope || isStateWideScope(scope)) {
    return satelliteData.projectSummaries;
  }

  return satelliteData.projectSummaries.filter((project) =>
    matchesDistrict(project.district, scope),
  );
}

export function getActiveSatelliteAlerts(
  scope?: SatelliteScope,
): AIChangeAlert[] {
  return getSatelliteAlerts({}, scope).filter(
    (alert) =>
      alert.status !== "VERIFIED" && alert.status !== "DISMISSED",
  );
}

export function getHighPrioritySatelliteAlerts(
  scope?: SatelliteScope,
): AIChangeAlert[] {
  return getActiveSatelliteAlerts(scope).filter(
    (alert) =>
      alert.severity === "HIGH" || alert.severity === "CRITICAL",
  );
}

export function getSatelliteSummary(scope?: SatelliteScope) {
  const observations = getSatelliteObservations(scope);
  const alerts = getActiveSatelliteAlerts(scope);
  const highPriorityAlerts = getHighPrioritySatelliteAlerts(scope);
  const projects = getSatelliteProjectSummaries(scope);

  return {
    observations: observations.length,
    activeAlerts: alerts.length,
    highPriorityAlerts: highPriorityAlerts.length,
    projectsMonitored: projects.length,
    fieldVerificationRequired: alerts.filter(
      (alert) => alert.status === "FIELD_VERIFICATION_REQUIRED",
    ).length,
  };
}