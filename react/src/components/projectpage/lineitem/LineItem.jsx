//React
import { useEffect, useRef, useContext } from "react";

//Contexts
import { LockoutContext } from "src/context/LockoutContext";
import { LineStateContext } from "./LineItemWrapper";
import { HeaderStatsContext } from "src/pages/ProjectPage";

//Utils
import toastRequest from "src/utils/toastRequest";
import { UIVars } from "src/utils/validations";

//Children
import PendingItemCell from "./PendingItemCell";
import HangingFlag from "./HangingFlag";
import ControlNumberCell from "./ControlNumberCell";
import NoteBoxCell from "./NoteBoxCell";
import CheckBoxCell from "./CheckBoxCell";

// Individual line item for the project grid
export default function LineItem({ lineItemData }) {
  //Lock out UI elements if user is interacting with one already
  const { lockout, setLockout } = useContext(LockoutContext);

  //Setter for project summary info which is affected by line item components
  const { setHeaderStats } = useContext(HeaderStatsContext);

  //Access the particular line context
  const {
    lineState,
    setLineState,
    lineUIState,
    setLineUIState,
    loading,
    setLoading,
  } = useContext(LineStateContext);

  //Populate the line with initial line item data once it is fetched
  useEffect(() => {
    lineItemData &&
      setLineState((prev) => ({
        ...prev,
        checkBoxes: lineItemData.checkBoxes || [0, 0, 0],
        flagMarker: lineItemData.flagMarker || false,
        notes: lineItemData.notes || "",
        pendingItems: lineItemData.pendingItems || 0,
        controlNumber: lineItemData.controlNumber || "",
        id: lineItemData.id,
      }));
  }, [lineItemData]);

  //When checkboxes update, check if row is now complete
  useEffect(() => {
    //Every box === 1 means the row is completed
    setLineUIState((prev) => ({
      ...prev,
      complete: lineState.checkBoxes.every((box) => box === 1),
    }));
  }, [lineState.checkBoxes]);

  //When the linestate is updated, make a request to DB to update
  useEffect(() => {
    async function putData() {
      await toastRequest({
        method: "PUT",
        route: `/lineitem/${lineItemData.id}`,
        data: lineState,
        setLoading,
        sToastDisabled: true,
        successCB: (message) => {
          //Match the state to the api response, should not change since this was preceded by optimistic update
          const newState = JSON.parse(message);
          setLineState(newState);

          //Forward the project completion to the header
          setHeaderStats((prev) => ({
            ...prev,
            total: newState.projectTotal,
            completed: newState.projectCompletion,
          }));
        },
      });
    }

    //Only make api request when user initiated the change to state
    loading && putData();
  }, [lineState]);

  //Click flag: update state optimistically, trigger api request
  function handleFlagClick() {
    setLoading(true);
    //Line state update triggers API req
    setLineState((prev) => ({
      ...prev,
      flagMarker: !prev.flagMarker,
    }));
  }

  return (
    // Line item container div
    <div className="grid grid-cols-proj w-full">
      {/* Hanging flag marker, animated with CSSTransition */}
      <HangingFlag />
      {/* lINE ITEM CELLS (CONTROL #, CHECKBOXES, NOTES, PENDING ITEMS) */}
      <ControlNumberCell handleClick={handleFlagClick} />

      {/* Checkbox Cells */}
      {lineState.checkBoxes.map((checkBox, i) => {
        return <CheckBoxCell key={i} i={i} cbState={checkBox} />;
      })}

      <NoteBoxCell />
      <PendingItemCell />
    </div>
  );
}
