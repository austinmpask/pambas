//Children
import PageWrapper from "src/components/PageWrapper";
import NavBar from "src/components/navbar/Navbar";
import SettingsForm from "src/components/forms/SettingsForm";

export default function SettingsPage() {
  return (
    <>
      <NavBar />
      <PageWrapper title="Settings">
        <SettingsForm />
      </PageWrapper>
    </>
  );
}
