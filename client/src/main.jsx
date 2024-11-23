import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import Routes from "./routes/Routes.jsx";
import Success from "./components/Success.jsx";
import Failure from "./components/Failure.jsx";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Routes />}>
      <Route path="/" element={<App />} />
      <Route path="/success" element={<Success />} />
      <Route path="/failure" element={<Failure />} />
    </Route>,
  ])
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StrictMode>
);
