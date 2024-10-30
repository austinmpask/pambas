//React
import { useState } from "react";

//Children
import PageWrapper from "src/components/PageWrapper";
import ProjectDataForm from "src/components/forms/project/ProjectDataForm";
import SectionsForm from "src/components/forms/project/SectionsForm";
import NavBar from "src/components/navbar/Navbar";
import { Spacer } from "@nextui-org/react";
import { toastError } from "src/styles/toasts";

//Utils
import projectTrim from "src/utils/projectTrim";

//Page containing multi component dynamic form allowing the user to create a new project template
export default function NewProjectPage() {
  //Init sections array
  const [sections, setSections] = useState([[0, 0]]);

  //Make request to submit the new project
  function submit(data) {
    //Remove any sections without complete information
    const trimmed = projectTrim(sections);

    //Abort if after trimming the sections, there arent any remaining
    if (!trimmed.length) {
      toastError("You must add a valid section assignment");
      return;
    }

    //TODO make request here
    console.log(data);
    console.log(trimmed);
  }
  return (
    <>
      <NavBar />
      <PageWrapper title="New Project">
        <div className="flex flex-row justify-center">
          {/* Lefthand form */}
          <ProjectDataForm submit={submit} />
          <Spacer x="12" />

          {/* Righthand form */}
          <SectionsForm sections={sections} setSections={setSections} />
        </div>
      </PageWrapper>
    </>
  );
}
