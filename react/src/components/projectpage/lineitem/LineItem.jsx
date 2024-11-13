/*-------------------Cleaned up 9/10/24-------------------*/
//React
import { useEffect, useState, useContext, forwardRef } from "react";

//Contexts
import { LineStateContext } from "./LineItemWrapper";
import { HeaderStatsContext } from "src/pages/ProjectPage";

//Utils
import toastRequest from "src/utils/toastRequest";

//Children
import HangingFlag from "./HangingFlag";
import ControlNumberCell from "./ControlNumberCell";
import CheckBoxCell from "./CheckBoxCell";
import NoteBoxCell from "./NoteBoxCell";
import PendingItemCell from "./PendingItemCell";

// Individual line item for the project grid. Wrapped by a unique context to track state. Context stores ref for the component
export const LineItem = forwardRef(({ lineItemData }, ref) => {
  //Setter for project summary info which is affected by line item components
  const { setHeaderStats } = useContext(HeaderStatsContext);

  const [close, setClose] = useState(false);
  //Access the particular line context
  const {
    lineState,
    setLineState,
    lineUIState,
    setLineUIState,
    loading,
    setLoading,
    setHovering,
  } = useContext(LineStateContext);

  //Populate the line with initial line item data once it has been fetched
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
    //Close the flag marker
    lineState.flagMarker
      ? setClose(true) //This will change the line state from HangingFlag after 200ms delay for animation
      : setLineState((prev) => ({ ...prev, flagMarker: true })); //Open the flag marker immediately if it doesnt exist
  }

  return (
    // Line item container
    <div
      ref={ref} //Ref held by context
      className="grid mobile-grid-template sm:grid-cols-proj w-full"
      // Handle line hovered state change
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Hanging flag marker*/}
      {lineState.flagMarker && (
        <HangingFlag close={close} setClose={setClose} />
      )}

      {/* Cell displaying control number, clicking it toggles the hanging flag marker */}
      <ControlNumberCell handleClick={handleFlagClick} />

      {/* Checkbox Cells */}
      {lineState.checkBoxes.map((checkBox, i) => {
        return <CheckBoxCell key={i} i={i} cbState={checkBox} />;
      })}

      {/* Notes and pending item components */}
      <NoteBoxCell />
      <PendingItemCell />
    </div>
  );
});

LineItem.displayName = "LineItem";
export default LineItem;
