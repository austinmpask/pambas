//React
import { useContext, useEffect } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Link,
  ScrollShadow,
} from "@nextui-org/react";

//Animation
import { motion, AnimatePresence } from "framer-motion";

//Contexts
import { UserContext } from "src/context/UserContext";
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

import { Colors } from "src/utils/validations";

import {
  faClock,
  faListCheck,
  faPaperclip,
  faGaugeHigh,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//Children
import PageWrapper from "src/components/PageWrapper";
import DashStatCard from "src/components/DashStatCard";
import DashProjectCard from "src/components/DashProjectCard";
import { Spacer } from "@nextui-org/react";

export default function DashboardPage() {
  const { userData } = useContext(UserContext);
  const { projectSummaryData } = useContext(ProjectSummaryContext);

  //Scale for stat cards animation
  const initialScale = 0.85;

  //Calculate the total hours that are under budget
  const hours = projectSummaryData.reduce(
    (a, project) => a + project.budget - project.billed,
    0
  );

  //Sum up all the open items for the projects
  const items = projectSummaryData.reduce(
    (a, project) => a + project.openItems,
    0
  );
  useEffect(() => {
    console.log(projectSummaryData);
  }, [projectSummaryData]);

  return (
    <>
      <div className="fixed -z-50 w-full h-full bg-projBg bg-proj-img bg-proj-size" />
      <PageWrapper title={userData.firstName + "'s Dashboard"}>
        <motion.div
          initial={{ y: 30, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 1000,
            mass: 0.1,
            damping: 100,
          }}
        >
          <div className="m-9 flex flex-col items-center">
            <Card className="rounded-3xl w-7/8 h-[700px]">
              <CardHeader
                className={`bg-header-img text-xl px-8 py-4 flex flex-row justify-between items-center text-white`}
              >
                <p>Dashboard</p>
                <FontAwesomeIcon size="lg" icon={faGaugeHigh} />
              </CardHeader>
              <Divider />
              <CardBody className="p-8 grid grid-cols-5 gap-8">
                {/* COLUMN 1 */}
                <div className="col-span-3 flex flex-col items-center justify-between">
                  <div className="h-[180px] w-full flex flex-row items-center justify-between">
                    <motion.div
                      initial={{ scale: initialScale, opacity: 0.2 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.05,
                        type: "spring",
                        stiffness: 750,
                        mass: 0.7,
                        damping: 30,
                      }}
                    >
                      <DashStatCard
                        stat={projectSummaryData.length}
                        icon={faListCheck}
                        label="Projects"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ scale: initialScale, opacity: 0.2 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 750,
                        mass: 0.7,
                        damping: 30,
                      }}
                    >
                      <DashStatCard
                        stat={hours}
                        icon={faClock}
                        color={hours < 0 ? "danger" : "success"}
                        label={`Hours ${hours < 0 ? "over" : "under"}`}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ scale: initialScale, opacity: 0.2 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.15,
                        type: "spring",
                        stiffness: 750,
                        mass: 0.7,
                        damping: 30,
                      }}
                    >
                      <DashStatCard
                        stat={items}
                        icon={faPaperclip}
                        color={items === 0 ? "success" : "danger"}
                        label="Open items"
                      />
                    </motion.div>
                  </div>

                  <div className="w-full h-[300px] border-t border-b">
                    <ScrollShadow className="w-full h-[300px] overflow-auto py-3 scrollbar-hidden">
                      {projectSummaryData &&
                        projectSummaryData.map((project, i) => (
                          <motion.div
                            key={i}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 0, opacity: 1 }}
                            transition={{
                              delay: 0.2 + 0.1 * i,
                              type: "spring",
                              stiffness: 750,
                              mass: 0.3,
                              damping: 30,
                            }}
                          >
                            <DashProjectCard project={project} />
                          </motion.div>
                        ))}
                    </ScrollShadow>
                  </div>
                  <Link className="w-full" href="/new">
                    <Button
                      size="lg"
                      variant="flat"
                      className="font-semibold w-full"
                      startContent={
                        <FontAwesomeIcon size="lg" icon={faCirclePlus} />
                      }
                      color="secondary"
                    >
                      New Project
                    </Button>
                  </Link>
                </div>

                {/* COLUMN 2 */}
                <div className="col-span-2">
                  <motion.div
                    className="w-full h-full"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 1000,
                      mass: 0.2,
                      damping: 100,
                    }}
                  >
                    <Card className="w-full h-full">
                      <CardHeader
                        className={`bg-slate-200 flex flex-row justify-between items-center text-lg px-5 py-4 font-semibold ${Colors.text.med}`}
                      >
                        <p>Oldest Open Items</p>

                        <FontAwesomeIcon
                          className={Colors.text.med}
                          size="lg"
                          icon={faPaperclip}
                        />
                      </CardHeader>
                      <Divider />
                      <CardBody></CardBody>
                    </Card>
                  </motion.div>
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </PageWrapper>
    </>
  );
}
