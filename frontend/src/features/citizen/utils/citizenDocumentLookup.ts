import { citizenDocuments } from "../data/citizenDocuments";
import type {
  CitizenDocument,
  CitizenDocumentType,
} from "../types/citizenDocument";

/**
 * Determines whether a citizen document is safe to expose
 * through the citizen-facing portal.
 *
 * Citizen visibility is controlled explicitly by the document
 * publication flag.
 *
 * A document that is not citizen-visible must never be returned
 * by a citizen-facing lookup.
 */
export function isCitizenVisibleDocument(
  document: CitizenDocument,
): boolean {
  return document.citizenVisible;
}

/**
 * Returns all documents associated with an acquisition case
 * that are explicitly published for citizen visibility.
 */
export function getCitizenDocuments(
  caseReference: string,
): CitizenDocument[] {
  return citizenDocuments.filter(
    (document) =>
      document.caseReference === caseReference &&
      isCitizenVisibleDocument(document),
  );
}

/**
 * Finds a document by ID only when it is citizen-visible.
 *
 * This prevents a citizen-facing caller from accidentally
 * retrieving an internal document by directly supplying its ID.
 */
export function findCitizenDocument(
  documentId: string,
): CitizenDocument | undefined {
  return citizenDocuments.find(
    (document) =>
      document.id === documentId &&
      isCitizenVisibleDocument(document),
  );
}

/**
 * Finds a document by its public reference number only when
 * it is citizen-visible.
 */
export function findCitizenDocumentByReference(
  referenceNumber: string,
): CitizenDocument | undefined {
  return citizenDocuments.find(
    (document) =>
      document.referenceNumber === referenceNumber &&
      isCitizenVisibleDocument(document),
  );
}

/**
 * Returns all currently citizen-visible documents.
 *
 * Useful for citizen dashboards, reporting and future
 * document-search functionality.
 */
export function getAllCitizenVisibleDocuments(): CitizenDocument[] {
  return citizenDocuments.filter(isCitizenVisibleDocument);
}

/**
 * Returns citizen-visible documents of a specific type.
 */
export function getCitizenDocumentsByType(
  type: CitizenDocumentType,
): CitizenDocument[] {
  return citizenDocuments.filter(
    (document) =>
      document.type === type &&
      isCitizenVisibleDocument(document),
  );
}