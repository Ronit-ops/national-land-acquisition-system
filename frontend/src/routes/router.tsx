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

import SatellitePage from "../pages/SatellitePage";
import SatelliteComparisonPage from "../pages/SatelliteComparisonPage";
import AIAlertReviewPage from "../pages/AIAlertReviewPage";

import NotificationsPage from "../pages/NotificationsPage";
import NotificationIssuancePage from "../pages/NotificationIssuancePage";
import NotificationDeliveryPage from "../pages/NotificationDeliveryPage";

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
        element: (
          <Navigate
            to="/app/command-center"
            replace
          />
        ),
      },

      /* =====================================================
         COMMAND CENTER
         ===================================================== */

      {
        path: "command-center",
        element: (
          <ModuleRouteGuard module="COMMAND_CENTER">
            <CommandCenterPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         PROCEEDINGS
         ===================================================== */

      {
        path: "proceedings",
        element: (
          <ModuleRouteGuard module="PROCEEDINGS">
            <ProceedingsPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         COMPENSATION
         ===================================================== */

      {
        path: "compensation",
        element: (
          <ModuleRouteGuard module="COMPENSATION">
            <CompensationPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         R&R
         ===================================================== */

      {
        path: "rr",
        element: (
          <ModuleRouteGuard module="RR">
            <RRPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         POSSESSION
         ===================================================== */

      {
        path: "possession",
        element: (
          <ModuleRouteGuard module="POSSESSION">
            <PossessionPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         FIELD VERIFICATION
         ===================================================== */

      {
        path: "field-verification",
        element: (
          <ModuleRouteGuard module="FIELD_VERIFICATION">
            <FieldVerificationReviewPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         GOVERNMENT USERS
         ===================================================== */

      {
        path: "government-users",
        element: (
          <ModuleRouteGuard module="USER_MANAGEMENT">
            <GovernmentUsersPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         GIS
         ===================================================== */

      {
        path: "gis",
        element: (
          <ModuleRouteGuard module="GIS">
            <GisPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         AUDIT
         ===================================================== */

      {
        path: "audit",
        element: (
          <ModuleRouteGuard module="AUDIT">
            <AuditPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         DOCUMENTS
         ===================================================== */

      {
        path: "documents",
        element: (
          <ModuleRouteGuard module="DOCUMENTS">
            <DocumentManagementPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         REPORTS / DECISION SUPPORT
         ===================================================== */

      {
        path: "reports",
        element: (
          <ModuleRouteGuard module="REPORTS">
            <DecisionSupportPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         SATELLITE INTELLIGENCE
         ===================================================== */

      {
        path: "satellite",
        element: (
          <ModuleRouteGuard module="SATELLITE">
            <SatellitePage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "satellite/comparison",
        element: (
          <ModuleRouteGuard module="SATELLITE">
            <SatelliteComparisonPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         AI ALERT REVIEW
         ===================================================== */

      {
        path: "satellite/alerts/:alertId",
        element: (
          <ModuleRouteGuard module="SATELLITE">
            <AIAlertReviewPage />
          </ModuleRouteGuard>
        ),
      },

      /* =====================================================
         NOTIFICATIONS
         ===================================================== */

      {
        path: "notifications",
        element: (
          <ModuleRouteGuard module="NOTIFICATIONS">
            <NotificationsPage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "notifications/issuance",
        element: (
          <ModuleRouteGuard module="NOTIFICATIONS">
            <NotificationIssuancePage />
          </ModuleRouteGuard>
        ),
      },

      {
        path: "notifications/delivery",
        element: (
          <ModuleRouteGuard module="NOTIFICATIONS">
            <NotificationDeliveryPage />
          </ModuleRouteGuard>
        ),
      },
    ],
  },
]);