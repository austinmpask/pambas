import routeFactory from "src/utils/routeFactory";
import routeFactoryAuth from "src/utils/routeFactoryAuth";
//Page wrapper components
import LoginPage from "src/pages/LoginPage";
import RegisterPage from "src/pages/RegisterPage";
import DashboardPage from "src/pages/DashboardPage";
import SettingsPage from "src/pages/SettingsPage";
import NewProjectPage from "src/pages/NewProjectPage";
import ProjectPage from "src/pages/ProjectPage";

//Define frontend routes
export const routes = [
  routeFactory("/", <RegisterPage />),
  routeFactory("/login", <LoginPage />),

  //Protected routes
  routeFactoryAuth("/dashboard", <DashboardPage />),
  routeFactoryAuth("/settings", <SettingsPage />),
  routeFactoryAuth("/new", <NewProjectPage />),
  routeFactoryAuth("/projects/:id", <ProjectPage />),
];
