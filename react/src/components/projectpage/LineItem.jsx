//React
import { useEffect, useRef, useState, useContext } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faFile } from "@fortawesome/free-solid-svg-icons";

//Utils

// import TextBoxHelpers from "src/components/TextBoxHelpers";
import PendingItemList from "src/components/projectpage/PendingItemList";

import toastRequest from "../../utils/toastRequest";
import NoteBox from "./NoteBox";
import CheckBoxButton from "./CheckBoxButton";

// Individual line item for the project grid
export default function LineItem({ lineItemData, setHeaderStats }) {
  //State to track if this line item is selected
  const [active, setActive] = useState(false);

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Indication for if the note UI is being used
  const [writingNote, setWritingNote] = useState(false);

  //Indication for if the open items menu has been opened
  const [menuOpen, setMenuOpen] = useState(false);

  //State for the entire line for making updates
  const [lineState, setLineState] = useState({
    checkBoxes: lineItemData.checkBoxes || [0, 0, 0],
    flagMarker: lineItemData.flagMarker || false,
    notes: lineItemData.notes || "",
    pendingItems: lineItemData.pendingItems || 0,
  });

  //Ref for delay for acive css on lineitem
  const timeoutRef = useRef(null);

  //Prepare the states and setters to send to notebox child
  const noteProps = {
    writingNote,
    setWritingNote,
    lineState,
    setLineState,
    setLoading,
  };

  //Click flag: update state optimistically, trigger api request (Reimplement)
  function handleFlagClick() {
    setLoading(true);
    setLineState((previous) => {
      return { ...previous, flagMarker: !previous.flagMarker };
    });
  }

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
          //Match the state to the api response, should not change
          const newState = JSON.parse(message);
          setLineState(newState);
          setHeaderStats({
            total: newState.projectTotal,
            completed: newState.projectCompletion,
          });
        },
      });
    }
    //Only make api request when user made the change to state
    loading && putData();
  }, [lineState]);

  return (
    <>
      <div
        className={`grid ${active && "shadow"} ${!active && "hover"}`}
        onMouseEnter={() => {
          timeoutRef.current = setTimeout(
            () => !active && setActive(true),
            160
          );
        }}
        onMouseLeave={() => {
          clearTimeout(timeoutRef.current);
          !writingNote && !menuOpen && setActive(false);
        }}
      >
        {/* <div
          className="cell line-item-cell centered-cell click-cell"
          onClick={handleFlagClick}
        >
          {lineState.flagMarker && (
            <span className="icon">
              <FontAwesomeIcon icon={faCircleExclamation} />
            </span>
          )}
        </div> */}

        <div className="cell centered-cell control-cell">
          <label className="label">{lineItemData.controlNumber}</label>
        </div>
        {lineState.checkBoxes.map((checkBox, i) => {
          return (
            <div
              key={i}
              className="cell line-item-cell centered-cell click-cell"
            >
              <CheckBoxButton
                index={i}
                cbState={checkBox}
                setLineState={setLineState}
                setLoading={setLoading}
                active={active}
              />
            </div>
          );
        })}
        <div className="cell line-item-cell centered-cell cell-rb">
          <NoteBox {...noteProps} />
        </div>
        <div className="cell line-item-cell centered-cell item-cell">
          <button
            className="button"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faFile} />
              </span>
              <span>{lineState.pendingItems}</span>
            </span>
          </button>
          {menuOpen && (
            <PendingItemList
              lineID={lineItemData.id}
              numPending={lineState.pendingItems}
              setLineState={setLineState}
            />
          )}
        </div>
      </div>
    </>
  );
}
