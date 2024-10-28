/*-------------------Cleaned up 10/28/24-------------------*/

//React
import { useContext } from "react";

//Contexts
import { ProjectUpdaterContext } from "src/pages/ProjectPage";

//Children
import ProjectEditableField from "src/components/projectpage/ProjectEditableField";
import { Card, CardHeader, Divider } from "@nextui-org/react";
import LineItemWrapper from "./lineitem/LineItemWrapper";

//Individual project section within the project grid
export default function ProjectSection({ contextSlice, sectionData, index }) {
  //Updates project summary context slice with specific key/value
  const updateProjectSummaryContext = useContext(ProjectUpdaterContext);

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
    <Card className="m-6 mb-0 w-full sm:w-11/12 lg:w-3/5 overflow-visible">
      {/* Header for section card */}
      <CardHeader className="px-0 py-3 bg-header-img">
        {/* Column headers shown on only on first card (index === 0) */}
        {index ? (
          // Rest of cards headers
          <p className="pl-4 text-large text-white font-semibold">{`Section ${sectionData.sectionNumber}`}</p>
        ) : (
          // First card header
          <>
            <div className="grid grid-cols-proj w-full">
              <p className="pl-4  truncate text-large text-white font-semibold">{`Sec. ${sectionData.sectionNumber}`}</p>

              {/* Map checkbox headers to checkbox columns */}
              {contextSlice.checkBoxHeaders.map((header, i) => {
                return (
                  !index && (
                    <ProjectEditableField
                      initialContent={header}
                      objKey={i}
                      key={i}
                      onSubmit={updateHeaders}
                      mini={true}
                    />
                  )
                );
              })}
              {/* Label notes column */}
              <p className="flex flex-col items-center justify-center text-small text-white">
                Notes
              </p>
            </div>
          </>
        )}
      </CardHeader>
      <Divider />

      {/* Section card content (line items) */}
      {sectionData.lineItems.map((line, index) => (
        <LineItemWrapper key={index} line={line} index={index} />
      ))}
    </Card>
  );
}
