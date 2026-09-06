import { createBrowserRouter, Navigate } from "react-router-dom";

import ApplicationLayout from "../layouts/ApplicationLayout";
import CommandCenterPage from "../pages/CommandCenterPage";
import CompensationPage from "../pages/CompensationPage";
import GisPage from "../pages/GisPage";
import PossessionPage from "../pages/PossessionPage";
import RRPage from "../pages/RRPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app" replace />,
  },

  {
    path: "/app",
    element: <ApplicationLayout />,

    children: [
      {
        index: true,
        element: <CommandCenterPage />,
      },

      {
        path: "projects",
        element: <PlaceholderPage title="Projects" />,
      },

      {
        path: "land",
        element: <PlaceholderPage title="Land & Parcels" />,
      },

      {
        path: "acquisition",
        element: <PlaceholderPage title="Acquisition" />,
      },

      {
        path: "proceedings",
        element: (
          <PlaceholderPage title="Notifications, Objections & Hearings" />
        ),
      },

      {
        path: "compensation",
        element: <CompensationPage />,
      },

      {
        path: "rr",
        element: <RRPage />,
      },

      {
        path: "possession",
        element: <PossessionPage />,
      },

      {
        path: "gis",
        element: <GisPage />,
      },

      {
        path: "satellite",
        element: (
          <PlaceholderPage title="Satellite Intelligence" />
        ),
      },

      {
        path: "ai-alerts",
        element: <PlaceholderPage title="AI Alerts" />,
      },

      {
        path: "field-verification",
        element: (
          <PlaceholderPage title="Field Verification" />
        ),
      },

      {
        path: "documents",
        element: <PlaceholderPage title="Documents" />,
      },

      {
        path: "reports",
        element: <PlaceholderPage title="Reports" />,
      },

      {
        path: "audit",
        element: (
          <PlaceholderPage title="Audit & Traceability" />
        ),
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/app" replace />,
  },
]);

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="application-welcome">
      <span className="application-welcome__eyebrow">
        MODULE FOUNDATION
      </span>

      <h2>{title}</h2>

      <p>
        This module has been registered in the application
        architecture and will be implemented in its
        dedicated development step.
      </p>
    </section>
  );
}