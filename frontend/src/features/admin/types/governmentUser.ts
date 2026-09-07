import type {
  GovernmentRole,
} from "../../../auth/AuthContext";
import type {
  JurisdictionType,
} from "../../../auth/roleAccess";

export type GovernmentUserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export type GovernmentUser = {
  id: string;
  employeeReference: string;
  name: string;
  designation: string;
  department: string;
  organization: string;
  role: GovernmentRole;
  jurisdiction: string;
  jurisdictionType: JurisdictionType;
  status: GovernmentUserStatus;
  lastAccessAt: string | null;
  createdAt: string;
  updatedAt: string;
};