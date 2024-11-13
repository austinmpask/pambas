//Children
import PageWrapper from "src/components/PageWrapper";
import SettingsMenu from "src/components/settingspage/SettingsMenu";
import FunBackground from "src/components/funbackground/FunBackground";

export default function SettingsPage() {
  return (
    <PageWrapper noGrid>
      <div className="invisible sm:visible">
        <FunBackground opacity={0.1} />
      </div>
      <SettingsMenu />
    </PageWrapper>
  );
}
