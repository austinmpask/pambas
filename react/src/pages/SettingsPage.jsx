//Children
import PageWrapper from "src/components/PageWrapper";
import NavBar from "src/components/navbar/Navbar";
import SettingsMenu from "src/components/settingspage/SettingsMenu";

export default function SettingsPage() {
  return (
    <>
      <NavBar />
      <PageWrapper title="Settings">
        <SettingsMenu />
      </PageWrapper>
    </>
  );
}
