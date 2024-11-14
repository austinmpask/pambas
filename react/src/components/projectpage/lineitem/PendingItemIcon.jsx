/*-------------------Cleaned up 11/8/24-------------------*/

//React
import { useContext } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faPaperclip,
  faFile,
} from "@fortawesome/free-solid-svg-icons";

//Children
import { Badge } from "@nextui-org/react";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Dynamic color/type of icon depending on line state and items
export default function PendingItemIcon() {
  const { lineState, lineUIState } = useContext(LineStateContext);
  return (
    <Badge
      content={lineState.pendingItems}
      size="sm"
      isOneChar
      showOutline={false}
      color={lineUIState.complete ? "success" : "warning"}
      placement="bottom-right"
      className={`${
        lineUIState.complete ? "text-successShadow" : "text-white"
      } "font-semibold"`}
      isInvisible={lineState.pendingItems <= 1 || lineUIState.menuOpen}
    >
      <FontAwesomeIcon
        icon={
          lineUIState.menuOpen
            ? faCircleXmark
            : lineState.pendingItems === 0
            ? faPaperclip
            : faFile
        }
        size={lineUIState.menuOpen ? "lg" : undefined}
        className={
          lineState.pendingItems > 0 && !lineUIState.menuOpen
            ? lineUIState.complete
              ? "text-successShadow"
              : "text-warning"
            : lineUIState.menuOpen
            ? lineUIState.complete
              ? "text-dangerShadow"
              : "text-danger"
            : lineUIState.complete
            ? "text-successShadow"
            : "text-default-300"
        }
      />
    </Badge>
  );
}
