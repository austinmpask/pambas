//Icons
import {
  faBinoculars,
  faBook,
  faFile,
  faFileSignature,
  faImage,
  faPuzzlePiece,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

//Utils
import { DataFields } from "src/utils/validations";

//Select an appropriate icon for pending item by text matching the title with keywords
export default function pendingItemIcon(itemName) {
  let chosenIcon = faFile;
  //Standardize title words
  const title = itemName.split(" ").map((word) => word.toLowerCase());

  //Order lists in reverse specificity
  const comparisonLists = [
    [DataFields.IMAGE_KEYWORDS, faImage],
    [DataFields.LOG_KEYWORDS, faBook],
    [DataFields.SAMPLE_KEYWORDS, faPuzzlePiece],
    [DataFields.POPULATION_KEYWORDS, faUsers],
    [DataFields.QUERY_KEYWORDS, faBinoculars],
    [DataFields.POLICY_KEYWORDS, faFileSignature],
  ];

  //Traverse the lists in order of reverse specificity (not as quick but makes for easy logic in this context)
  comparisonLists.forEach(([list, icon]) => {
    title.forEach((word) => {
      if (list.includes(word)) {
        chosenIcon = icon;
      }
    });
  });

  return chosenIcon;
}
