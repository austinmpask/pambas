import routeFactory from "src/utils/routeFactory";

//Page wrapper components
import LandingPage from "src/pages/LandingPage";
import LoginPage from "src/pages/LoginPage";
import RegisterPage from "src/pages/RegisterPage";

//Define frontend routes
export const routes = [
  routeFactory("/", <LandingPage />),
  routeFactory("/login", <LoginPage />),
  routeFactory("/register", <RegisterPage />),
  //   {
  //     path: "/login",
  //     element: <LoginPage />,
  //   },
  //   {
  //     path: "/register",
  //     element: <Register />,
  //   },
  //   {
  //     path: "/dashboard",
  //     element: (
  //       <AuthWrapper>
  //         <NavBar />
  //         <Dashboard />
  //       </AuthWrapper>
  //     ),
  //   },
  //   {
  //     path: "/settings",
  //     element: (
  //       <AuthWrapper>
  //         <NavBar />
  //         <Settings />
  //       </AuthWrapper>
  //     ),
  //   },
  //   {
  //     path: "/new",
  //     element: (
  //       <AuthWrapper>
  //         <NavBar />
  //         <NewEngagement />
  //       </AuthWrapper>
  //     ),
  //   },
  //   {
  //     path: "/error",
  //     element: <Error />,
  //   },
];
