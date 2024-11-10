/*-------------------Cleaned up 11/10/24-------------------*/

//Utils
import { Insights } from "src/utils/validations";

//Icons
import {
  faCheck,
  faArrowTrendUp,
  faArrowTrendDown,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

//Compare the progress reported to how many hours have been billed to assess if the project is dragging
export default function projectInsight(project) {
  //Under 1 = GOOD, ahead of schedule, ~1 = ON TRACK, >> 1 = BLOWING BUDGET
  const ratio =
    project.billed / project.budget / (project.completed / project.total);

  // Return correct info for component based on rating
  if (ratio < Insights.GOOD_CEILING) {
    return {
      code: 0,
      icon: faArrowTrendDown,
      message: "Under Budget",
      textColor: "text-success-300",
      color: "success",
    };
  } else if (ratio < Insights.ON_TRACK_CEILING) {
    return {
      code: 1,
      icon: faCheck,
      message: "On Track",
      textColor: "text-primary-300",
      color: "primary",
    };
  } else if (ratio < Insights.WARN_CEILING) {
    return {
      code: 2,
      icon: faArrowTrendUp,
      message: "Running Over",
      textColor: "text-warning-400",
      color: "warning",
    };
  } else {
    return {
      code: 3,
      icon: faTriangleExclamation,
      message: "Over Billing",
      textColor: "text-danger-300",
      color: "danger",
    };
  }
}
