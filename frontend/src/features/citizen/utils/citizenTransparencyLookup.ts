import {
  getCitizenTransparencyDataset as loadCitizenTransparencyDataset,
} from "../data/citizenTransparency";

import type {
  CitizenInformationVisibility,
  CitizenPublication,
  CitizenPublicationStatus,
  CitizenProjectTransparency,
  CitizenTransparencyDataset,
  CitizenTransparencySummary,
  CitizenTransparencySource,
  CitizenTransparencyItemType,
} from "../types/citizenTransparency";

export type CitizenTransparencyScope = {
  caseReference?: string;
  projectId?: string;
  district?: string;
};

export type CitizenPublicationFilters = {
  type?: CitizenTransparencyItemType;
  publicationStatus?: CitizenPublicationStatus;
  visibility?: CitizenInformationVisibility;
  source?: CitizenTransparencySource;
  caseReference?: string;
  projectId?: string;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Central citizen-publication security gate.
 *
 * A record must:
 * 1. explicitly allow citizen visibility,
 * 2. not be restricted,
 * 3. have a published status.
 *
 * Internal, withdrawn, scheduled, or restricted records
 * never leave this boundary.
 */
function isCitizenVisible(
  publication: CitizenPublication,
): boolean {
  return (
    publication.citizenVisible === true &&
    publication.visibility !== "RESTRICTED" &&
    publication.publicationStatus === "PUBLISHED"
  );
}

/**
 * Applies case/project/district scope after the
 * publication has passed the citizen visibility gate.
 *
 * When a scope is explicitly requested, the matching
 * identifier must also exist on the publication.
 */
function matchesScope(
  publication: CitizenPublication,
  scope: CitizenTransparencyScope,
): boolean {
  if (scope.caseReference) {
    if (!publication.caseReference) {
      return false;
    }

    if (
      normalize(publication.caseReference) !==
      normalize(scope.caseReference)
    ) {
      return false;
    }
  }

  if (scope.projectId) {
    if (!publication.projectId) {
      return false;
    }

    if (
      normalize(publication.projectId) !==
      normalize(scope.projectId)
    ) {
      return false;
    }
  }

  /*
   * CitizenPublication currently does not contain a district
   * field. Therefore district filtering is intentionally not
   * inferred from unrelated fields.
   *
   * District-aware publication filtering can be added when the
   * authoritative publication model carries a district ID/code.
   */
  if (scope.district) {
    return true;
  }

  return true;
}

/**
 * Returns the complete transparency dataset.
 *
 * This function is intentionally not used directly by the
 * citizen UI for displaying records because it can contain
 * restricted/internal demonstration records.
 */
export function getCitizenTransparencyDataset(): CitizenTransparencyDataset {
  return loadCitizenTransparencyDataset();
}

/**
 * Returns only records that have explicitly passed the
 * citizen publication security gate.
 */
export function getPublishedCitizenInformation(
  scope: CitizenTransparencyScope = {},
): CitizenPublication[] {
  const dataset = loadCitizenTransparencyDataset();

  return dataset.publications.filter(
    (publication) =>
      isCitizenVisible(publication) &&
      matchesScope(publication, scope),
  );
}

/**
 * Returns published notifications available to citizens.
 */
export function getPublishedCitizenNotifications(
  scope: CitizenTransparencyScope = {},
): CitizenPublication[] {
  return getPublishedCitizenInformation(scope).filter(
    (publication) =>
      publication.type === "NOTIFICATION",
  );
}

/**
 * Returns published case updates for a specific case.
 */
export function getCitizenCaseUpdates(
  caseReference: string,
): CitizenPublication[] {
  return getPublishedCitizenInformation({
    caseReference,
  }).filter(
    (publication) =>
      publication.type === "CASE_UPDATE",
  );
}

/**
 * Returns published information associated with
 * a specific project.
 */
export function getCitizenProjectPublications(
  projectId: string,
): CitizenPublication[] {
  return getPublishedCitizenInformation({
    projectId,
  });
}

/**
 * Returns upcoming citizen-visible hearings.
 */
export function getUpcomingCitizenHearings(
  scope: CitizenTransparencyScope = {},
): CitizenPublication[] {
  const now = new Date();

  return getPublishedCitizenInformation(scope)
    .filter(
      (publication) =>
        publication.type === "HEARING" &&
        publication.effectiveDate !== null,
    )
    .filter((publication) => {
      const hearingDate = new Date(
        `${publication.effectiveDate}T00:00:00`,
      );

      return hearingDate >= now;
    })
    .sort((first, second) => {
      return (
        new Date(
          `${first.effectiveDate}T00:00:00`,
        ).getTime() -
        new Date(
          `${second.effectiveDate}T00:00:00`,
        ).getTime()
      );
    });
}

/**
 * Returns citizen-visible publications by type.
 */
export function getCitizenPublicationsByType(
  type: CitizenTransparencyItemType,
  scope: CitizenTransparencyScope = {},
): CitizenPublication[] {
  return getPublishedCitizenInformation(scope).filter(
    (publication) =>
      publication.type === type,
  );
}

/**
 * Finds a citizen-visible publication by reference number.
 */
export function findCitizenPublication(
  referenceNumber: string,
): CitizenPublication | undefined {
  const normalizedReference =
    normalize(referenceNumber);

  if (!normalizedReference) {
    return undefined;
  }

  return getPublishedCitizenInformation().find(
    (publication) =>
      publication.referenceNumber !== null &&
      normalize(publication.referenceNumber) ===
        normalizedReference,
  );
}

/**
 * Finds a citizen-visible publication by ID.
 */
export function findCitizenPublicationById(
  publicationId: string,
): CitizenPublication | undefined {
  return getPublishedCitizenInformation().find(
    (publication) =>
      publication.id === publicationId,
  );
}

/**
 * Returns projects that are publicly published.
 */
export function getPublishedCitizenProjects(): CitizenProjectTransparency[] {
  const dataset = loadCitizenTransparencyDataset();

  return dataset.projects.filter(
    (project) =>
      project.publicInformationStatus === "PUBLISHED" &&
      project.visibility !== "RESTRICTED",
  );
}

/**
 * Finds a published citizen project by ID.
 */
export function findCitizenProject(
  projectId: string,
): CitizenProjectTransparency | undefined {
  return getPublishedCitizenProjects().find(
    (project) =>
      project.projectId === projectId,
  );
}

/**
 * Returns all citizen-visible publications for a case.
 */
export function getCitizenCaseTransparency(
  caseReference: string,
): CitizenPublication[] {
  return getPublishedCitizenInformation({
    caseReference,
  }).sort((first, second) => {
    return (
      new Date(second.lastUpdated).getTime() -
      new Date(first.lastUpdated).getTime()
    );
  });
}

/**
 * Returns the most recently published citizen information.
 */
export function getRecentCitizenUpdates(
  limit = 5,
  scope: CitizenTransparencyScope = {},
): CitizenPublication[] {
  return getPublishedCitizenInformation(scope)
    .sort((first, second) => {
      return (
        new Date(second.lastUpdated).getTime() -
        new Date(first.lastUpdated).getTime()
      );
    })
    .slice(0, Math.max(0, limit));
}

/**
 * Returns the citizen-visible transparency summary.
 */
export function getCitizenTransparencySummary(
  scope: CitizenTransparencyScope = {},
): CitizenTransparencySummary {
  const publications =
    getPublishedCitizenInformation(scope);

  const activeCases = publications.filter(
    (publication) =>
      publication.type === "CASE_UPDATE",
  ).length;

  const publishedNotifications =
    publications.filter(
      (publication) =>
        publication.type === "NOTIFICATION",
    ).length;

  const upcomingHearings =
    getUpcomingCitizenHearings(scope).length;

  const availableDocuments =
    publications.filter(
      (publication) =>
        publication.type === "DOCUMENT",
    ).length;

  const recentUpdates =
    publications.filter(
      (publication) =>
        publication.type === "CASE_UPDATE" ||
        publication.type === "PROJECT",
    ).length;

  const timestamps = publications
    .map((publication) =>
      new Date(
        publication.lastUpdated,
      ).getTime(),
    )
    .filter(
      (timestamp) =>
        !Number.isNaN(timestamp),
    );

  const latestTimestamp =
    timestamps.length > 0
      ? Math.max(...timestamps)
      : Date.now();

  return {
    publishedNotifications,
    upcomingHearings,
    activeCases,
    availableDocuments,
    recentUpdates,
    lastUpdated: new Date(
      latestTimestamp,
    ).toISOString(),
  };
}

/**
 * Generic filtered citizen-publication lookup.
 *
 * The visibility/security gate is always applied first.
 * Consumers cannot bypass citizen publication rules by
 * supplying different filters.
 */
export function getCitizenPublications(
  filters: CitizenPublicationFilters = {},
): CitizenPublication[] {
  return getPublishedCitizenInformation({
    caseReference: filters.caseReference,
    projectId: filters.projectId,
  }).filter((publication) => {
    if (
      filters.type &&
      publication.type !== filters.type
    ) {
      return false;
    }

    if (
      filters.publicationStatus &&
      publication.publicationStatus !==
        filters.publicationStatus
    ) {
      return false;
    }

    if (
      filters.visibility &&
      publication.visibility !==
        filters.visibility
    ) {
      return false;
    }

    if (
      filters.source &&
      publication.source !== filters.source
    ) {
      return false;
    }

    return true;
  });
}