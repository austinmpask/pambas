/*-------------------Cleaned up 11/7/2024-------------------*/

//React
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faFaceSmile } from "@fortawesome/free-solid-svg-icons";

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
  Button,
} from "@nextui-org/react";

//Contexts
import { LineStateContext } from "./lineitem/LineItemWrapper";
import { HeaderStatsContext } from "src/pages/ProjectPage";

//Utils
import toastRequest from "src/utils/toastRequest";
import Mousetrap from "mousetrap";

//Menu showing the list of all pending/open items for a given control
export default function PendingItemList() {
  //Consume line context
  const { lineState, lineUIState, setLineUIState } =
    useContext(LineStateContext);

  const { setHeaderStats } = useContext(HeaderStatsContext);

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
    lineUIState.menuOpen &&
      lineState.pendingItems !== undefined &&
      lineState.id !== undefined &&
      getItems();
  }, [lineUIState.menuOpen, lineState.pendingItems]);

  useEffect(() => {
    lineUIState.menuOpen &&
      !lineUIState.writingNote &&
      Mousetrap.bind("esc", handleEscape);
  }, [lineUIState.menuOpen, lineUIState.writingNote]);

  function handleEscape() {
    // De-select the line item and close the menu
    setHeaderStats((prev) => ({ ...prev, selectedLine: null }));
    setLineUIState((prev) => ({ ...prev, menuOpen: false }));
    Mousetrap.unbind("esc");
  }

  return createPortal(
    <>
      {/* Modal for adding pending items */}
      <ItemModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {lineUIState.menuOpen && (
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
            <Card
              isHoverable
              className="fixed top-0 right-0 mt-[100px] mx-3 sm:mx-5 z-10 w-4/5 sm:w-1/3 lg:w-1/6 max-h-85vh"
            >
              {/* Card header */}
              <CardHeader className="bg-slate-700 flex flex-row justify-between h-[52px] px-5 py-3.5">
                <div className="text-white">
                  <span className="mr-2 font-semibold">
                    {lineState.controlNumber}
                  </span>
                  <span className="text-small">Open Items</span>
                </div>

                {/* Button to open new item modal*/}
                <Button
                  variant="solid"
                  size="sm"
                  color="primary"
                  onClick={onOpen}
                >
                  <FontAwesomeIcon size="lg" icon={faCirclePlus} />
                  New
                </Button>
              </CardHeader>
              <Divider />
              {/* Card content */}
              <CardBody
                className={`${
                  items && items.length
                    ? "justify-start overflow-auto"
                    : "justify-center overflow-hidden"
                } min-h-[200px] max-h-full flex flex-col items-center px-5 scrollbar-hidden`}
              >
                {/* Populate the list of open items into the card body */}

                {items ? (
                  items.length ? (
                    items.map((item, index) => (
                      <motion.div
                        className="w-full"
                        key={index}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: 0.1 * index,
                          type: "spring",
                          stiffness: 750,
                          mass: 0.2,
                          damping: 30,
                        }}
                      >
                        <PendingItem data={item} />
                      </motion.div>
                    ))
                  ) : (
                    // If there are no items, display alternate message
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 750,
                        mass: 0.6,
                        damping: 30,
                      }}
                    >
                      <div className="flex flex-col items-center text-default-400">
                        <span className="mb-3">Nothing to see here!</span>
                        <FontAwesomeIcon size="2x" icon={faFaceSmile} />
                      </div>
                    </motion.div>
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
