/*-------------------Cleaned up 11/7/24-------------------*/

//React
import { useContext, useEffect, useState } from "react";

//Icons
import {
  faCircleUser,
  faFile,
  faPenToSquare,
  faCircleXmark,
  faReply,
  faSquarePen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utils
import toastRequest from "src/utils/toastRequest";
import toTitle from "src/utils/toTitle";
import shortDate from "src/utils/shortDate";
import pendingItemIcon from "src/utils/pendingItemIcon";
import { DataFields } from "src/utils/validations";

//Children
import ItemModal from "src/components/forms/ItemModal";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  useDisclosure,
} from "@nextui-org/react";

//Contexts
import { LineStateContext } from "./lineitem/LineItemWrapper";
import { HeaderStatsContext } from "src/pages/ProjectPage";

//Component to summarize details of a given pending/open item. Shown in the pending item list for a control
export default function PendingItem({ data }) {
  //Consume line context
  const { setLineState } = useContext(LineStateContext);

  //Setter for project summary stats in the header for when item deleted
  const { setHeaderStats } = useContext(HeaderStatsContext);

  //State for the item data
  const [itemData, setItemData] = useState({ ...data });

  //Hovering state for title to indicate editing and change icon
  const [hovering, setHovering] = useState(false);

  //Modal builtins
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //Dynamic icons for the card
  const [icon, setIcon] = useState(faFile);
  const [contactIcon, setContactIcon] = useState(faPenToSquare);

  //Reflect any updates from db in item state
  useEffect(() => {
    setItemData({ ...data });
  }, [data]);

  //Assign appropriate icons for the type of request/contact date
  useEffect(() => {
    //Item icon, helper function chooses an appropriate item based on keywords in title
    setIcon(() => pendingItemIcon(itemData.itemName));

    //Contact icon, based on if a followup has been noted
    itemData.lastContactDate
      ? setContactIcon(faReply)
      : setContactIcon(faPenToSquare);
  }, [itemData]);

  //Make request to delete open item
  async function deleteItem() {
    await toastRequest({
      method: "DELETE",
      route: `/openitem/${itemData.id}`,
      successCB: () => {
        //Update the pending item counts for entire project and individual line state since the context wont automatically be changed by this operation

        //Control's count
        setLineState((prev) => ({
          ...prev,
          pendingItems: prev.pendingItems - 1,
        }));

        // Overall project count for header
        setHeaderStats((prev) => ({
          ...prev,
          openItems: prev.openItems - 1,
        }));
      },
      // Random fun success message once deleted
      success:
        DataFields.COMPLETION_MESSAGES[
          Math.floor(Math.random() * DataFields.COMPLETION_MESSAGES.length)
        ],
    });
  }

  //Change the followup date for the item to the present date/time
  async function followup() {
    await toastRequest({
      method: "PUT",
      route: `/openitem/${itemData.id}/followup`,
      successCB: (data) => {
        setItemData((prev) => {
          return { ...prev, lastContactDate: data };
        });
      },
      success: "Follow-up date noted!",
    });
  }

  return (
    <>
      {/* Set up item modal for editing instead of adding item */}
      <ItemModal
        editing
        itemID={itemData.id}
        itemData={itemData}
        setItemData={setItemData}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />

      {/* Actual item card */}
      <Card className="w-full rounded-md mb-3 drop-shadow-lg">
        {/* Card header */}
        <CardHeader className="text-white flex flex-row justify-between items-center h-[30px] rounded-md rounded-b-none text-sm px-3 py-4 bg-slate-700">
          {/* Title with icon, can be clicked to edit the item's details. Pen icon appears if hovered */}
          <div
            className="cursor-pointer flex flex-row items-center"
            onClick={onOpen}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <FontAwesomeIcon className="mr-2" size="lg" icon={icon} />
            <span>{toTitle(itemData.itemName)}</span>

            {/* Hover icon */}
            {hovering && (
              <FontAwesomeIcon className="ml-1" icon={faSquarePen} />
            )}
          </div>

          {/* Delete button */}
          <FontAwesomeIcon
            className="text-danger cursor-pointer"
            onClick={deleteItem}
            icon={faCircleXmark}
          />
        </CardHeader>
        <Divider />
        {/* Card content */}
        <CardBody className="bg-slate-200 p-2.5 min-h-[95px] flex flex-col justify-center">
          {/* Add the item description, or if none, add a larger version of the item's icon */}
          {itemData.description ? (
            <>
              <label className="p-1 text-default-600 text-xs font-semibold">
                Description
              </label>
              <div className="bg-slate-300 rounded-md p-2 pb-4 w-full text-default-600 text-xs">
                <p>{toTitle(itemData.description, true)}</p>
              </div>
            </>
          ) : (
            <FontAwesomeIcon className="text-slate-300" size="3x" icon={icon} />
          )}
        </CardBody>
        <Divider />
        <CardFooter className="bg-slate-200 rounded-b-md h-9">
          {/* Show owner if recorded, if not just show the followup button */}
          <div className="text-xs w-full text-default-500 flex flex-end flex-row items-center py-2 justify-between">
            {itemData.controlOwner ? (
              <div>
                <FontAwesomeIcon className="mr-1" icon={faCircleUser} />

                <span>{toTitle(itemData.controlOwner)}</span>
              </div>
            ) : (
              // Force justify-between to keep button on right
              <span></span>
            )}
            {/* Button should be green if never clicked to guide user to it, then become grey once used to not distract */}
            <div
              className={`${
                itemData.lastContactDate
                  ? "bg-slate-300"
                  : "bg-green-500 text-default-800"
              } py-1 px-2 rounded text-xs cursor-pointer`}
              onClick={followup}
            >
              {itemData.lastContactDate
                ? shortDate(itemData.lastContactDate)
                : "Note followup date"}

              <FontAwesomeIcon className="ml-1" icon={contactIcon} />
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
