/*-------------------Cleaned up 11/10/24-------------------*/

//Children
import { Card, CardBody, Link, Chip, Spacer } from "@nextui-org/react";
import CircleMeter from "src/components/projectpage/CircleMeter";

//Utils
import { Colors } from "src/utils/validations";
import projectInsight from "src/utils/projectInsight";

//Icons
import { faClock, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Summary card for project, shows insights for progression
export default function DashProjectCard({ project }) {
  //Calculate color coding and progression metrics for project
  const status = projectInsight(project);

  return (
    <Link className="w-full" href={`/projects/${project.id}`}>
      <div className="w-full select-none h-[90px] px-5 py-2 flex items-center justify-center">
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
              className={`col-span-2 flex text-sm font-semibold items-center justify-start ${status.textColor}`}
            >
              <FontAwesomeIcon className="mr-2" icon={status.icon} />
              {status.message}
            </div>
            {/* BUDGET */}
            <div
              className={`col-span-2 text-lg flex items-center justify-start font-semibold ${Colors.text.med}`}
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
