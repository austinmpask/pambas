/*-------------------Cleaned up 11/10/24-------------------*/

//React
import { useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faUniversalAccess,
} from "@fortawesome/free-solid-svg-icons";

//Children
import ProfileSettings from "src/components/settingspage/submenus/ProfileSettings";
import AccessibilitySettings from "src/components/settingspage/submenus/AccessibilitySettings";
import PreferencesSettings from "src/components/settingspage/submenus/PreferencesSettings";
import { Tabs, Tab } from "@nextui-org/react";

// Menu linking to different settings forms. Handles requests for most settings options
export default function SettingsMenu() {
  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //TODO Make actual request
  function makeRequest(dataKey, value) {
    console.log({ dataKey, value });
  }

  // Setting pages
  const tabs = [
    {
      id: "account",
      label: "Profile",
      content: <ProfileSettings />,
      icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
      id: "preferences",
      label: "Preferences",
      content: <PreferencesSettings request={makeRequest} loading={loading} />,
      icon: <FontAwesomeIcon icon={faGear} />,
    },
    {
      id: "accessibility",
      label: "Accessibility",
      content: <AccessibilitySettings request={makeRequest} />,
      icon: <FontAwesomeIcon icon={faUniversalAccess} />,
    },
  ];

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden sm:flex sm:flex-col">
        <Tabs
          isVertical
          variant="light"
          aria-label="Settings tabs"
          items={tabs}
        >
          {(item) => (
            <Tab
              key={item.id}
              className="w-full"
              title={
                <div className="flex w-full sm:w-[150px] flex-row justify-start items-center space-x-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              }
            >
              {item.content}
            </Tab>
          )}
        </Tabs>
      </div>
      {/* MOBILE */}
      <div className="flex flex-col sm:hidden">
        <Tabs aria-label="Settings tabs" items={tabs}>
          {(item) => (
            <Tab
              className="w-full h-[60px]"
              key={item.id}
              title={
                <div className="flex w-full flex-row justify-start items-center space-x-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              }
            >
              <div className="w-full">{item.content}</div>
            </Tab>
          )}
        </Tabs>
      </div>
    </>
  );
}
