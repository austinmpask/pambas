import ErrorElement from "src/components/ErrorElement";

//Helper for easier adding routes for react router
export default function routeFactory(route, element) {
  return {
    path: route,
    element: element,
    errorElement: <ErrorElement />,
  };
}
