/*-------------------Cleaned up 9/17/24-------------------*/

//React
import { useContext } from "react";
import { createPortal } from "react-dom";

//Contexts
import {
  ProjectUpdaterContext,
  HeaderStatsContext,
} from "src/pages/ProjectPage";

//Children
import ProjectEditableField from "./ProjectEditableField";
import MeterButton from "./MeterButton";
import CircleMeter from "./CircleMeter";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";

// Project stats header containing editable project info. Uses slice of context provided by page wrapper parent
export default function ProjectHeader({ contextSlice }) {
  //Upate project summary context via key/val pair
  const updateContext = useContext(ProjectUpdaterContext);

  //Consume context which has stats which are affected by project components
  const { headerStats } = useContext(HeaderStatsContext);

  return createPortal(
    <Card className="fixed top-0 mt-[100px] mx-3 sm:mx-5 z-10 w-4/5 sm:w-1/3 lg:w-1/6">
      {/* Card header */}
      <CardHeader className="bg-header-img flex flex-row justify-between px-5 py-3.5">
        <ProjectEditableField
          initialContent={contextSlice.title}
          id={contextSlice.id}
          objKey="title"
          onSubmit={updateContext}
          title={true}
        />
        <CircleMeter
          val={Math.round((headerStats.completed / headerStats.total) * 100)}
          max={100}
          percentage={true}
          size={42}
          color="turquoise"
          fill="white"
        />
      </CardHeader>
      <Divider />
      {/* Card content */}
      <CardBody>
        <MeterButton
          val={contextSlice.billed}
          displayVal={contextSlice.budget - contextSlice.billed}
          max={contextSlice.budget}
          color="primary"
          label="Budget Hours Remaining"
          dropdown
          objKey="billed"
          onSubmit={updateContext}
        />

        <MeterButton
          val={headerStats.openItems}
          max={1}
          color="danger"
          label="Open Items"
        />
      </CardBody>
      <Divider />

      {/* Card footer */}
      <CardFooter className="card-footer">
        <div className="text-xs text-default-500 flex w-full justify-between">
          <span>{contextSlice.projectType}</span>
          <span>{contextSlice.projectManager}</span>
        </div>
      </CardFooter>
    </Card>,
    // Attach portal to top level
    document.body
  );
}
