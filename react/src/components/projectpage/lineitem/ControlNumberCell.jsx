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
  const { lineState, lineUIState } = useContext(LineStateContext);
  return (
    <Dropdown>
      <DropdownTrigger>
        <div
          //Turn cell green if line is complete
          className={`transition-all border-solid border-r-1 border-inherit flex flex-col justify-center items-center select-none cursor-pointer ${
            lineUIState.complete && "bg-success border-success overflow"
          }`}
        >
          {/* Display control number */}
          <p className="text-xs lg:text-small font-semibold text-default-500">
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
          className="text-default-500"
          startContent={<FontAwesomeIcon icon={faPenToSquare} />}
          key="edit"
        >
          Edit control
        </DropdownItem>
        <DropdownItem
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
