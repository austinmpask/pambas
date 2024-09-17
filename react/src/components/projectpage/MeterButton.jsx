import { useEffect, useState } from "react";
import CircleMeter from "./CircleMeter";

//Animation
import { motion, AnimatePresence } from "framer-motion";

import { Input, Button } from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleDollarToSlot,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

//Two types: "bill", and "modal". Bill will open the bill interface within the component, modal will open a list of pending items (TODO)
export default function MeterButton({
  val,
  displayVal,
  max,
  color,
  percentage = false,
  label,
  type,
  objKey,
  onSubmit,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [amountToBill, setAmountToBill] = useState(0);

  //Reset the input when menu opens/closes
  useEffect(() => {
    setAmountToBill(0);
  }, [menuOpen]);

  function billClient() {
    //Make request if there was an amount entered
    if (amountToBill !== 0) onSubmit(objKey, Number(amountToBill));
    setMenuOpen(false);
  }

  return (
    <div
      className={`px-3 py-2 transition-all rounded-2xl select-none w-full flex flex-col mb-2 ${
        type === "bill" && "hover:shadow-xl hover:mb-4 hover:mt-1"
      } ${menuOpen && "header-button-menu-open shadow-xl mb-4 mt-1"}`}
    >
      <div
        className={`h-16 w-full flex flex-row justify-start items-center ${
          type === "bill" && "cursor-pointer"
        }`}
        onClick={() => {
          type === "bill" && setMenuOpen((prev) => !prev);
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
            <div className="h-16 flex flex-row justify-between items-center mb-2">
              <Input
                size="sm"
                type="number"
                className="w-1/2"
                label="Hours to Bill"
                value={amountToBill === 0 ? "" : amountToBill}
                onChange={(e) => setAmountToBill(Number(e.target.value))}
              />
              <div>
                <Button
                  color="success"
                  isIconOnly
                  className="mr-2"
                  onClick={() => setAmountToBill((prev) => Number(prev) + 1)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>

                <Button
                  color="danger"
                  isIconOnly
                  onClick={() => setAmountToBill((prev) => Number(prev) - 1)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
              </div>
            </div>

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
