import {
  demoDocumentProvenance,
  demoDocumentProvenanceLinks,
} from "../data/documentProvenance";

import type {
  DocumentProvenance,
  DocumentProvenanceLink,
} from "../types/documentProvenance";

export function findDocumentProvenance(
  documentId: string,
): DocumentProvenance | undefined {
  return demoDocumentProvenance.find(
    (record) => record.documentId === documentId,
  );
}

export function getDocumentProvenanceLinks(
  documentId: string,
): DocumentProvenanceLink[] {
  return demoDocumentProvenanceLinks.filter(
    (link) => link.documentId === documentId,
  );
}

export function getDocumentsByProvenanceStatus(
  status: DocumentProvenance["recordStatus"],
): DocumentProvenance[] {
  return demoDocumentProvenance.filter(
    (record) => record.recordStatus === status,
  );
}

export function getDocumentsBySourceType(
  sourceType: DocumentProvenance["sourceType"],
): DocumentProvenance[] {
  return demoDocumentProvenance.filter(
    (record) => record.sourceType === sourceType,
  );
}

export function getProvenanceByCase(
  acquisitionCaseId: string,
): DocumentProvenance[] {
  return demoDocumentProvenance.filter(
    (record) => record.acquisitionCaseId === acquisitionCaseId,
  );
}

export function getProvenanceByParcel(
  parcelId: string,
): DocumentProvenance[] {
  return demoDocumentProvenance.filter(
    (record) => record.parcelId === parcelId,
  );
}

export function getRelatedDocumentIds(
  documentId: string,
): string[] {
  return demoDocumentProvenanceLinks
    .filter((link) => link.documentId === documentId)
    .filter(
      (link) =>
        link.linkType === "PREVIOUS_VERSION" ||
        link.linkType === "RELATED_DOCUMENT",
    )
    .map((link) => link.targetId);
}