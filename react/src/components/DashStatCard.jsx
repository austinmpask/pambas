/*-------------------Cleaned up 11/10/24-------------------*/
//RESPONSIVE 11/10/24

//Children
import { Card, CardBody, Skeleton } from "@nextui-org/react";

//Utils
import { Colors, UIVars } from "src/utils/validations";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Animation
import { motion } from "framer-motion";

//Simple card showing a number, icon and label. Can be color coded
export default function DashStatCard({ stat, icon, label, color, delay = 0 }) {
  return (
    <motion.div
      initial={{
        scale: UIVars.DASH_STAT_CARD_INITIAL_SCALE,
        opacity: UIVars.DASH_STAT_CARD_INITIAL_OPACITY,
      }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 750,
        mass: 0.7,
        damping: 30,
      }}
    >
      <Card
        isPressable
        disableRipple
        className={`select-none drop-shadow-xl rounded-3xl h-[120px] w-[120px] md:h-[140px] md:w-[140px] lg:h-[180px] lg:w-[180px] ${
          color && "bg-" + color
        }`}
      >
        <CardBody
          className={`rounded-3xl relative p-3 sm:p-4 lg:p-5 ${
            color ? "text-" + color + "Shadow" : Colors.text.dark
          }`}
        >
          <div className="flex h-full w-full flex-col align-start justify-between">
            <Skeleton
              disableAnimation
              isLoaded={stat !== undefined}
              className="rounded-lg"
            >
              <p className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {stat < 0 ? stat * -1 : stat}
              </p>
            </Skeleton>
            <Skeleton
              disableAnimation
              isLoaded={stat !== undefined}
              className="rounded-lg"
            >
              <p className="text-base sm:text-lg font-semibold">{label}</p>
            </Skeleton>
          </div>
          <FontAwesomeIcon
            className={`${
              color ? "text-" + color + "Shadow" : Colors.text.dark
            } absolute top-0 right-0 p-4`}
            size="xl"
            icon={icon}
          />
        </CardBody>
      </Card>
    </motion.div>
  );
}
