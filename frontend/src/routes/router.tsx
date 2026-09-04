import { createBrowserRouter } from "react-router-dom";
import ApplicationLayout from "../layouts/ApplicationLayout";
import HomePage from "../pages/HomePage";
import PublicLayout from "../layouts/PublicLayout";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    element: <ApplicationLayout />,
    children: [],
  },
]);