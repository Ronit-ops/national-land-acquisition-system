import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { AuthProvider } from "./auth/AuthContext";

import "./index.css";
import "./styles/application.css";
import "./styles/compensation.css";
import "./styles/rr.css";
import "./styles/possession.css";
import "./styles/gis.css";
import "./styles/field-verification.css";
import "./styles/proceedings.css";
import "./styles/citizen.css";
import "./styles/access-gateway.css";
import "./styles/government-login.css";
import "./styles/government-login-demo.css";
import "./styles/command-center.css";
import "./styles/access-restricted.css";
import "./styles/government-users.css";
import "./styles/audit.css";
import "./styles/documents.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);