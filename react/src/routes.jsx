import routeFactory from "src/utils/routeFactory";

//Page wrapper components
import LandingPage from "src/pages/LandingPage";
import LoginPage from "src/pages/LoginPage";
import RegisterPage from "src/pages/RegisterPage";
import AuthWrapper from "src/components/AuthWrapper";
import DashboardPage from "src/pages/DashboardPage";

//Define frontend routes
export const routes = [
  routeFactory("/", <LandingPage />),
  routeFactory("/login", <LoginPage />),
  routeFactory("/register", <RegisterPage />),

  //Protected routes
  routeFactory(
    "/dashboard",
    <AuthWrapper>
      <DashboardPage />
    </AuthWrapper>
  ),
];
