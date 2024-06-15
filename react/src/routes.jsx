import routeFactory from "src/utils/routeFactory";
import routeFactoryAuth from "src/utils/routeFactoryAuth";

//Page wrapper components
import LandingPage from "src/pages/LandingPage";
import LoginPage from "src/pages/LoginPage";
import RegisterPage from "src/pages/RegisterPage";
import DashboardPage from "src/pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

//Define frontend routes
export const routes = [
  routeFactory("/", <LandingPage />),
  routeFactory("/login", <LoginPage />),
  routeFactory("/register", <RegisterPage />),

  //Protected routes
  routeFactoryAuth("/dashboard", <DashboardPage />),
  routeFactoryAuth("/settings", <SettingsPage />),
];
