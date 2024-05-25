import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Global styling
import "./assets/styles/global.css";

//Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Error from "./pages/Error";

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
    element: <Dashboard />,
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
