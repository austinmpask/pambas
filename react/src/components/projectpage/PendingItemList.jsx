import { useState } from "react";
import PendingItem from "./PendingItem";
import PendingItemForm from "src/components/forms/PendingItemForm";

export default function PendingItemList({ data }) {
  console.log(data);

  const [menuOpen, setMenuOpen] = useState(false);

  //TODO: GET /openitems or whatever

  const dummyData = [
    {
      id: 3,
      itemName: "Query Screenshot",
      description: "Screenshot showing how the user list was made",
      controlOwner: "Bob Joe",
      lastContact: "12/10/24",
      createdAt: "12/8/24",
    },
    {
      id: 4,
      itemName: "User List",
      description: "Export of all users for AWS",
      controlOwner: "Jane Doe",
      lastContact: "12/11/24",
      createdAt: "12/9/24",
    },
  ];
  return (
    <>
      <PendingItemForm lineID={data.id} open={menuOpen} setOpen={setMenuOpen} />

      <div>
        <article className="message pending-item-list">
          <div className="message-header">
            <span>{`${data.pendingItems} Pending Items`}</span>
            <button className="button" onClick={() => setMenuOpen(true)}>
              Add
            </button>
          </div>
          <div className="message-body">
            {dummyData.map((item, index) => (
              <PendingItem data={item} key={index} />
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
