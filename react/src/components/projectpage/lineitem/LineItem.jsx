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

  //Activate the line for use if hovered on and there is no lockout.
  //Check lockout && hoveringHeld due to timing of state updates
  useEffect(() => {
    if (lineUIState.hoveringHeld && !lockout) {
      setLineUIState((prev) => ({
        ...prev,
        active: true,
      }));
    }
  }, [lockout, lineUIState.hoveringHeld]);

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

  //Handle line activation state and "up" state for animation delay
  useEffect(() => {
    //Lockout/allow interactivity immediately
    setLockout(lineUIState.active);

    //Handle animation delays for "up"
    if (lineUIState.active) {
      //Line is immediately "up" when activated
      setLineUIState((prev) => ({ ...prev, up: true }));
    } else {
      //Wait xxx delay to undo "up" when line deactivated
      setTimeout(() => {
        setLineUIState((prev) => ({ ...prev, up: false }));
      }, UIVars.LINE_ANIM_WAIT_MS);
    }
  }, [lineUIState.active]);

  //Add the hanging flag marker if appropriate after animation wait time
  useEffect(() => {
    //Hanging flag only is present when !up and the line is flagged
    setLineUIState((prev) => ({
      ...prev,
      hangingFlag: !lineUIState.up && lineState.flagMarker,
    }));
  }, [lineUIState.up, lineState.flagMarker]);

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
    if (lineUIState.active) {
      setLoading(true);
      //Line state update triggers API req
      setLineState((prev) => ({
        ...prev,
        flagMarker: !prev.flagMarker,
      }));
    }
  }

  //Deactivate line and de-hover. Sideeffects for up and lockout handled by useEffects
  function exitLine() {
    setLineUIState((prev) => ({
      ...prev,
      active: false,
      hoveringHeld: false,
    }));
  }

  //Ref for delay for acive css on lineitem
  const timeoutRef = useRef(null);

  return (
    // Line item container div
    <div
      //Raise z-index after the animation completes to avoid clipping issues
      // style={lineUIState.up ? { zIndex: "20" } : { zIndex: "0" }}
      //Border/fill will vary depending on if it is active
      className={`grid grid-cols-proj w-full ${lineUIState.active ? "" : ""}`}
      // onMouseEnter={() => {
      //   //If the line is not already activated, prep it for activation after delay
      //   if (!lineUIState.active) {
      //     timeoutRef.current = setTimeout(() => {
      //       setLineUIState((prev) => ({
      //         ...prev,
      //         hoveringHeld: true,
      //       }));
      //     }, UIVars.LINE_HOVER_DELAY_MS);
      //   }
      // }}
      // onMouseLeave={() => {
      //   //Clear the timeout if the mouse ever leaves
      //   clearTimeout(timeoutRef.current);

      //   //If this line is active, and no menus are used, deactivate it and remove lockout
      //   if (!lineUIState.writingNote && !lineUIState.menuOpen) {
      //     exitLine();
      //   }
      // }}
    >
      {/* Hanging flag marker, animated with CSSTransition */}
      <HangingFlag />
      {/* lINE ITEM CELLS (CONTROL #, CHECKBOXES, NOTES, PENDING ITEMS) */}
      <ControlNumberCell handleClick={handleFlagClick} />

      {/* Checkbox Cells */}
      {lineState.checkBoxes.map((checkBox, i) => {
        return <CheckBoxCell key={i} i={i} cbState={checkBox} />;
      })}

      <NoteBoxCell exit={exitLine} />
      <PendingItemCell />
    </div>
  );
}
