//React
import { useState, useEffect } from "react";

//Icons
import {
  faFile,
  // faPenToSquare,
  // faReply,
} from "@fortawesome/free-solid-svg-icons";

//Utils
// import xsDate from "src/utils/xsDate";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import pendingItemIcon from "src/utils/pendingItemIcon";

//Children
import { Card, CardBody, Link } from "@nextui-org/react";

//Small card for open items on dash, able to followup via button
export default function DashOpenItem({ data }) {
  //Icon will be determined based on the title keywords
  const [icon, setIcon] = useState(faFile);

  //   Icon based on if contact made or not
  // const [contactIcon, setContactIcon] = useState(faPenToSquare);

  //   Set icons based on contact status and title keywords
  useEffect(() => {
    data && setIcon(pendingItemIcon(data.itemName));

    // data.lastContactDate
    //   ? setContactIcon(faReply)
    //   : setContactIcon(faPenToSquare);
  }, [data]);

  return (
    <Card
      isPressable
      disableRipple
      isHoverable
      className="w-full h-[64px] flex flex-col justify-center mb-3"
    >
      <Link className="w-full" href={`/projects/${data.projID}`}>
        <CardBody className="grid grid-cols-6">
          <div className="col-span-1 flex flex-col justify-center items-center">
            <FontAwesomeIcon className="text-slate-400" icon={icon} />
          </div>
          <div className="flex flex-col col-span-3">
            <p className="text-slate-800 text-sm font-semibold">
              {data.itemName}
            </p>
            <p className="text-slate-500 text-xs mb-1">{data.controlOwner}</p>
          </div>
          {/* Can be added back */}
          {/* <div className="col-span-2 flex flex-col items-center justify-center">
          <div
          className={`${
            data.lastContactDate
            ? "bg-slate-300 text-slate-600"
            : "bg-success text-successShadow"
            } py-2 px-3 max-w-[100px] max-h-[40px] rounded-lg text-xs cursor-pointer flex flex-row items-center`}
            onClick={() => {}}
              >
              <p className="mr-2">
              {data.lastContactDate ? xsDate(data.lastContactDate) : "Reply"}
              </p>
              
              <FontAwesomeIcon icon={contactIcon} />
              </div>
              </div> */}
        </CardBody>
      </Link>
    </Card>
  );
}
