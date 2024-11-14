/*-------------------Cleaned up 10/28/24-------------------*/

//React
import { useContext } from "react";

//Contexts
import { UserContext } from "src/context/UserContext";

//Children
import { Link, Button, Avatar, User, Tooltip } from "@nextui-org/react";

//Button which shows the users profile and clicking redirects to settings page
export default function OptionsButton() {
  // Consume user information from context
  const { userData } = useContext(UserContext);
  return (
    <Tooltip
      delay={250}
      content={
        <div className="px-1 py-2">
          <div className="text-small font-bold">Options</div>
          <div className="text-tiny">
            Edit profile, customizations, application options
          </div>
        </div>
      }
    >
      <Button as={Link} href="/settings" variant="light" disableRipple>
        <User
          className="hidden sm:flex"
          name={`${userData.firstName} ${userData.lastName}`}
          description={userData.username}
          avatarProps={{
            name: String(userData.firstName[0]) + String(userData.lastName[0]),
          }}
        />

        <Avatar
          name={String(userData.firstName[0]) + String(userData.lastName[0])}
          className="flex sm:hidden"
        />
      </Button>
    </Tooltip>
  );
}
