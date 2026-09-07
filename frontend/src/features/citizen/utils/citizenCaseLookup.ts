import { citizenCaseRecords } from "../data/citizenCases";
import type { CitizenCaseRecord } from "../types/citizenCase";

/**
 * Demo-only lookup.
 *
 * Production implementation must NOT use an unrestricted public
 * case-reference lookup. It must resolve an authenticated citizen
 * identity and return only cases the citizen is authorized to view.
 */
export function findCitizenCase(
  caseReference: string,
): CitizenCaseRecord | undefined {
  const normalizedReference = caseReference.trim().toUpperCase();

  if (!normalizedReference) {
    return undefined;
  }

  return citizenCaseRecords.find(
    (record) =>
      record.caseReference.toUpperCase() === normalizedReference ||
      record.id.toUpperCase() === normalizedReference,
  );
}