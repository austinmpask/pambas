/*-------------------Cleaned up 11/10/24-------------------*/
//RESPONSIVE 11/10/24

//React
import { useContext } from "react";

//Children
import DashProjectCard from "src/components/DashProjectCard";
import { ScrollShadow } from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";

//Animation
import { motion } from "framer-motion";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//Fixed height container which shows a scrollable list of all open projects with information
export default function DashProjectScrollable() {
  //Consume summary info for all projects
  const { projectSummaryData } = useContext(ProjectSummaryContext);

  return (
    <div className="w-screen h-full sm:w-full">
      <ScrollShadow className="h-full py-3 scrollbar-hidden">
        {projectSummaryData && projectSummaryData.length ? (
          projectSummaryData.map((project, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.2 + 0.1 * i, //Stagger entrances
                type: "spring",
                stiffness: 750,
                mass: 0.3,
                damping: 30,
              }}
            >
              <DashProjectCard project={project} />
            </motion.div>
          ))
        ) : (
          <div className="text-slate-300 font-semibold text-lg flex flex-col gap-3 items-center justify-center h-full">
            <FontAwesomeIcon size="xl" icon={faFaceSmile} />
            <p>No projects yet!</p>
          </div>
        )}
      </ScrollShadow>
    </div>
  );
}
