/*-------------------Cleaned up 10/28/24-------------------*/

//Children
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Image,
} from "@nextui-org/react";
import ProjectDropdown from "./ProjectDropdown";
import OptionsButton from "./OptionsButton";
import DevEnvLabel from "./DevEnvLabel";

//Animation
import { motion } from "framer-motion";

// Parent persistent navbar component
export default function NavBar() {
  return (
    <Navbar maxWidth="full" isBordered>
      {/* Left hand menu */}
      <NavbarContent className="flex gap-4" justify="start">
        {/* Logo */}
        <Link href="/dashboard">
          <motion.div
            className="w-[35px] h-[35px]"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{
              delay: 0.1,
              duration: 0.7,
              ease: [0.22, 0.13, 0.16, 1],
            }}
          >
            <Image alt="Logo" height={35} radius="sm" src="/rings.png" />
          </motion.div>
        </Link>

        {/* Project dropdown */}
        <motion.div
          initial={{ x: -8, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.7,
            ease: [0.22, 0.13, 0.16, 1],
          }}
        >
          <NavbarItem className="">
            <ProjectDropdown />
          </NavbarItem>
        </motion.div>
      </NavbarContent>

      {/* Right hand menu */}
      <NavbarContent justify="end">
        {import.meta.env.DEV && <DevEnvLabel />}
        <OptionsButton />
      </NavbarContent>
    </Navbar>
  );
}
