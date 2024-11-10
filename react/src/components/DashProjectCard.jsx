import { Card, CardBody, Link, Chip, Divider, Spacer } from "@nextui-org/react";
import CircleMeter from "src/components/projectpage/CircleMeter";
import { Colors, Insights } from "src/utils/validations";

import {
  faClock,
  faCheck,
  faArrowTrendUp,
  faArrowTrendDown,
  faTriangleExclamation,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashProjectCard({ project }) {
  let status = projectInsight();

  //Array to map the project insight status to chip component colors
  const straightColors = ["success", "primary", "warning", "danger"];

  //Compare the progress reported to how many hours have been billed to assess if the project is dragging
  function projectInsight() {
    //Under 1 = GOOD, ahead of schedule, ~1 = ON TRACK, >> 1 = BLOWING BUDGET
    const ratio =
      project.billed / project.budget / (project.completed / project.total);
    console.log(ratio);

    if (ratio < Insights.GOOD_CEILING) {
      return {
        code: 0,
        icon: faArrowTrendDown,
        message: "Under Budget",
        color: "text-success-300",
      };
    } else if (ratio < Insights.ON_TRACK_CEILING) {
      return {
        code: 1,
        icon: faCheck,
        message: "On Track",
        color: "text-primary-300",
      };
    } else if (ratio < Insights.WARN_CEILING) {
      return {
        code: 2,
        icon: faArrowTrendUp,
        message: "Running Over",
        color: "text-warning-400",
      };
    } else {
      return {
        code: 3,
        icon: faTriangleExclamation,
        message: "Over Billing",
        color: "text-danger-300",
      };
    }
  }

  return (
    <Link className="w-full" href={`/projects/${project.id}`}>
      <div className="w-full h-[90px] px-5 py-2 flex items-center justify-center">
        <Card
          isPressable
          isHoverable
          disableRipple
          className="rounded-2xl w-full h-full"
        >
          <CardBody className="grid grid-cols-9 gap-3">
            {/* PROJECT COMPLETION */}
            <div className="col-span-1">
              <CircleMeter
                val={Math.round((project.completed / project.total) * 100)}
                displayVal={Math.round(
                  (project.completed / project.total) * 100
                )}
                max={100}
                percentage
                color={"success"}
              />
            </div>
            {/* TITLE */}
            <div
              className={`col-span-3 flex font-semibold items-center ${Colors.text.med}`}
            >
              {project.title}
            </div>
            {/* PROJECT INSIGHT */}
            <div
              className={`col-span-2 flex text-sm font-semibold items-center justify-start ${status.color}`}
            >
              <FontAwesomeIcon className="mr-2" icon={status.icon} />
              {status.message}
            </div>
            {/* BUDGET */}
            <div
              className={`col-span-2 text-lg flex items-center justify-start font-semibold ${Colors.text.med}`}
            >
              <Chip
                color={straightColors[status.code]}
                variant="flat"
                startContent={
                  <>
                    <Spacer x="1" />
                    <FontAwesomeIcon icon={faClock} />
                  </>
                }
              >
                <div className="flex flex-row">
                  {project.billed}/{project.budget}
                </div>
              </Chip>
            </div>
            {/* OPEN ITEMS */}
            <div
              className={`col-span-1 text-lg flex items-center justify-start font-semibold ${Colors.text.med}`}
            >
              {project.openItems ? (
                <Chip
                  color="secondary"
                  variant="flat"
                  startContent={
                    <>
                      <Spacer x="1" />
                      <FontAwesomeIcon icon={faPaperclip} />
                    </>
                  }
                >
                  <div className="flex flex-row">{project.openItems}</div>
                </Chip>
              ) : null}
            </div>
          </CardBody>
        </Card>
      </div>
    </Link>
  );
}
