import {
  demoDistrictReportSummaries,
  demoProjectReportSummaries,
  demoReportMetrics,
} from "../data/reportData";

import type {
  AcquisitionStage,
  DistrictReportSummary,
  ProjectReportSummary,
  ReportMetric,
  ReportPeriod,
  ReportScopeType,
  ReportStatus,
} from "../types/report";

export type ReportWorkspaceFilters = {
  scopeType: ReportScopeType;
  district: string;
  projectId: string;
  period: ReportPeriod;
  status: ReportStatus | "ALL";
  acquisitionStage: AcquisitionStage | "ALL";
};

export type ReportWorkspaceData = {
  metrics: ReportMetric[];
  districtSummaries: DistrictReportSummary[];
  projectSummaries: ProjectReportSummary[];
  availableDistricts: string[];
  availableProjects: ProjectReportSummary[];
  filters: ReportWorkspaceFilters;
};

export const defaultReportWorkspaceFilters: ReportWorkspaceFilters = {
  scopeType: "STATE",
  district: "ALL",
  projectId: "ALL",
  period: "CURRENT",
  status: "ALL",
  acquisitionStage: "ALL",
};

function matchesStatus(
  status: ReportStatus,
  selectedStatus: ReportStatus | "ALL",
): boolean {
  if (selectedStatus === "ALL") {
    return true;
  }

  return status === selectedStatus;
}

function matchesDistrict(
  district: string,
  selectedDistrict: string,
): boolean {
  if (selectedDistrict === "ALL") {
    return true;
  }

  return district === selectedDistrict;
}

function matchesProject(
  projectId: string,
  selectedProjectId: string,
): boolean {
  if (selectedProjectId === "ALL") {
    return true;
  }

  return projectId === selectedProjectId;
}

function matchesAcquisitionStage(
  project: ProjectReportSummary,
  selectedStage: AcquisitionStage | "ALL",
): boolean {
  if (selectedStage === "ALL") {
    return true;
  }

  return project.currentStageDistribution.some(
    (stage) => stage.stage === selectedStage,
  );
}

export function getAvailableDistricts(): string[] {
  return [
    ...new Set(
      demoDistrictReportSummaries.map(
        (report) => report.district,
      ),
    ),
  ].sort();
}

export function getAvailableProjects(): ProjectReportSummary[] {
  return demoProjectReportSummaries;
}

export function getFilteredDistrictSummaries(
  filters: ReportWorkspaceFilters,
): DistrictReportSummary[] {
  return demoDistrictReportSummaries.filter(
    (report) =>
      matchesDistrict(
        report.district,
        filters.district,
      ) &&
      matchesStatus(
        report.overallStatus,
        filters.status,
      ),
  );
}

export function getFilteredProjectSummaries(
  filters: ReportWorkspaceFilters,
): ProjectReportSummary[] {
  return demoProjectReportSummaries.filter(
    (project) =>
      matchesDistrict(
        project.district,
        filters.district,
      ) &&
      matchesProject(
        project.projectId,
        filters.projectId,
      ) &&
      matchesStatus(
        project.overallStatus,
        filters.status,
      ) &&
      matchesAcquisitionStage(
        project,
        filters.acquisitionStage,
      ),
  );
}

