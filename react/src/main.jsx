//React
import React from "react";
import ReactDOM from "react-dom/client";

//NextUI
import { NextUIProvider } from "@nextui-org/react";
//Router
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { routes } from "src/routes";

//Global styling
import "./index.css";

//Attach to DOM
const root = ReactDOM.createRoot(document.getElementById("root"));

//Set up react router
const router = createBrowserRouter(routes);
function App() {
  const navigate = useNavigate();
  return <NextUIProvider navigate={navigate} />;
}
//Render app
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);
