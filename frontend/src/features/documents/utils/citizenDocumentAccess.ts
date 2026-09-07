import type { DocumentRecord } from "../types/document";

/**
 * Determines whether a document is eligible for presentation
 * in the citizen-facing portal.
 *
 * Citizen visibility is intentionally based on the document's
 * explicit publication flag rather than government-role access.
 *
 * Government authorization and citizen publication are separate
 * concerns and must not be conflated.
 */
export function isCitizenVisibleDocument(
  document: DocumentRecord,
): boolean {
  if (!document.citizenVisible) {
    return false;
  }

  if (document.status === "WITHHELD") {
    return false;
  }

  return true;
}

/**
 * Returns only documents explicitly published for citizen visibility.
 */
export function getCitizenVisibleDocumentList(
  documents: DocumentRecord[],
): DocumentRecord[] {
  return documents.filter(isCitizenVisibleDocument);
}

/**
 * Finds a specific document only if it is eligible for citizen viewing.
 *
 * This prevents callers from accidentally retrieving an internal
 * document through a citizen-facing lookup.
 */
export function findCitizenVisibleDocument(
  documents: DocumentRecord[],
  documentId: string,
): DocumentRecord | undefined {
  return documents.find(
    (document) =>
      document.id === documentId &&
      isCitizenVisibleDocument(document),
  );
}

/**
 * Returns citizen-visible documents associated with an acquisition case.
 */
export function getCitizenDocumentsByCase(
  documents: DocumentRecord[],
  acquisitionCaseId: string,
): DocumentRecord[] {
  return documents.filter(
    (document) =>
      document.acquisitionCaseId === acquisitionCaseId &&
      isCitizenVisibleDocument(document),
  );
}

/**
 * Returns citizen-visible documents associated with a parcel.
 */
export function getCitizenDocumentsByParcel(
  documents: DocumentRecord[],
  parcelId: string,
): DocumentRecord[] {
  return documents.filter(
    (document) =>
      document.parcelId === parcelId &&
      isCitizenVisibleDocument(document),
  );
}