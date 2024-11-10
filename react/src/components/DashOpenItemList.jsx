/*-------------------Cleaned up 11/10/24-------------------*/
//TODO: Make request for info to populate

//Animation
import { motion } from "framer-motion";

//Utils
import { Colors } from "src/utils/validations";

//Icons
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Children
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

//List of open items sorted by oldest first
export default function DashOpenItemList() {
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
        <CardBody>TODO</CardBody>
      </Card>
    </motion.div>
  );
}
