//React
import { useEffect, useRef, useState, useContext } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faFile,
  faL,
} from "@fortawesome/free-solid-svg-icons";

//Utils
import { CSSTransition } from "react-transition-group";

// import TextBoxHelpers from "src/components/TextBoxHelpers";
import PendingItemList from "src/components/projectpage/PendingItemList";

import toastRequest from "../../utils/toastRequest";
import NoteBox from "./NoteBox";
import CheckBoxButton from "./CheckBoxButton";
import { LockoutContext } from "../../context/LockoutContext";
import { set } from "react-hook-form";

// Individual line item for the project grid
export default function LineItem({ lineItemData, setHeaderStats, index }) {
  //State to track if this line item is selected and active
  const [active, setActive] = useState(false);

  //Track if the component is being hovered
  const [hovering, setHovering] = useState(false);

  //Lock out UI elements if user is interacting with one already
  const { lockout, setLockout } = useContext(LockoutContext);

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Indication for if the note UI is being used
  const [writingNote, setWritingNote] = useState(false);

  //Indication for if the open items menu has been opened
  const [menuOpen, setMenuOpen] = useState(false);

  const [complete, setComplete] = useState(true);

  const [hangingFlag, setHangingFlag] = useState(false);

  const [up, setUp] = useState(false);

  //State for the entire line for making updates
  const [lineState, setLineState] = useState({
    checkBoxes: lineItemData.checkBoxes || [0, 0, 0],
    flagMarker: lineItemData.flagMarker || false,
    notes: lineItemData.notes || "",
    pendingItems: lineItemData.pendingItems || 0,
  });

  //Ref for delay for acive css on lineitem
  const timeoutRef = useRef(null);

  function exit() {
    setHovering(false);
    setActive(false);
  }

  //Prepare the states and setters to send to notebox child
  const noteProps = {
    writingNote,
    setWritingNote,
    lineState,
    setLineState,
    setLoading,
    active,
    exit,
    complete,
  };

  //Click flag: update state optimistically, trigger api request
  function handleFlagClick() {
    if (active) {
      setLoading(true);
      setLineState((previous) => {
        return { ...previous, flagMarker: !previous.flagMarker };
      });
    }
  }

  //When the linestate is updated, make a request to DB to update
  useEffect(() => {
    setComplete(() => lineState.checkBoxes.every((box) => box === 1));
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

          //Update the header stats with the new project completion percentage
          setHeaderStats((prev) => ({
            ...prev,
            total: newState.projectTotal,
            completed: newState.projectCompletion,
          }));
        },
      });
    }
    //Only make api request when user made the change to state

    loading && putData();
  }, [lineState]);

  //Reflect the activity in the lockout
  useEffect(() => {
    setLockout(active);

    //Handle the timing of the hanging flag transition for the animation
    if (active) {
      setUp(true);
      if (lineState.flagMarker) {
        setHangingFlag(false);
      }
    } else {
      setTimeout(() => {
        setUp(false);
      }, 260);
      //Add delay for when row is deactivated
      if (lineState.flagMarker) {
        setTimeout(() => {
          setHangingFlag(true);
        }, 260);
      }
    }
  }, [active]);

  //Activate the line if hovered on and there is no lockout.
  //Check lockout && hovering due to timing of state updates
  useEffect(() => {
    if (hovering && !lockout) {
      setActive(true);
    }
  }, [lockout, hovering]);

  //NOT active, YES lockout, YES index: light-border
  //NOT active, YES lockout, NO index: border
  //YES active: invis-border
  //NOT lockout, YES index: border
  //NOT lockout, NO index: invis-border
  return (
    <>
      <div
        style={up ? { zIndex: "20" } : { zIndex: "0" }}
        className={`grid ${active && "shadow "} ${
          !active && lockout && index && " border-light"
        } ${!lockout && index ? " border" : " invis-border"}  ${
          !active && !lockout && " hover"
        }
        `}
        onMouseEnter={() => {
          //If the line is not already activated, prep it for activation after delay
          if (!active) {
            timeoutRef.current = setTimeout(() => {
              setHovering(true);
            }, 150);
          }
        }}
        onMouseLeave={() => {
          clearTimeout(timeoutRef.current);

          //If this line is active, and no menus are used, deactivate it and remove lockout
          if (!writingNote && !menuOpen) {
            exit();
          }
          // !writingNote && !menuOpen && setActive(false);
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
        <CSSTransition
          in={hangingFlag}
          unmountOnExit
          classNames={"fu-marker"}
          timeout={330}
        >
          <div className="fu-marker has-background-danger has-text-white" s>
            <span className="icon fu-icon">
              <FontAwesomeIcon icon={faCircleExclamation} />
            </span>
          </div>
        </CSSTransition>
        <div
          className={`cell centered-cell control-cell ${
            active && " click-cell control-cell-active"
          } ${active && lineState.flagMarker && " control-cell-danger"} ${
            complete && !active && " complete-cell"
          } `}
          onClick={handleFlagClick}
        >
          <label
            className={`label ${
              lineState.flagMarker && active
                ? "has-text-white"
                : "has-text-grey"
            } ${active && "click-cell z1"} `}
          >
            {lineItemData.controlNumber}
          </label>
        </div>
        {lineState.checkBoxes.map((checkBox, i) => {
          return (
            <div
              key={i}
              className={`cell line-item-cell centered-cell click-cell ${
                complete && !active && " complete-cell"
              }`}
            >
              <CheckBoxButton
                index={i}
                cbState={checkBox}
                setLineState={setLineState}
                setLoading={setLoading}
                active={active}
                lineIndex={index}
                up={up}
              />
            </div>
          );
        })}
        <div
          className={`cell line-item-cell centered-cell ${
            complete && !active && " complete-cell"
          }`}
        >
          <NoteBox {...noteProps} />
        </div>
        <div
          className={`cell line-item-cell centered-cell item-cell  ${
            complete && !active && " complete-cell"
          }`}
        >
          <div
            className={active && "click-cell p-5"}
            onClick={() => {
              if (active) {
                setMenuOpen((prev) => !prev);
              }
            }}
          >
            {active ? (
              <div className="stacked">
                <span
                  className={`icon on-top ${
                    !lineState.pendingItems && "has-text-grey-light"
                  }`}
                  style={{ fontSize: "1.3em" }}
                >
                  <FontAwesomeIcon icon={faFile} />
                </span>
                {lineState.pendingItems !== 0 && (
                  <span
                    className="on-top has-text-white"
                    style={{ fontSize: ".8em" }}
                  >
                    {lineState.pendingItems}
                  </span>
                )}
              </div>
            ) : (
              <div className="stacked">
                <span
                  className={`icon on-top ${
                    lineState.pendingItems ? "has-text-grey" : "invis"
                  }`}
                  style={{ fontSize: "1.3em" }}
                >
                  <FontAwesomeIcon icon={faFile} />
                </span>

                {lineState.pendingItems !== 0 && (
                  <span
                    className="on-top has-text-white"
                    style={{ fontSize: ".8em" }}
                  >
                    {lineState.pendingItems}
                  </span>
                )}
              </div>
            )}
          </div>

          <CSSTransition
            in={menuOpen}
            unmountOnExit
            timeout={65}
            classNames="item-card"
          >
            <PendingItemList
              lineID={lineItemData.id}
              numPending={lineState.pendingItems}
              setLineState={setLineState}
              setHeaderStats={setHeaderStats}
              controlNumber={lineItemData.controlNumber}
            />
          </CSSTransition>
        </div>
      </div>
    </>
  );
}
