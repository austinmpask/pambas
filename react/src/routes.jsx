import routeFactory from "src/utils/routeFactory";
import LandingPage from "src/pages/LandingPage";
import LoginPage from "src/pages/LoginPage";

//Define frontend routes
export const routes = [
  routeFactory("/", <LandingPage />),
  routeFactory("/login", <LoginPage />),
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
