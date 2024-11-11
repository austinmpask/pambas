/*-------------------Cleaned up 11/10/24-------------------*/
//RESPONSIVE 11/10/24

//React
import { useContext } from "react";

//Animation
import { motion } from "framer-motion";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//Utils
import getDashStats from "src/utils/getDashStats";

//Icons
import {
  faClock,
  faListCheck,
  faPaperclip,
  faGaugeHigh,
  faCirclePlus,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Children
import DashStatCard from "src/components/DashStatCard";
import DashProjectScrollable from "src/components/DashProjectScrollable";
import DashOpenItemList from "src/components/DashOpenItemList";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Link,
} from "@nextui-org/react";

//Main dashboard card showing high level info, and project statuses
export default function DashCard() {
  //Consume summary info for all projects
  const { projectSummaryData } = useContext(ProjectSummaryContext);

  //Make calculations on summary info for the dashboard card
  const { hours, items } = getDashStats(projectSummaryData);

  return (
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
      <div className="select-none sm:m-9 flex flex-col h-mobile sm:h-auto items-center">
        <Card className="rounded-none sm:rounded-3xl">
          <CardHeader
            className={`invisible sm:visible bg-header-img fixed sm:static rounded-none sm:rounded-t-3xl text-xl px-8 py-4 flex flex-row justify-center sm:justify-start items-center text-white`}
          >
            <FontAwesomeIcon size="lg" className="mr-3" icon={faGaugeHigh} />
            <p>Dashboard</p>
          </CardHeader>
          <Divider className="invisible sm:visible" />
          <CardBody className="w-screen p-0 sm:p-3 sm:w-auto sm:mt-0 md:p-6 lg:p-8 md:grid md:grid-cols-5 md:gap-4 lg:gap-8">
            {/* COLUMN 1 */}
            <div className="sm:col-span-3 h-mobile sm:h-full flex flex-col items-center justify-between xl:h-70vh md:h-60vh">
              <div className="mt-4 sm:mt-0 h-[120px] md:h-[140px] lg:h-[180px] w-screen sm:w-full flex flex-row items-center justify-between px-3 sm:px-0">
                <DashStatCard
                  stat={projectSummaryData.length}
                  icon={faListCheck}
                  label="Projects"
                  delay={0.05}
                />

                <DashStatCard
                  stat={hours}
                  icon={faClock}
                  color={hours < 0 ? "danger" : "success"}
                  label={`Hours ${hours < 0 ? "over" : "under"}`}
                  delay={0.1}
                />

                <DashStatCard
                  stat={items}
                  icon={faPaperclip}
                  color={items === 0 ? "success" : "danger"}
                  label="Open items"
                  delay={0.15}
                />
              </div>
              {/* Scrollable list of project summary information */}
              <div className="flex-grow overflow-y-hidden">
                <DashProjectScrollable />
              </div>
              <div className="flex flex-row items-center w-full mb-6 px-4 sm:px-0 sm:mb-0">
                <Link className="w-full" href="/new">
                  <Button
                    size="lg"
                    variant="flat"
                    className="font-semibold w-full mr-4"
                    startContent={
                      <FontAwesomeIcon size="lg" icon={faCirclePlus} />
                    }
                    color="secondary"
                  >
                    New Project
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button
                    isIconOnly
                    size="lg"
                    variant="flat"
                    startContent={
                      <FontAwesomeIcon size="lg" icon={faSliders} />
                    }
                    // color="secondary"
                  />
                </Link>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="h-0 sm:h-[450px] xl:h-70vh md:h-60vh invisible sm:visible sm:col-span-2">
              <DashOpenItemList />
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
}
