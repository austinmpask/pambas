/*-------------------Cleaned up 11/10/24-------------------*/
//TODO: Make request for info to populate

//Animation
import { motion } from "framer-motion";

//Icons
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Children
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import DashOpenItem from "src/components/DashOpenItem";

//List of open items sorted by oldest first
export default function DashOpenItemList() {
  const items = [<DashOpenItem key={0} />];
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
        <CardBody>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.6,
              type: "spring",
              stiffness: 750,
              mass: 0.3,
              damping: 30,
            }}
          >
            {items}
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
