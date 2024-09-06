/*-------------------Cleaned up 9/6/24, needs to be broken up-------------------*/
//React
import { useContext } from "react";

//Children
import {
  Navbar,
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
  Chip,
} from "@nextui-org/react";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";
import { UserContext } from "src/context/UserContext";

// Parent persistent navbar component
export default function NavBar() {
  const { projectSummaryData } = useContext(ProjectSummaryContext);
  const { userData } = useContext(UserContext);
  return (
    <Navbar maxWidth="full" isBordered>
      <NavbarContent className="flex gap-4" justify="start">
        <Dropdown>
          <DropdownTrigger className="flex flex-row justify-start sm:hidden">
            <Button
              radius="sm"
              variant="light"
              disableRipple
              className="text-base font-semibold"
            >
              <Image alt="Logo" height={35} radius="sm" src="/rings.png" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Projects"
            className="w-full"
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
        <Image
          className="hidden sm:flex"
          alt="Logo"
          height={35}
          radius="sm"
          src="/rings.png"
        />

        <NavbarItem className="hidden sm:flex">
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
        <NavbarItem className="hidden sm:flex">
          <Dropdown>
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
        {import.meta.env.DEV && (
          <NavbarItem>
            <Tooltip
              delay={250}
              content={
                <div className="px-1 py-2">
                  <div className="text-small font-bold">
                    Development Version
                  </div>
                  <div className="text-tiny">
                    You are using the Development Version of Pambas
                  </div>
                  <div className="text-tiny">
                    Information stored here is separate from the Production
                    Application
                  </div>
                </div>
              }
            >
              <Chip variant="flat" size="sm" color="danger">
                <p className="font-semibold">DEV</p>
              </Chip>
            </Tooltip>
          </NavbarItem>
        )}
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
              className="hidden sm:flex"
              name={`${userData.firstName} ${userData.lastName}`}
              description={userData.username}
              avatarProps={{
                name:
                  String(userData.firstName[0]) + String(userData.lastName[0]),
              }}
            />

            <Avatar
              name={
                String(userData.firstName[0]) + String(userData.lastName[0])
              }
              className="flex sm:hidden"
            />
          </Button>
        </Tooltip>
      </NavbarContent>
    </Navbar>
  );
}
