import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  useAuth,
  type GovernmentRole,
  type GovernmentUser,
} from "../auth/AuthContext";

type DemoGovernmentUser = GovernmentUser & {
  roleLabel: string;
};

const DEMO_USERS: DemoGovernmentUser[] = [
  {
    id: "USR-DEMO-PUN-001",
    name: "Anil Deshmukh",
    designation: "District Land Acquisition Officer",
    department: "Land Acquisition Department",
    organization: "Government of Maharashtra",
    role: "DISTRICT_LAND_OFFICER",
    roleLabel: "District Land Acquisition Officer",
    jurisdiction: "Pune District",
    jurisdictionType: "DISTRICT",
  },
  {
    id: "USR-DEMO-PUN-002",
    name: "Meera Kulkarni",
    designation: "Land Acquisition Officer",
    department: "Land Acquisition Department",
    organization: "Government of Maharashtra",
    role: "ACQUISITION_OFFICER",
    roleLabel: "Acquisition Officer",
    jurisdiction: "Pune District",
    jurisdictionType: "DISTRICT",
  },
  {
    id: "USR-DEMO-NAS-001",
    name: "Rahul More",
    designation: "Project Authority",
    department: "Project Implementation Authority",
    organization: "Government of Maharashtra",
    role: "PROJECT_AUTHORITY",
    roleLabel: "Project Authority",
    jurisdiction: "Nashik Industrial Connectivity Project",
    jurisdictionType: "PROJECT",
  },
  {
    id: "USR-DEMO-NAG-001",
    name: "Priya Joshi",
    designation: "Revenue Officer",
    department: "Revenue Department",
    organization: "Government of Maharashtra",
    role: "REVENUE_OFFICER",
    roleLabel: "Revenue Officer",
    jurisdiction: "Nagpur District",
    jurisdictionType: "DISTRICT",
  },
  {
    id: "USR-DEMO-PUN-003",
    name: "Sanjay Patil",
    designation: "Field Verification Officer",
    department: "Land Acquisition Department",
    organization: "Government of Maharashtra",
    role: "FIELD_VERIFICATION_OFFICER",
    roleLabel: "Field Verification Officer",
    jurisdiction: "Pune District",
    jurisdictionType: "DISTRICT",
  },
  {
    id: "USR-DEMO-MH-001",
    name: "Vikram Shah",
    designation: "State Administrator",
    department: "Land Acquisition Department",
    organization: "Government of Maharashtra",
    role: "STATE_ADMINISTRATOR",
    roleLabel: "State Administrator",
    jurisdiction: "Maharashtra",
    jurisdictionType: "STATE",
  },
];

const ROLE_DESCRIPTIONS: Record<GovernmentRole, string> = {
  DISTRICT_LAND_OFFICER:
    "District-level operational oversight of land acquisition cases, parcels and downstream processes.",
  ACQUISITION_OFFICER:
    "Operational management of acquisition cases, proceedings, valuation and compensation workflows.",
  PROJECT_AUTHORITY:
    "Project-level monitoring of land requirements, acquisition progress and project delivery.",
  REVENUE_OFFICER:
    "Revenue and land-record oriented access for parcel and right-holder verification workflows.",
  FIELD_VERIFICATION_OFFICER:
    "Field-oriented review of assigned parcels, evidence and AI-generated observations.",
  STATE_ADMINISTRATOR:
    "State-level monitoring, administration, reporting and cross-district oversight.",
};

function GovernmentLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [selectedUserId, setSelectedUserId] = useState(
    DEMO_USERS[0].id,
  );

  const selectedUser = useMemo(
    () =>
      DEMO_USERS.find(
        (user) => user.id === selectedUserId,
      ) ?? DEMO_USERS[0],
    [selectedUserId],
  );

  const handleDemoLogin = () => {
    login(selectedUser);

    const requestedPath =
      (
        location.state as
          | { from?: string }
          | null
          | undefined
      )?.from ?? "/app";

    navigate(requestedPath, { replace: true });
  };

  return (
    <main className="government-login">
      <header className="government-login__header">
        <div className="government-login__header-inner">
          <div className="government-login__brand">
            <div
              className="government-login__brand-mark"
              aria-hidden="true"
            >
              <Building2 size={21} />
            </div>

            <div>
              <strong>
                National Land Acquisition System
              </strong>

              <span>
                Government Officer Access
              </span>
            </div>
          </div>

          <div className="government-login__secure">
            <ShieldCheck size={16} aria-hidden="true" />
            Secure government workspace
          </div>
        </div>
      </header>

      <section className="government-login__main">
        <div className="government-login__card">
          <div className="government-login__icon">
            <LockKeyhole size={23} />
          </div>

          <span className="government-login__eyebrow">
            GOVERNMENT ACCESS
          </span>

          <h1>Sign in to the officer workspace</h1>

          <p className="government-login__description">
            Authorized government users will access land
            acquisition records according to their assigned role,
            department and jurisdiction.
          </p>

          <div className="government-login__field">
            <label htmlFor="demo-government-user">
              Demonstration identity
            </label>

            <div className="government-login__select-wrapper">
              <select
                id="demo-government-user"
                value={selectedUserId}
                onChange={(event) =>
                  setSelectedUserId(event.target.value)
                }
                aria-describedby="demo-role-description"
              >
                {DEMO_USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} — {user.roleLabel}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="government-login__identity">
            <div className="government-login__identity-icon">
              <UserRound size={18} />
            </div>

            <div className="government-login__identity-content">
              <span className="government-login__identity-label">
                DEMONSTRATION USER
              </span>

              <strong>{selectedUser.name}</strong>

              <p>{selectedUser.designation}</p>

              <p>
                {selectedUser.organization} ·{" "}
                {selectedUser.jurisdiction}
              </p>
            </div>

            <CheckCircle2
              className="government-login__identity-check"
              size={18}
              aria-label="Selected demonstration identity"
            />
          </div>

          <div
            className="government-login__role-context"
            id="demo-role-description"
          >
            <div>
              <span>ROLE</span>
              <strong>{selectedUser.roleLabel}</strong>
            </div>

            <div>
              <span>JURISDICTION</span>
              <strong>{selectedUser.jurisdiction}</strong>
            </div>

            <p>{ROLE_DESCRIPTIONS[selectedUser.role]}</p>
          </div>

          <button
            type="button"
            className="government-login__button"
            onClick={handleDemoLogin}
          >
            Continue with demonstration access
            <ArrowRight size={17} aria-hidden="true" />
          </button>

          <div className="government-login__notice">
            <ShieldCheck size={16} aria-hidden="true" />

            <p>
              <strong>Demonstration environment.</strong>{" "}
              This prototype does not connect to a real government
              SSO, Aadhaar, OTP, identity provider, or departmental
              authentication service.
            </p>
          </div>

          <button
            type="button"
            className="government-login__back"
            onClick={() => navigate("/")}
          >
            ← Back to access gateway
          </button>
        </div>
      </section>

      <footer className="government-login__footer">
        Government operational access · Demonstration environment
      </footer>
    </main>
  );
}

export default GovernmentLoginPage;