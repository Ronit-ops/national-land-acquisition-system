import type {
  AcquisitionStageMetric,
  BottleneckItem,
  DecisionSupportIndicator,
  ProjectReportSummary,
  ReportStatus,
} from "../types/report";

const STAGE_EXPECTED_DAYS: Record<string, number> = {
  PROJECT_REGISTERED: 7,
  LAND_IDENTIFICATION: 30,
  PRELIMINARY_NOTIFICATION: 45,
  OBJECTION: 30,
  HEARING: 30,
  DECLARATION: 30,
  VALUATION: 45,
  AWARD: 30,
  COMPENSATION: 45,
  R_AND_R: 90,
  POSSESSION: 30,
  CLOSED: 0,
};

function getBottleneckPriority(
  delayDays: number,
): BottleneckItem["priority"] {
  if (delayDays >= 60) {
    return "CRITICAL";
  }

  if (delayDays >= 30) {
    return "HIGH";
  }

  if (delayDays >= 15) {
    return "MEDIUM";
  }

  return "LOW";
}

export function calculateStageDelay(
  stage: AcquisitionStageMetric,
): number {
  if (stage.averageDaysInStage === null) {
    return 0;
  }

  const expectedDays =
    STAGE_EXPECTED_DAYS[stage.stage] ?? 30;

  return Math.max(
    0,
    Math.round(
      stage.averageDaysInStage - expectedDays,
    ),
  );
}

export function analyzeStageBottlenecks(
  project: ProjectReportSummary,
): BottleneckItem[] {
  const bottlenecks: BottleneckItem[] = [];

  project.currentStageDistribution.forEach(
    (stageMetric: AcquisitionStageMetric) => {
      const expectedDays =
        STAGE_EXPECTED_DAYS[stageMetric.stage] ?? 30;

      const actualDays =
        stageMetric.averageDaysInStage ?? 0;

      const delayDays = Math.max(
        0,
        Math.round(actualDays - expectedDays),
      );

      if (
        delayDays <= 0 &&
        stageMetric.delayedCases <= 0
      ) {
        return;
      }

      const priority =
        getBottleneckPriority(delayDays);

      bottlenecks.push({
        id: `BOT-${project.projectId}-${stageMetric.stage}`,
        caseReference: `${project.projectId}-${stageMetric.stage}`,
        projectName: project.projectName,
        district: project.district,
        stage: stageMetric.stage,
        stageLabel: stageMetric.label,
        daysInStage: Math.round(actualDays),
        expectedDays,
        delayDays,
        priority,
        reason:
          stageMetric.delayedCases > 0
            ? `${stageMetric.delayedCases} case(s) are currently delayed at the ${stageMetric.label.toLowerCase()} stage.`
            : `Average time at this stage is ${delayDays} day(s) above the configured expected duration.`,
        lastUpdated: project.generatedAt,
      });
    },
  );

  return bottlenecks.sort(
    (a, b) => b.delayDays - a.delayDays,
  );
}

