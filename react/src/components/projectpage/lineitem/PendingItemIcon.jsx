//React
import { useContext } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Dynamic color/type of icon depending on line state and items
export default function PendingItemIcon() {
  const { lineUIState, lineState } = useContext(LineStateContext);

  return <FontAwesomeIcon icon={faFile} />;
}
