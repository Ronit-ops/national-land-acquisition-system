import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes/router";

import "./index.css";
import "./styles/application.css";
import "./styles/compensation.css";
import "./styles/rr.css";
import "./styles/possession.css";
import "./styles/gis.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);