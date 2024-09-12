//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

//Dynamic color/type of icon depending on line state and items
//TODO: reimplement fanciness
export default function PendingItemIcon() {
  return <FontAwesomeIcon icon={faFile} className="text-default-300" />;
}
