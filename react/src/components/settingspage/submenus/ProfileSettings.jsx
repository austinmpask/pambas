/*-------------------Cleaned up 11/10/24-------------------*/

//Icons
import { faCircleUser, faLock } from "@fortawesome/free-solid-svg-icons";

//Children
import SettingsCard from "src/components/settingspage/SettingsCard";
import SettingsCardSection from "src/components/settingspage/SettingsCardSection";
import UserInfo from "src/components/settingspage/UserInfo";
import NameSettingsForm from "src/components/forms/settings/NameSettingsForm";

//Form for changing user info && viewing login credentials
export default function ProfileSettings() {
  return (
    <>
      <SettingsCard title="Login and Password" icon={faLock}>
        <SettingsCardSection title="Username/Email">
          <UserInfo />
        </SettingsCardSection>
      </SettingsCard>

      <SettingsCard title="Personal Information" icon={faCircleUser} end>
        <SettingsCardSection title="First and Last Name">
          <NameSettingsForm />
        </SettingsCardSection>
      </SettingsCard>
    </>
  );
}
