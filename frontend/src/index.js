import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Global styling sass + Bulma
import "./assets/styles/styles.scss";

//Pages
import AuthWrapper from "./pages/AuthWrapper";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Error from "./pages/Error";

import NavBar from "./components/NavBar/NavBar";

//Assign root for vdom
const root = ReactDOM.createRoot(document.getElementById("root"));

//Define frontend endpoints
const endpoints = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthWrapper>
        <NavBar />
        <Dashboard />
      </AuthWrapper>
    ),
  },
  {
    path: "/settings",
    element: (
      <AuthWrapper>
        <NavBar />
        <Settings />
      </AuthWrapper>
    ),
  },
  {
    path: "/error",
    element: <Error />,
  },
];

//Add generic error page for now to each page
endpoints.forEach((endpoint) => {
  endpoint.errorElement = <Error />;
});

//Config router with endpoints and render
const router = createBrowserRouter(endpoints);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
