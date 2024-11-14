/*-------------------Cleaned up 11/10/24-------------------*/

//React
import { useContext } from "react";

//Children
import { Spacer, Tooltip } from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { UserContext } from "src/context/UserContext";

//Utils
import { UIVars } from "src/utils/validations";

//Display users login credentials
export default function UserInfo() {
  //Consume user info
  const { userData } = useContext(UserContext);
  return (
    <Tooltip
      placement="top-start"
      content="Login and Password can not be changed at this time"
      delay={UIVars.TOOLTIP_DELAY_MS}
    >
      <div className="flex flex-row mb-4">
        <Spacer x={4} />

        <div className="flex flex-col">
          <div className="flex flex-row justify-start items-center space-x-2">
            <FontAwesomeIcon className="text-default-400" icon={faLock} />
            <p className="text-sm text-default-400">{userData.username}</p>
          </div>

          <div className="flex flex-row justify-start items-center space-x-2">
            <FontAwesomeIcon className="text-default-400" icon={faLock} />
            <p className="text-sm text-default-400">{userData.email}</p>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}
