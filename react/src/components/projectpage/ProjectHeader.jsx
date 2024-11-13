/*-------------------Cleaned up 9/17/24-------------------*/

//React
import { useContext } from "react";
import { createPortal } from "react-dom";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";

//Animation

import { motion, AnimatePresence } from "framer-motion";

//Contexts
import {
  ProjectUpdaterContext,
  HeaderStatsContext,
} from "src/pages/ProjectPage";
import { UserContext } from "src/context/UserContext";

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

//Utils
import { DataFields } from "src/utils/validations";

// Project stats header containing editable project info. Uses slice of context provided by page wrapper parent
export default function ProjectHeader({ contextSlice }) {
  //Upate project summary context via key/val pair
  const updateContext = useContext(ProjectUpdaterContext);

  //For high contrast theme or not
  const { userData } = useContext(UserContext);

  //Consume context which has stats which are affected by project components
  const { headerStats } = useContext(HeaderStatsContext);

  return createPortal(
    <AnimatePresence mode="wait" onExitComplete={() => null}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 0, opacity: 1 }}
        className="fixed top-0 mt-[64px] sm:mt-[72px] lg:mt-[90px] sm:mx-3 sm:mx-5 z-9 w-full sm:w-1/2 lg:w-1/6"
        transition={{
          delay: 0,
          type: "spring",
          stiffness: 120,
          mass: 1,
          damping: 20,
        }}
      >
        <Card className="rounded-none sm:rounded-2xl top-split-mobile sm:h-[300px] xl:h-auto w-full">
          {/* Card header */}
          <CardHeader
            className={`${
              DataFields.PROJECT_THEME_TYPES.find(
                (theme) => theme.value === contextSlice.theme
              )[userData.high_contrast ? "contrast" : "uniHeader"]
            } flex rounded-none sm:rounded-t-2xl flex-row justify-between px-5 h-[64px] py-3.5`}
          >
            <motion.div
              initial={{ x: -8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.7,
                ease: [0.22, 0.13, 0.16, 1],
              }}
            >
              <ProjectEditableField
                initialContent={contextSlice.title}
                id={contextSlice.id}
                objKey="title"
                onSubmit={updateContext}
                title={true}
              />
            </motion.div>
            <CircleMeter
              val={Math.round(
                (headerStats.completed / headerStats.total) * 100
              )}
              max={100}
              percentage={true}
              size={42}
              color="turquoise"
              fill="white"
            />
          </CardHeader>
          <Divider />
          {/* Card content */}
          <CardBody className="py-0 sm:py-3 overflow-hidden">
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.7,
                ease: [0.22, 0.13, 0.16, 1],
              }}
            >
              <MeterButton
                val={contextSlice.billed}
                displayVal={String(contextSlice.budget - contextSlice.billed)}
                max={contextSlice.budget}
                color={
                  contextSlice.budget - contextSlice.billed > 0
                    ? "primary"
                    : "danger"
                }
                label="Budget Hours Remaining"
                dropdown
                objKey="billed"
                onSubmit={updateContext}
              />
            </motion.div>

            <div className="hidden sm:flex">
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.7,
                  ease: [0.22, 0.13, 0.16, 1],
                }}
              >
                <MeterButton
                  val={headerStats.openItems}
                  max={1}
                  color="danger"
                  label="Open Items"
                />
              </motion.div>
            </div>
            <div className="sm:hidden h-full w-full flex flex-row items-center justify-center text-sm text-default-400">
              <FontAwesomeIcon
                className="mr-2 text-sm"
                size="xs"
                icon={faDesktop}
              />

              <p>Use Pambas on desktop for full functionality</p>
            </div>
          </CardBody>
          <Divider />

          {/* Card footer */}
          <CardFooter className="bg-slate-200 sm:bg-inherit h-[20px] sm:h-auto rounded-none sm:rounded-b-2xl">
            <div className="text-xs text-default-500 flex w-full justify-between">
              <span>{contextSlice.projectType}</span>
              <span>{contextSlice.projectManager}</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>,
    // Attach portal to top level
    document.body
  );
}
