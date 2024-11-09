/*-------------------Cleaned up 10/28/24-------------------*/
//React
import { useEffect, useState, useContext } from "react";

//Utils
import Mousetrap from "mousetrap";

//Children
import CircleMeter from "./CircleMeter";
import { Button } from "@nextui-org/react";
import BudgetInput from "src/components/forms/components/BudgetInput";

//Animation
import { motion, AnimatePresence } from "framer-motion";

//Contexts
import { HeaderStatsContext } from "src/pages/ProjectPage";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDollarToSlot } from "@fortawesome/free-solid-svg-icons";

//Button which displays a circlemeter on the right side. Can be a dropdown or have no action.
export default function MeterButton({
  val,
  displayVal,
  max,
  color,
  percentage = false,
  label,
  dropdown = false,
  objKey, //Key of proj context to update
  onSubmit,
}) {
  //Track if collapsed or not
  const [menuOpen, setMenuOpen] = useState(false);

  //State for billing input
  const [amountToBill, setAmountToBill] = useState(0);

  //For discovering if a line is being used
  const { headerStats } = useContext(HeaderStatsContext);

  //Close if user selects something else
  useEffect(() => {
    if (headerStats.selectedLine !== null) {
      handleClose();
    }
  }, [headerStats.selectedLine]);

  //Reset the input when menu opens/closes
  useEffect(() => {
    setAmountToBill(0);
  }, [menuOpen]);

  //Make request if there was an amount entered
  function billClient() {
    if (amountToBill !== 0) onSubmit(objKey, Number(amountToBill));
    setMenuOpen(false);
  }

  // Bind escape back to the button if it is open and nothing else is selected
  useEffect(() => {
    menuOpen &&
      headerStats.selectedLine === null &&
      Mousetrap.bind("esc", handleClose);
  }, [menuOpen, headerStats.selectedLine]);

  //Close the menu, unbind key
  function handleClose() {
    setMenuOpen(false);
    Mousetrap.unbind("esc");
  }

  return (
    <div
      className={`px-3 py-2 transition-all rounded-2xl select-none w-full flex flex-col mb-2 ${
        dropdown && "hover:shadow-xl hover:mb-4 hover:mt-1"
      } ${menuOpen && "header-button-menu-open shadow-xl mb-4 mt-1"}`}
    >
      <div
        className={`h-16 w-full flex flex-row justify-start items-center ${
          dropdown && "cursor-pointer"
        }`}
        onClick={() => {
          dropdown && setMenuOpen((prev) => !prev);
        }}
      >
        <div className="mr-4">
          <CircleMeter
            val={val}
            displayVal={displayVal}
            max={max}
            percentage={percentage}
            color={color}
          />
        </div>
        <p className="font-semibold text-default-600">{label}</p>
      </div>

      {/* Secondary menu for billing button */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {menuOpen && (
          <motion.div
            initial={{ translateY: "-80px", opacity: 0, height: 0 }}
            animate={{ opacity: 1, translateY: "0px", height: "auto" }}
            exit={{ translateY: "-80px", opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 750, damping: 62 }}
          >
            <BudgetInput
              amountToBill={amountToBill}
              setAmountToBill={setAmountToBill}
            />

            <Button
              startContent={<FontAwesomeIcon icon={faCircleDollarToSlot} />}
              onClick={billClient}
              isDisabled={amountToBill === 0}
              className="w-full"
              color={amountToBill === 0 ? "" : "success"}
            >
              <p className="font-semibold">Bill it!</p>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