export function getFilteredReportMetrics(
  filters: ReportWorkspaceFilters,
): ReportMetric[] {
  if (
    filters.scopeType === "PROJECT" &&
    filters.projectId !== "ALL"
  ) {
    const project =
      demoProjectReportSummaries.find(
        (item) =>
          item.projectId ===
          filters.projectId,
      );

    if (!project) {
      return [];
    }

    return [
      {
        id: `${project.projectId}-ACTIVE`,
        label: "Active Acquisition Cases",
        value: project.activeCases,
        unit: "COUNT",
        status: project.overallStatus,
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Active acquisition cases recorded for the selected project.",
      },
      {
        id: `${project.projectId}-LAND`,
        label: "Land Acquired",
        value:
          project.acquiredLandHectares,
        unit: "HECTARES",
        status: project.overallStatus,
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Land area recorded as acquired for the selected project.",
      },
      {
        id: `${project.projectId}-COMPENSATION`,
        label: "Compensation Pending",
        value:
          project.compensation.totalPending,
        unit: "CURRENCY",
        status:
          project.compensation.totalPending >
          0
            ? "ATTENTION_REQUIRED"
            : "ON_TRACK",
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Recorded compensation amount pending for the selected project.",
      },
      {
        id: `${project.projectId}-DELAY`,
        label: "Delayed Cases",
        value: project.delayedCases,
        unit: "COUNT",
        status:
          project.delayedCases > 0
            ? "DELAYED"
            : "ON_TRACK",
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Acquisition cases currently reported as delayed.",
      },
      {
        id: `${project.projectId}-RR`,
        label: "R&R Pending",
        value: project.rAndR.pendingCases,
        unit: "COUNT",
        status:
          project.rAndR.pendingCases > 0
            ? "ATTENTION_REQUIRED"
            : "ON_TRACK",
        changePercentage: null,
        comparisonLabel: null,
        description:
          "R&R cases with pending activities.",
      },
      {
        id: `${project.projectId}-FIELD`,
        label: "Field Verification Pending",
        value:
          project.fieldVerification
            .pendingAssignments,
        unit: "COUNT",
        status:
          project.fieldVerification
            .pendingAssignments > 0
            ? "ATTENTION_REQUIRED"
            : "ON_TRACK",
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Field verification assignments awaiting completion.",
      },
    ];
  }

  if (
    filters.scopeType === "DISTRICT" &&
    filters.district !== "ALL"
  ) {
    const district =
      demoDistrictReportSummaries.find(
        (item) =>
          item.district === filters.district,
      );

    if (!district) {
      return [];
    }

    return [
      {
        id: `${district.district}-ACTIVE`,
        label: "Active Acquisition Cases",
        value: district.activeCases,
        unit: "COUNT",
        status: district.overallStatus,
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Active acquisition cases recorded for the selected district.",
      },
      {
        id: `${district.district}-LAND`,
        label: "Land Acquired",
        value:
          district.acquiredLandHectares,
        unit: "HECTARES",
        status: district.overallStatus,
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Land area recorded as acquired in the selected district.",
      },
      {
        id: `${district.district}-COMPENSATION`,
        label: "Compensation Pending",
        value:
          district.compensationPending,
        unit: "CURRENCY",
        status:
          district.compensationPending > 0
            ? "ATTENTION_REQUIRED"
            : "ON_TRACK",
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Recorded compensation amount pending in the selected district.",
      },
      {
        id: `${district.district}-DELAY`,
        label: "Delayed Cases",
        value: district.delayedCases,
        unit: "COUNT",
        status:
          district.delayedCases > 0
            ? "DELAYED"
            : "ON_TRACK",
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Acquisition cases currently reported as delayed.",
      },
      {
        id: `${district.district}-RR`,
        label: "R&R Pending",
        value: district.rAndRPending,
        unit: "COUNT",
        status:
          district.rAndRPending > 0
            ? "ATTENTION_REQUIRED"
            : "ON_TRACK",
        changePercentage: null,
        comparisonLabel: null,
        description:
          "R&R cases with pending activities.",
      },
      {
        id: `${district.district}-FIELD`,
        label: "Field Verification Pending",
        value:
          district.fieldVerificationPending,
        unit: "COUNT",
        status:
          district.fieldVerificationPending > 0
            ? "ATTENTION_REQUIRED"
            : "ON_TRACK",
        changePercentage: null,
        comparisonLabel: null,
        description:
          "Field verification assignments awaiting completion.",
      },
    ];
  }

  return demoReportMetrics.filter(
    (metric) =>
      matchesStatus(
        metric.status,
        filters.status,
      ),
  );
}

export function getReportWorkspaceData(
  filters: ReportWorkspaceFilters = defaultReportWorkspaceFilters,
): ReportWorkspaceData {
  return {
    metrics: getFilteredReportMetrics(filters),
    districtSummaries:
      getFilteredDistrictSummaries(filters),
    projectSummaries:
      getFilteredProjectSummaries(filters),
    availableDistricts:
      getAvailableDistricts(),
    availableProjects:
      getAvailableProjects(),
    filters,
  };
}