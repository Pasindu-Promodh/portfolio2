import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import { initAnalytics } from "./Analytics/logger";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

// Old links used hash routing (#/project/5); move them to the real path.
if (location.hash.startsWith("#/")) {
  history.replaceState(null, "", basename + location.hash.slice(1));
}

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "projects", element: <ProjectsPage /> },
        { path: "project/:id", element: <ProjectPage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  { basename }
);

initAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
