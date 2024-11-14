//React
import { useState, useEffect } from "react";
//Animation
import { AnimatePresence } from "framer-motion";

//Children
import Ring from "./Ring";

import { v4 as uuidv4 } from "uuid";

//Background with rings that appear and disappear
export default function FunBackground({ opacity }) {
  // Rings stored in array
  const [rings, setRings] = useState([
    <Ring key={uuidv4()} opacity={opacity} />,
    <Ring key={uuidv4()} opacity={opacity} />,
  ]);

  //Max 20 on screen at a time
  const limit = 20;

  //Start an interval to create rings
  useEffect(() => {
    const interval = setInterval(() => {
      setRings((p) => {
        // If at limit, remove the first ring in array before adding new one
        if (p.length === limit) {
          const newRings = [...p];
          newRings.shift();
          newRings.push(<Ring opacity={opacity} key={uuidv4()} />);
          return newRings;
        }
        // If under limit then just add a ring
        return [...p, <Ring key={p.length} opacity={opacity} />];
      });
    }, 500);

    //Cleanup
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed w-full h-screen overflow-hidden -z-50">
      <AnimatePresence>{rings && rings.map((ring) => ring)}</AnimatePresence>
    </div>
  );
}
