//Children
import { Input, Button } from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

//Prettier numeric input with add/subtract buttons for adjusting project budget
export default function BudgetInput({
  label = "Hours to Bill",
  amountToBill,
  setAmountToBill,
  required = false,
  noNegative = false, //Can restrict to only positive values allowed by buttons
}) {
  return (
    <div className="h-16 flex flex-row justify-between items-center mb-2">
      <Input
        size="sm"
        type="number"
        className="w-1/2"
        label={label}
        value={amountToBill === 0 ? "" : amountToBill}
        onChange={(e) => setAmountToBill(Number(e.target.value))}
        isRequired={required}
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
          onClick={() =>
            setAmountToBill((prev) => {
              return noNegative
                ? Math.max(Number(prev) - 1, 0)
                : Number(prev) - 1;
            })
          }
        >
          <FontAwesomeIcon icon={faMinus} />
        </Button>
      </div>
    </div>
  );
}
