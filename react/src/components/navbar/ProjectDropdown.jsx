/*-------------------Cleaned up 10/28/24-------------------*/

//React
import { useContext } from "react";

//Children
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
} from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCirclePlus } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//Navbar dropdown for list of projects the user has
export default function ProjectDropdown() {
  // Consume high level information about all user's projects
  const { projectSummaryData } = useContext(ProjectSummaryContext);
  return (
    <Dropdown>
      {/* Trigger */}
      <DropdownTrigger>
        <Button
          radius="sm"
          variant="light"
          disableRipple
          className="text-base font-semibold"
        >
          Projects
        </Button>
      </DropdownTrigger>
      {/* Menu itsself */}
      <DropdownMenu
        aria-label="Projects"
        className="w-[230px]"
        itemClasses={{
          base: "gap-4",
        }}
      >
        <DropdownSection title="Projects" showDivider>
          {projectSummaryData.map((project, index) => {
            return (
              <DropdownItem
                startContent={
                  // TODO: Add the project color to the line item once color themes added
                  <FontAwesomeIcon className="text-danger" icon={faSquare} />
                }
                key={index}
                href={`/projects/${index}`}
              >
                {project.title}
              </DropdownItem>
            );
          })}
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            description="Not enough work?"
            startContent={
              // TODO: Add the project color to the line item once color themes added
              <FontAwesomeIcon size="lg" icon={faCirclePlus} />
            }
            href={`/new`}
          >
            <p className="font-semibold">New Project</p>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
