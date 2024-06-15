//Helper for easier adding protected routes for react router
import AuthWrapper from "src/components/AuthWrapper";

export default function routeFactoryAuth(route, element) {
  return {
    path: route,
    element: <AuthWrapper>{element}</AuthWrapper>,
  };
}