export function generateProjectDecisionIndicators(
  project: ProjectReportSummary,
): DecisionSupportIndicator[] {
  const indicators: DecisionSupportIndicator[] = [];

  const bottlenecks =
    analyzeStageBottlenecks(project);

  if (project.delayedCases > 0) {
    indicators.push({
      id: `DS-${project.projectId}-DELAY`,
      title: "Acquisition Delay Risk",
      category: "DELAY",
      severity:
        project.delayedCases >= 10
          ? "CRITICAL"
          : project.delayedCases >= 5
            ? "HIGH"
            : "WARNING",
      value: project.delayedCases,
      unit: "COUNT",
      description:
        `${project.delayedCases} acquisition case(s) are currently reported as delayed.`,
      recommendedAction:
        "Review delayed cases by acquisition stage, identify the responsible workflow dependency, and assign follow-up action.",
      sourceReferences: [
        project.projectId,
        ...bottlenecks.map(
          (bottleneck) => bottleneck.id,
        ),
      ],
      requiresHumanReview: true,
    });
  }

  if (project.compensation.totalPending > 0) {
    indicators.push({
      id: `DS-${project.projectId}-COMPENSATION`,
      title: "Compensation Pending",
      category: "COMPENSATION",
      severity:
        project.compensation.totalPending >=
        50000000
          ? "HIGH"
          : "WARNING",
      value:
        project.compensation.totalPending,
      unit: "CURRENCY",
      description:
        `Recorded compensation pending for the project is ₹${project.compensation.totalPending.toLocaleString("en-IN")}.`,
      recommendedAction:
        "Review pending payment cases, verify payment prerequisites, and identify cases requiring officer follow-up.",
      sourceReferences: [
        project.projectId,
      ],
      requiresHumanReview: true,
    });
  }

  if (project.rAndR.pendingCases > 0) {
    indicators.push({
      id: `DS-${project.projectId}-RR`,
      title: "R&R Pending Cases",
      category: "R_AND_R",
      severity:
        project.rAndR.pendingCases >= 10
          ? "HIGH"
          : "WARNING",
      value:
        project.rAndR.pendingCases,
      unit: "COUNT",
      description:
        `${project.rAndR.pendingCases} R&R case(s) remain pending.`,
      recommendedAction:
        "Review pending rehabilitation and resettlement activities and identify cases requiring beneficiary-level follow-up.",
      sourceReferences: [
        project.projectId,
      ],
      requiresHumanReview: true,
    });
  }

  if (project.possession.overdueCases > 0) {
    indicators.push({
      id: `DS-${project.projectId}-POSSESSION`,
      title: "Possession Overdue",
      category: "POSSESSION",
      severity:
        project.possession.overdueCases >= 5
          ? "HIGH"
          : "WARNING",
      value:
        project.possession.overdueCases,
      unit: "COUNT",
      description:
        `${project.possession.overdueCases} possession case(s) are recorded as overdue.`,
      recommendedAction:
        "Review possession prerequisites, outstanding compensation or R&R dependencies, and field readiness before officer action.",
      sourceReferences: [
        project.projectId,
      ],
      requiresHumanReview: true,
    });
  }

  if (
    project.fieldVerification.pendingAssignments >
    0
  ) {
    indicators.push({
      id: `DS-${project.projectId}-FIELD`,
      title: "Field Verification Workload",
      category: "FIELD_VERIFICATION",
      severity:
        project.fieldVerification.pendingAssignments >=
        10
          ? "HIGH"
          : "WARNING",
      value:
        project.fieldVerification.pendingAssignments,
      unit: "COUNT",
      description:
        `${project.fieldVerification.pendingAssignments} field verification assignment(s) are pending.`,
      recommendedAction:
        "Review field workload, prioritize time-sensitive assignments, and verify evidence before updating the official record.",
      sourceReferences: [
        project.projectId,
      ],
      requiresHumanReview: true,
    });
  }

  if (
    project.fieldVerification.escalatedAssignments >
    0
  ) {
    indicators.push({
      id: `DS-${project.projectId}-FIELD-ESCALATION`,
      title: "Field Verification Escalations",
      category: "FIELD_VERIFICATION",
      severity:
        project.fieldVerification.escalatedAssignments >=
        3
          ? "HIGH"
          : "WARNING",
      value:
        project.fieldVerification.escalatedAssignments,
      unit: "COUNT",
      description:
        `${project.fieldVerification.escalatedAssignments} field verification assignment(s) require escalation or additional review.`,
      recommendedAction:
        "Review escalated assignments and determine whether additional field evidence or officer review is required.",
      sourceReferences: [
        project.projectId,
      ],
      requiresHumanReview: true,
    });
  }

  if (bottlenecks.length > 0) {
    const highestPriority =
      bottlenecks[0];

    indicators.push({
      id: `DS-${project.projectId}-BOTTLENECK`,
      title: "Primary Workflow Bottleneck",
      category: "DELAY",
      severity:
        highestPriority.priority === "CRITICAL"
          ? "CRITICAL"
          : highestPriority.priority === "HIGH"
            ? "HIGH"
            : "WARNING",
      value:
        highestPriority.delayDays,
      unit: "DAYS",
      description:
        `${highestPriority.stageLabel} shows the largest calculated delay in the current project report.`,
      recommendedAction:
        `Review the ${highestPriority.stageLabel.toLowerCase()} workflow, validate the underlying case data, and identify the operational dependency causing the delay.`,
      sourceReferences: [
        highestPriority.id,
        project.projectId,
      ],
      requiresHumanReview: true,
    });
  }

  if (
    project.totalLandRequiredHectares > 0 &&
    project.pendingLandHectares /
      project.totalLandRequiredHectares >
      0.4
  ) {
    indicators.push({
      id: `DS-${project.projectId}-WORKLOAD`,
      title: "High Pending Land Requirement",
      category: "WORKLOAD",
      severity: "WARNING",
      value: Math.round(
        (project.pendingLandHectares /
          project.totalLandRequiredHectares) *
          100,
      ),
      unit: "PERCENTAGE",
      description:
        "A substantial share of the project's required land remains pending acquisition.",
      recommendedAction:
        "Review pending parcels and acquisition cases to identify dependencies, objections, verification requirements, or other workflow blockers.",
      sourceReferences: [
        project.projectId,
      ],
      requiresHumanReview: true,
    });
  }

  return indicators;
}

export function getOverallDecisionSupportStatus(
  indicators: DecisionSupportIndicator[],
): ReportStatus {
  if (
    indicators.some(
      (indicator) =>
        indicator.severity === "CRITICAL",
    )
  ) {
    return "CRITICAL";
  }

  if (
    indicators.some(
      (indicator) =>
        indicator.severity === "HIGH",
    )
  ) {
    return "DELAYED";
  }

  if (
    indicators.some(
      (indicator) =>
        indicator.severity === "WARNING",
    )
  ) {
    return "ATTENTION_REQUIRED";
  }

  return "ON_TRACK";
}

export function getCriticalIndicators(
  indicators: DecisionSupportIndicator[],
): DecisionSupportIndicator[] {
  return indicators.filter(
    (indicator) =>
      indicator.severity === "CRITICAL" ||
      indicator.severity === "HIGH",
  );
}

export function getHumanReviewIndicators(
  indicators: DecisionSupportIndicator[],
): DecisionSupportIndicator[] {
  return indicators.filter(
    (indicator) =>
      indicator.requiresHumanReview,
  );
}