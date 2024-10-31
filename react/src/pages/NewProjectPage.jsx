/*-------------------Cleaned up 10/30/24-------------------*/

//React
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

//Children
import PageWrapper from "src/components/PageWrapper";
import ProjectDataForm from "src/components/forms/project/ProjectDataForm";
import SectionsForm from "src/components/forms/project/SectionsForm";
import NavBar from "src/components/navbar/Navbar";
import { Spacer } from "@nextui-org/react";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//Toasts
import { toastError } from "src/styles/toasts";

//Utils
import projectTrim from "src/utils/projectTrim";
import toastRequest from "src/utils/toastRequest";
import formatNewProject from "src/utils/formatNewProject";

//Page containing multi component dynamic form allowing the user to create a new project template
export default function NewProjectPage() {
  const navigate = useNavigate();

  //Consume project summary context setter
  const { setProjectSummaryData } = useContext(ProjectSummaryContext);

  //Init sections array for dynamic form
  const [sections, setSections] = useState([[0, 0]]);

  //Loading state for visuals/form disabled
  const [loading, setLoading] = useState(false);

  //Make request to submit the new project. Some data cleaning outside of validation included since I have refactored this page several times
  async function submit(data) {
    //Remove any sections without complete information
    const trimmed = projectTrim(sections);

    //Abort if after trimming the sections, there arent any remaining
    if (!trimmed.length) {
      toastError("You must add a valid section assignment");
      return;
    }

    //Format the project template to expected format for note service because of form refactors
    const payload = formatNewProject(data, trimmed);

    //Make request for project creation
    await toastRequest({
      method: "POST",
      route: "/project",
      data: payload,
      setLoading,
      successCB: (message) => {
        //Update summary context
        console.log(message);
        setProjectSummaryData((prev) => {
          const newContext = [...prev];
          newContext.push(message);
          return newContext;
        });

        //Redirect
        setTimeout(() => {
          navigate(`/projects/${message.id}`);
        }, 2000);
      },
    });
  }
  return (
    <>
      <div className="fixed -z-50 w-full h-full bg-projBg bg-proj-img bg-proj-size" />
      <NavBar />
      <PageWrapper title="New Project">
        <div className="flex flex-col lg:flex-row lg:items-start items-center lg:justify-center">
          {/* Lefthand form */}
          <ProjectDataForm loading={loading} submit={submit} />
          <Spacer x="12" />

          {/* Righthand form */}
          <SectionsForm
            loading={loading}
            sections={sections}
            setSections={setSections}
          />
        </div>
      </PageWrapper>
    </>
  );
}
