//React
import { useRef } from "react";

//Animation
import { motion } from "framer-motion";

// Colored ring for login background
export default function Ring({ opacity = 0.5 }) {
  //Logo colors for rings
  const colors = ["#00fe9b", "#10e6fe", "#fe3a84", "#ffee60"];

  //Randomize ring properties
  const size = useRef(Math.floor(40 + Math.random() * 20));
  const border = useRef(10 + Math.floor((size.current - 40) / 4));
  const color = useRef(colors[Math.floor(Math.random() * colors.length)]);
  const x = useRef(`${Math.floor(Math.random() * 100)}%`);
  const y = useRef(`${Math.floor(Math.random() * 100)}%`);

  //Make easier to apply
  const properties = {
    width: size.current,
    height: size.current,
    border: `${border.current}px solid ${color.current}`,
    left: x.current,
    top: y.current,
  };

  //Fade in out, animatepresence in parent
  return (
    <motion.div
      className="absolute rounded-full"
      style={properties}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{
        duration: 2,
        ease: [0.22, 0.13, 0.16, 1],
      }}
    />
  );
}
