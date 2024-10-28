/*-------------------Cleaned up 10/28/24-------------------*/

//Children
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Image,
} from "@nextui-org/react";
import ProjectDropdown from "./ProjectDropdown";
import OptionsButton from "./OptionsButton";
import DevEnvLabel from "./DevEnvLabel";

// Parent persistent navbar component
export default function NavBar() {
  return (
    <Navbar maxWidth="full" isBordered>
      {/* Left hand menu */}
      <NavbarContent className="flex gap-4" justify="start">
        {/* Logo */}
        <Image
          className="hidden sm:flex"
          alt="Logo"
          height={35}
          radius="sm"
          src="/rings.png"
        />

        {/* Dashboard link */}
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

        {/* Project dropdown */}
        <NavbarItem className="hidden sm:flex">
          <ProjectDropdown />
        </NavbarItem>
      </NavbarContent>

      {/* Right hand menu */}
      <NavbarContent justify="end">
        {import.meta.env.DEV && <DevEnvLabel />}
        <OptionsButton />
      </NavbarContent>
    </Navbar>
  );
}
