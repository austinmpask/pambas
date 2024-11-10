/*-------------------Cleaned up 11/10/24-------------------*/

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
      <div className="select-none m-9 flex flex-col items-center">
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
              <DashProjectScrollable />
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
              <DashOpenItemList />
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
}
