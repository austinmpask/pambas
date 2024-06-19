//Children
import PageWrapper from "src/components/PageWrapper";
import ProjectForm from "src/components/forms/project/ProjectForm";
import NavBar from "src/components/navbar/Navbar";

export default function NewProjectPage() {
  return (
    <>
      <NavBar />
      <PageWrapper title="New Project">
        <ProjectForm />
      </PageWrapper>
    </>
  );
}
