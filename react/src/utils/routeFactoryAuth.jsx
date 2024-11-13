import AuthWrapper from "src/components/AuthWrapper";
import ErrorElement from "src/components/ErrorElement";

//Helper for easier adding protected routes for react router
export default function routeFactoryAuth(route, element) {
  return {
    path: route,
    element: <AuthWrapper>{element}</AuthWrapper>,
    errorElement: <ErrorElement />,
  };
}
