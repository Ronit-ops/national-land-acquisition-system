import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  hasModuleAccess,
  type GovernmentModule,
} from "./roleAccess";
import { useAuth } from "./AuthContext";

type ModuleRouteGuardProps = {
  module: GovernmentModule;
  children: ReactNode;
};

function ModuleRouteGuard({
  module,
  children,
}: ModuleRouteGuardProps) {
  const { user, accessPolicy, isAuthenticated, isLoading } =
    useAuth();

  if (isLoading) {
    return (
      <main className="access-restricted__loading">
        Checking workspace access…
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!accessPolicy || !hasModuleAccess(user.role, module)) {
    return (
      <section className="access-restricted">
        <div className="access-restricted__card">
          <div className="access-restricted__icon">
            <span>!</span>
          </div>

          <span className="access-restricted__eyebrow">
            ACCESS CONTROL
          </span>

          <h1>Access restricted</h1>

          <p>
            Your current government role does not have access to
            this module.
          </p>

          <div className="access-restricted__details">
            <div>
              <span>ROLE</span>
              <strong>{user.designation}</strong>
            </div>

            <div>
              <span>JURISDICTION</span>
              <strong>{user.jurisdiction}</strong>
            </div>
          </div>

          <p className="access-restricted__note">
            Access is determined by role and jurisdiction policy.
            If you believe this access is incorrect, contact the
            designated system administrator.
          </p>
        </div>
      </section>
    );
  }

  return children;
}

export default ModuleRouteGuard;