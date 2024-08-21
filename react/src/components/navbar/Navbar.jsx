//Children
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Image,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Avatar,
  User,
  Tooltip,
} from "@nextui-org/react";
import { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faExclamationTriangle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";
import { UserContext } from "src/context/UserContext";

// Parent persistent navbar component
export default function NavBar() {
  const { projectSummaryData } = useContext(ProjectSummaryContext);
  const { userData } = useContext(UserContext);
  return (
    <Navbar maxWidth="full" isBordered>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Image
            alt="Logo"
            height={30}
            radius="sm"
            src="/logorings.png"
            width={30}
          />
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/dashboard">
            <Button
              variant="light"
              radius="sm"
              disableRipple
              className="text-base font-semibold"
            >
              Dashboard
            </Button>
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Dropdown>
            <NavbarItem>
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
            </NavbarItem>
            <DropdownMenu
              aria-label="Projects"
              className="w-[300px]"
              itemClasses={{
                base: "gap-4",
              }}
            >
              {projectSummaryData.map((project, index) => {
                return (
                  <DropdownItem key={index} href={`/projects/${index}`}>
                    {project.title}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Tooltip
          delay={250}
          content={
            <div className="px-1 py-2">
              <div className="text-small font-bold">Settings Menu</div>
              <div className="text-tiny">
                Edit profile, customizations, application options
              </div>
            </div>
          }
        >
          <Button as={Link} href="/settings" variant="light" disableRipple>
            <User
              name={`${userData.firstName} ${userData.lastName}`}
              description={userData.username}
              avatarProps={{
                name:
                  String(userData.firstName[0]) + String(userData.lastName[0]),
              }}
            />
          </Button>
        </Tooltip>
      </NavbarContent>
    </Navbar>
  );
}
