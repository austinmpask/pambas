/*-------------------Cleaned up 9/10/24-------------------*/
//React
import { useContext } from "react";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

//Children
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

//Cell to display the control number, or indicate the flag status when it is raised
//Line item parent handles click events due to side effect on sibling component
export default function ControlNumberCell({ handleClick }) {
  //Consume line unique context
  const { lineState, lineUIState, end } = useContext(LineStateContext);
  return (
    <Dropdown>
      <DropdownTrigger>
        <div
          //Turn cell green if line is complete
          className={`z-5 text-default-500 transition-all border-solid border-r-1 border-inherit flex flex-col justify-center items-center select-none cursor-pointer ${
            lineState.flagMarker &&
            "bg-danger sm:bg-inherit text-white sm:text-default-500"
          } ${
            lineUIState.complete && "sm:bg-success border-success overflow"
          } ${end && "sm:rounded-bl-3xl"}`}
        >
          {/* Display control number */}
          <p className="text-sm lg:text-small font-semibold">
            {lineState.controlNumber}
          </p>
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          className="text-default-500"
          startContent={<FontAwesomeIcon icon={faFlag} />}
          key="flag"
          onClick={handleClick} //Handle the click event for the flag marker
        >
          {lineState.flagMarker ? "Remove flag" : "Mark important"}
        </DropdownItem>
        <DropdownItem
          isDisabled
          className="text-default-500"
          startContent={<FontAwesomeIcon icon={faPenToSquare} />}
          key="edit"
        >
          Edit control
        </DropdownItem>
        <DropdownItem
          isDisabled
          startContent={<FontAwesomeIcon icon={faTrash} className="" />}
          key="delete"
          className="text-danger"
          color="danger"
        >
          Delete control
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
