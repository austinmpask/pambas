/*-------------------Cleaned up 10/28/24-------------------*/

//React
import { useContext } from "react";

//Contexts
import { ProjectUpdaterContext } from "src/pages/ProjectPage";

//Children
import ProjectEditableField from "src/components/projectpage/ProjectEditableField";
import { Card, CardHeader, Divider } from "@nextui-org/react";
import LineItemWrapper from "./lineitem/LineItemWrapper";

//Animation
import { motion } from "framer-motion";

//Contexts
import { UserContext } from "src/context/UserContext";

//Utils
import toTitle from "src/utils/toTitle";
import { DataFields } from "src/utils/validations";

//Individual project section within the project grid
export default function ProjectSection({ contextSlice, sectionData, index }) {
  //Updates project summary context slice with specific key/value
  const updateProjectSummaryContext = useContext(ProjectUpdaterContext);

  //For high contrast theme or not
  const { userData } = useContext(UserContext);

  //Apply a change to whatever index of the header array the user edited, then use context updater
  function updateHeaders(i, value) {
    //Copy header array & insert new value at correct index
    const newHeaders = [...contextSlice.checkBoxHeaders];
    newHeaders[i] = value;

    //Update the object k/v in the project summary context list
    updateProjectSummaryContext("checkBoxHeaders", newHeaders);
  }

  return (
    // Section card
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 0, opacity: 1 }}
      className="w-full flex flex-col items-center"
      transition={{
        delay: 0.2 + 0.2 * index,
        type: "spring",
        stiffness: 120,
        mass: 1,
        damping: 20,
      }}
    >
      <Card
        isHoverable
        className="sm:m-6 mb-0 w-full sm:w-11/12 rounded-none sm:rounded-3xl lg:w-3/5 overflow-visible"
      >
        {/* Header for section card */}
        <CardHeader
          className={`px-0 py-3 z-1 rounded-none  bg-slate-700 h-[52px] sm:rounded-t-3xl ${
            DataFields.PROJECT_THEME_TYPES.find(
              (theme) => theme.value === contextSlice.theme
            )[userData.high_contrast ? "contrast" : "header"]
          }`}
        >
          {/* Column headers shown on only on first card (index === 0) */}
          {index ? (
            // Rest of cards headers
            <p className="pl-2 sm:pl-4 sm:text-lg text-white font-semibold">{`Section ${sectionData.sectionNumber}`}</p>
          ) : (
            // First card header
            <>
              <div className="grid mobile-grid-template sm:grid-cols-proj w-full">
                <p className="pl-2 sm:pl-4 sm:text-base md:text-lg text-lg text-white font-semibold">{`S ${sectionData.sectionNumber}`}</p>

                {/* Map checkbox headers to checkbox columns */}
                {contextSlice.checkBoxHeaders.map((header, i) => {
                  return (
                    !index && (
                      <ProjectEditableField
                        initialContent={toTitle(header)}
                        objKey={i}
                        key={i}
                        onSubmit={updateHeaders}
                        mini={true}
                      />
                    )
                  );
                })}
                {/* Label notes column */}
                <p className="hidden sm:flex sm:visible flex flex-col items-center justify-center text-xs sm:text-small text-white">
                  Notes
                </p>
              </div>
            </>
          )}
        </CardHeader>
        <Divider />

        {/* Section card content (line items) */}
        {sectionData.lineItems.map((line, index) => (
          <LineItemWrapper
            key={index}
            line={line}
            index={index}
            end={index === sectionData.lineItems.length - 1}
          />
        ))}
      </Card>
    </motion.div>
  );
}
