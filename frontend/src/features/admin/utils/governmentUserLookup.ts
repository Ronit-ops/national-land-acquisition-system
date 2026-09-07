import {
  governmentUsers,
} from "../data/governmentUsers";
import type {
  GovernmentUser,
} from "../types/governmentUser";

export function findGovernmentUser(
  userId: string,
): GovernmentUser | null {
  return (
    governmentUsers.find(
      (user) => user.id === userId,
    ) ?? null
  );
}

export function findGovernmentUserByEmployeeReference(
  employeeReference: string,
): GovernmentUser | null {
  return (
    governmentUsers.find(
      (user) =>
        user.employeeReference === employeeReference,
    ) ?? null
  );
}

export function getGovernmentUsersByRole(
  role: GovernmentUser["role"],
): GovernmentUser[] {
  return governmentUsers.filter(
    (user) => user.role === role,
  );
}

export function getGovernmentUsersByJurisdiction(
  jurisdiction: string,
): GovernmentUser[] {
  return governmentUsers.filter(
    (user) => user.jurisdiction === jurisdiction,
  );
}

export function getActiveGovernmentUsers(): GovernmentUser[] {
  return governmentUsers.filter(
    (user) => user.status === "ACTIVE",
  );
}