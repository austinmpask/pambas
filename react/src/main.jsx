//React
import React from "react";
import ReactDOM from "react-dom/client";

//Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "src/routes";

//Global styling sass + bulma
import "./styles/global.scss";

//Attach to DOM
const root = ReactDOM.createRoot(document.getElementById("root"));

//Set up react router
const router = createBrowserRouter(routes);

//Render app
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
