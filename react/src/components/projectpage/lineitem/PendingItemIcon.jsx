//React
import { useContext } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Dynamic color/type of icon depending on line state and items
export default function PendingItemIcon() {
  const { lineState, lineUIState } = useContext(LineStateContext);
  return (
    <FontAwesomeIcon
      icon={lineUIState.menuOpen ? faCircleXmark : faFile}
      size={lineUIState.menuOpen ? "lg" : "md"}
      className={
        lineState.pendingItems > 0 && !lineUIState.menuOpen
          ? "text-warning"
          : lineUIState.menuOpen
          ? "text-danger"
          : "text-default-300"
      }
    />
  );
}
