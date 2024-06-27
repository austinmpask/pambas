import { useEffect, useState } from "react";
import PendingItem from "./PendingItem";
import PendingItemForm from "src/components/forms/PendingItemForm";
import getPendingItems from "../../utils/getPendingItems";

export default function PendingItemList({ lineID, numPending, setLineState }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [items, setItems] = useState([]);

  useEffect(() => {
    async function getItems() {
      const dataObj = await getPendingItems(lineID);
      if (dataObj.ok) {
        setItems(dataObj.data);
      } else {
        //Couldnt find project/user doesnt own project
        console.error("error");
      }
    }

    numPending !== undefined && lineID !== undefined && getItems();
  }, [numPending]);

  return (
    <>
      <PendingItemForm
        lineID={lineID}
        open={menuOpen}
        setOpen={setMenuOpen}
        setLineState={setLineState}
      />

      <div>
        <article className="message pending-item-list">
          <div className="message-header">
            <span>{`${numPending} Pending Items`}</span>
            <button className="button" onClick={() => setMenuOpen(true)}>
              Add
            </button>
          </div>
          <div className="message-body">
            {items.map((item, index) => (
              <PendingItem
                data={item}
                key={index}
                setLineState={setLineState}
              />
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
