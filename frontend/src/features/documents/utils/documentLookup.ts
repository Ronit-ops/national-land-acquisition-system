import { demoDocuments } from "../data/documents";
import type {
  DocumentRecord,
  DocumentType,
} from "../types/document";

export function findDocument(
  documentId: string,
): DocumentRecord | undefined {
  return demoDocuments.find(
    (document) => document.id === documentId,
  );
}

export function findDocumentByNumber(
  documentNumber: string,
): DocumentRecord | undefined {
  return demoDocuments.find(
    (document) =>
      document.documentNumber === documentNumber,
  );
}

export function getDocumentsByCase(
  acquisitionCaseId: string,
): DocumentRecord[] {
  return demoDocuments.filter(
    (document) =>
      document.acquisitionCaseId === acquisitionCaseId,
  );
}

export function getDocumentsByParcel(
  parcelId: string,
): DocumentRecord[] {
  return demoDocuments.filter(
    (document) => document.parcelId === parcelId,
  );
}

export function getDocumentsByType(
  type: DocumentType,
): DocumentRecord[] {
  return demoDocuments.filter(
    (document) => document.type === type,
  );
}

export function getCitizenVisibleDocuments(
  acquisitionCaseId: string,
): DocumentRecord[] {
  return demoDocuments.filter(
    (document) =>
      document.acquisitionCaseId === acquisitionCaseId &&
      document.citizenVisible,
  );
}

export function getCurrentDocumentVersions(
  acquisitionCaseId: string,
): DocumentRecord[] {
  return demoDocuments.filter(
    (document) =>
      document.acquisitionCaseId === acquisitionCaseId &&
      document.versionStatus === "CURRENT",
  );
}