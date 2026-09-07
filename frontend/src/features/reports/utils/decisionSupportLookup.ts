import {
  demoProjectReportSummaries,
} from "../data/reportData";

import type {
  BottleneckItem,
  DecisionSupportIndicator,
  ProjectReportSummary,
  ReportStatus,
} from "../types/report";

import {
  analyzeStageBottlenecks,
  generateProjectDecisionIndicators,
  getCriticalIndicators,
  getHumanReviewIndicators,
  getOverallDecisionSupportStatus,
} from "./decisionSupport";

export type ProjectDecisionSupport = {
  project: ProjectReportSummary;
  bottlenecks: BottleneckItem[];
  indicators: DecisionSupportIndicator[];
  criticalIndicators: DecisionSupportIndicator[];
  humanReviewIndicators: DecisionSupportIndicator[];
  overallStatus: ReportStatus;
};

export function getProjectDecisionSupport(
  project: ProjectReportSummary,
): ProjectDecisionSupport {
  const bottlenecks =
    analyzeStageBottlenecks(project);

  const indicators =
    generateProjectDecisionIndicators(project);

  return {
    project,
    bottlenecks,
    indicators,
    criticalIndicators:
      getCriticalIndicators(indicators),
    humanReviewIndicators:
      getHumanReviewIndicators(indicators),
    overallStatus:
      getOverallDecisionSupportStatus(
        indicators,
      ),
  };
}

export function getAllProjectDecisionSupport(): ProjectDecisionSupport[] {
  return demoProjectReportSummaries.map(
    (project: ProjectReportSummary) =>
      getProjectDecisionSupport(project),
  );
}

export function findProjectDecisionSupport(
  projectId: string,
): ProjectDecisionSupport | undefined {
  const project: ProjectReportSummary | undefined =
    demoProjectReportSummaries.find(
      (item: ProjectReportSummary) =>
        item.projectId === projectId,
    );

  if (!project) {
    return undefined;
  }

  return getProjectDecisionSupport(project);
}

export function getAllBottlenecks(): BottleneckItem[] {
  return getAllProjectDecisionSupport()
    .flatMap(
      (support: ProjectDecisionSupport) =>
        support.bottlenecks,
    )
    .sort(
      (a: BottleneckItem, b: BottleneckItem) =>
        b.delayDays - a.delayDays,
    );
}

export function getAllDecisionIndicators(): DecisionSupportIndicator[] {
  return getAllProjectDecisionSupport()
    .flatMap(
      (support: ProjectDecisionSupport) =>
        support.indicators,
    );
}

export function getCriticalDecisionIndicators(): DecisionSupportIndicator[] {
  return getAllDecisionIndicators().filter(
    (indicator: DecisionSupportIndicator) =>
      indicator.severity === "CRITICAL" ||
      indicator.severity === "HIGH",
  );
}

export function getHumanReviewDecisionIndicators(): DecisionSupportIndicator[] {
  return getAllDecisionIndicators().filter(
    (indicator: DecisionSupportIndicator) =>
      indicator.requiresHumanReview,
  );
}

export function getDecisionSupportSummary(): {
  totalProjects: number;
  totalBottlenecks: number;
  criticalBottlenecks: number;
  highPriorityBottlenecks: number;
  totalIndicators: number;
  criticalIndicators: number;
  highIndicators: number;
  humanReviewRequired: number;
} {
  const projectSupport =
    getAllProjectDecisionSupport();

  const bottlenecks =
    projectSupport.flatMap(
      (support: ProjectDecisionSupport) =>
        support.bottlenecks,
    );

  const indicators =
    projectSupport.flatMap(
      (support: ProjectDecisionSupport) =>
        support.indicators,
    );

  return {
    totalProjects: projectSupport.length,

    totalBottlenecks:
      bottlenecks.length,

    criticalBottlenecks:
      bottlenecks.filter(
        (item: BottleneckItem) =>
          item.priority === "CRITICAL",
      ).length,

    highPriorityBottlenecks:
      bottlenecks.filter(
        (item: BottleneckItem) =>
          item.priority === "HIGH",
      ).length,

    totalIndicators:
      indicators.length,

    criticalIndicators:
      indicators.filter(
        (item: DecisionSupportIndicator) =>
          item.severity === "CRITICAL",
      ).length,

    highIndicators:
      indicators.filter(
        (item: DecisionSupportIndicator) =>
          item.severity === "HIGH",
      ).length,

    humanReviewRequired:
      indicators.filter(
        (item: DecisionSupportIndicator) =>
          item.requiresHumanReview,
      ).length,
  };
}