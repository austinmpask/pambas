//Children
import HashLoader from "react-spinners/HashLoader";

//Utils
import { DataFields } from "src/utils/validations";

//Default loader spinner for application
export default function FancyLoader({ size = 30 }) {
  return (
    <HashLoader
      color={DataFields.LOADER_COLOR}
      loading
      cssOverride
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}
