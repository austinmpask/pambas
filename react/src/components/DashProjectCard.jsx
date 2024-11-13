/*-------------------Cleaned up 11/10/24-------------------*/
//RESPONSIVE 11/10/24
//React
import { useContext } from "react";

//Children
import { Card, CardBody, Link, Chip, Spacer } from "@nextui-org/react";
import CircleMeter from "src/components/projectpage/CircleMeter";

//Utils
import { Colors } from "src/utils/validations";
import projectInsight from "src/utils/projectInsight";

//Context
import { UserContext } from "src/context/UserContext";

//Icons
import { faClock, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Summary card for project, shows insights for progression
export default function DashProjectCard({ project }) {
  //For calculation mode
  const { userData } = useContext(UserContext);
  //Calculate color coding and progression metrics for project
  const status = projectInsight(project, userData.complete_progress);

  return (
    <Link className="w-full" href={`/projects/${project.id}`}>
      <div className="w-full select-none h-[90px] px-1 sm:px-3 md:px-5 py-2 flex items-center justify-center">
        <Card
          isPressable
          isHoverable
          disableRipple
          className="rounded-2xl mx-3 sm:mx-0 w-full h-full"
        >
          <CardBody className="grid grid-cols-7 sm:grid-cols-11 lg:grid-cols-9 gap-1 sm:gap-3">
            {/* PROJECT COMPLETION */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <CircleMeter
                val={Math.round(
                  ((userData.complete_progress
                    ? project.completedRows
                    : project.completed) /
                    project.total) *
                    100
                )}
                displayVal={Math.round(
                  ((userData.complete_progress
                    ? project.completedRows
                    : project.completed) /
                    project.total) *
                    100
                )}
                max={100}
                percentage
                color={"success"}
              />
            </div>
            {/* TITLE */}
            <div
              className={`col-span-2 sm:col-span-4 lg:col-span-3 flex font-semibold ml-2 sm:ml-0 items-center ${Colors.text.med}`}
            >
              {project.title}
            </div>
            {/* PROJECT INSIGHT */}
            <div
              className={`col-span-1 lg:col-span-2 flex md:text-xs lg:text-sm font-semibold items-center sm:justify-start ${status.textColor}`}
            >
              <FontAwesomeIcon
                className="ml-6 sm:ml-3 lg:ml-0 sm:mr-2 sm:text-sm"
                icon={status.icon}
              />
              {
                <div className="invisible lg:visible md:text-xs lg:text-sm">
                  {status.message}
                </div>
              }
            </div>
            {/* BUDGET */}
            <div
              className={`col-span-2 text-lg flex items-center ml-2 sm:ml-0 justify-start font-semibold ${Colors.text.med}`}
            >
              <Chip
                color={status.color}
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
              className={`col-span-1 sm:col-span-2 lg:col-span-1 text-lg flex items-center justify-end lg:justify-start font-semibold ${Colors.text.med}`}
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
