/*-------------------Cleaned up 11/10/24-------------------*/
//React
import { useContext } from "react";
//Animation
import { motion } from "framer-motion";

//Icons
import { faPaperclip, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Children
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
} from "@nextui-org/react";
import DashOpenItem from "src/components/DashOpenItem";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//List of open items sorted by oldest first
export default function DashOpenItemList() {
  //Consume summary info for all projects
  const { projectSummaryData } = useContext(ProjectSummaryContext);

  // Make a list of all items. Not stateful because this page is static info
  const allItems = projectSummaryData.reduce((acc, project) => {
    if (project.openItemDetail.length) {
      const newItems = project.openItemDetail.map((item) => ({
        projID: project.id,
        itemName: item.itemName,
        controlOwner: item.controlOwner,
      }));
      return [...acc, ...newItems];
    }
    return acc;
  }, []);

  // const items = [<DashOpenItem key={0} />];
  return (
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
          className={`bg-slate-200 flex flex-row justify-between items-center text-lg px-5 py-4 font-semibold text-slate-700`}
        >
          <p>Open Items</p>

          <FontAwesomeIcon
            className="text-slate-400"
            size="lg"
            icon={faPaperclip}
          />
        </CardHeader>
        <Divider />
        <CardBody className="scrollbar-hidden p-0">
          <ScrollShadow className="h-full p-3 scrollbar-hidden">
            {allItems && allItems.length ? (
              allItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.2 + i / 10,
                    type: "spring",
                    stiffness: 750,
                    mass: 0.3,
                    damping: 30,
                  }}
                >
                  <DashOpenItem data={item} />
                </motion.div>
              ))
            ) : (
              <div className="text-slate-300 font-semibold text-lg flex flex-col gap-3 items-center justify-center h-full">
                <FontAwesomeIcon size="xl" icon={faFolderOpen} />
                <p>Nothing here!</p>
              </div>
            )}
          </ScrollShadow>
        </CardBody>
      </Card>
    </motion.div>
  );
}
