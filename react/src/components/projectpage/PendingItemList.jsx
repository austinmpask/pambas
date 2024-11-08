/*-------------------Cleaned up 11/7/2024-------------------*/

//React
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";

//Animation
import { motion, AnimatePresence } from "framer-motion";

//Children
import PendingItem from "./PendingItem";
import FancyLoader from "src/components/FancyLoader";
import ItemModal from "src/components/forms/ItemModal";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  useDisclosure,
} from "@nextui-org/react";

//Contexts
import { LineStateContext } from "./lineitem/LineItemWrapper";

//Utils
import toastRequest from "src/utils/toastRequest";

//Menu showing the list of all pending/open items for a given control
export default function PendingItemList({ open }) {
  //Consume line context
  const { lineState } = useContext(LineStateContext);

  //Modal builtins
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //Track a list of open items, initially set to false to allow for conditional rendering w/o visual glitch with CSSTransition
  const [items, setItems] = useState(false);

  //Get list of pending items for the lineitem, refresh if there is a change in the amount of items for the line
  useEffect(() => {
    async function getItems() {
      await toastRequest({
        method: "GET",
        route: `/lineitem/${lineState.id}/openitems`,
        successCB: (data) => {
          setItems(data);
        },
        sToastDisabled: true,
      });
    }

    //Only make the request once the context has data from db (explicit check = undefined bc 0 is acceptable)
    // Also only make request if the menu is actually open to prevent tons of requests when scrolling around
    open &&
      lineState.pendingItems !== undefined &&
      lineState.id !== undefined &&
      getItems();
  }, [open, lineState.pendingItems]);

  return createPortal(
    <>
      {/* Modal for adding pending items */}
      <ItemModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {open && (
          <motion.div
            initial={{ x: -80, opacity: 0, zIndex: -10 }}
            animate={{ x: 0, opacity: 1, zIndex: 1 }}
            exit={{ x: -80, opacity: 0, zIndex: -10 }}
            transition={{
              type: "spring",
              stiffness: 750,
              mass: 0.6,
              damping: 30,
            }}
            className="fixed top-0 right-0 w-full"
          >
            <Card className="fixed top-0 right-0 mt-[100px] rounded-lg mx-3 sm:mx-5 z-10 w-4/5 sm:w-1/3 lg:w-1/6">
              {/* Card header */}
              <CardHeader className="bg-header-img flex flex-row justify-between rounded-lg rounded-b-none h-[40px] px-5 py-3.5">
                <div className="text-white font-semibold">
                  <span className="mr-1">{lineState.controlNumber}</span>
                  <span>Open Items</span>
                </div>

                {/* Button to open new item modal*/}
                <button className="text-white" onClick={onOpen}>
                  <FontAwesomeIcon icon={faFileCirclePlus} />
                </button>
              </CardHeader>
              <Divider />
              {/* Card content */}
              <CardBody className="min-h-[200px] flex flex-col items-center justify-center px-5">
                {/* Populate the list of open items into the card body */}
                {items ? (
                  items.length ? (
                    items.map((item, index) => (
                      <PendingItem data={item} key={index} />
                    ))
                  ) : (
                    // If there are no items, display alternate message
                    <div className="flex flex-col items-center text-default-400">
                      <span className="mb-3">Nothing to see here!</span>
                      <FontAwesomeIcon size="2x" icon={faFaceSmile} />
                    </div>
                  )
                ) : (
                  <FancyLoader />
                )}
              </CardBody>
              <Divider />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    // Attach portal to top level
    document.body
  );
}
