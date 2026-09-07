import { Navigate, createBrowserRouter } from "react-router-dom";

import AccessGatewayPage from "../pages/AccessGatewayPage";
import GovernmentLoginPage from "../pages/GovernmentLoginPage";
import CitizenPortalPage from "../pages/CitizenPortalPage";

import ApplicationLayout from "../layouts/ApplicationLayout";

import CommandCenterPage from "../pages/CommandCenterPage";
import ProceedingsPage from "../pages/ProceedingsPage";
import CompensationPage from "../pages/CompensationPage";
import RRPage from "../pages/RRPage";
import PossessionPage from "../pages/PossessionPage";
import FieldVerificationReviewPage from "../pages/FieldVerificationReviewPage";
import GovernmentUsersPage from "../pages/GovernmentUsersPage";
import GisPage from "../pages/GisPage";
import AuditPage from "../pages/AuditPage";

import DocumentManagementPage from "../features/documents/pages/DocumentManagementPage";
import DecisionSupportPage from "../features/reports/pages/DecisionSupportPage";

import ProtectedRoute from "../auth/ProtectedRoute";
import ModuleRouteGuard from "../auth/ModuleRouteGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AccessGatewayPage />,
  },

  {
    path: "/login",
    element: <GovernmentLoginPage />,
  },

  {
    path: "/citizen",
    element: <CitizenPortalPage />,
  },

  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <ApplicationLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <CommandCenterPage />,
      },

      {
        path: "proceedings",
        element: (
          <ModuleRouteGuard module="PROCEEDINGS">
            <ProceedingsPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "compensation",
        element: (
          <ModuleRouteGuard module="COMPENSATION">
            <CompensationPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "rr",
        element: (
          <ModuleRouteGuard module="RR">
            <RRPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "possession",
        element: (
          <ModuleRouteGuard module="POSSESSION">
            <PossessionPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "gis",
        element: (
          <ModuleRouteGuard module="GIS">
            <GisPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "field-verification/:verificationId",
        element: (
          <ModuleRouteGuard module="FIELD_VERIFICATION">
            <FieldVerificationReviewPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "users",
        element: (
          <ModuleRouteGuard module="USER_MANAGEMENT">
            <GovernmentUsersPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "audit",
        element: (
          <ModuleRouteGuard module="AUDIT">
            <AuditPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "documents",
        element: (
          <ModuleRouteGuard module="DOCUMENTS">
            <DocumentManagementPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "decision-support",
        element: (
          <ModuleRouteGuard module="REPORTS">
            <DecisionSupportPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "*",
        element: <Navigate to="/app" replace />,
      },
    ],
  },

  {
    path: "*",
    element: <AccessGatewayPage />,
  },
]);