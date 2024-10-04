import React from "react";
import { useState, useRef } from "react";
import { motion, useDomEvent } from "framer-motion";

const transition = {
    type: "linear",
    damping: 20,
    stiffness: 120
  };


const ImageZoom = ({imageSrc, imageAlt}) => {
    const [isOpen, setOpen] = useState(false);

  useDomEvent(useRef(window), "scroll", () => isOpen && setOpen(false));

  return (
      <div className={`image-container ${isOpen ? "open" : ""}`}>
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0 }}
          className="shade"
          onClick={() => setOpen(false)}
          key={imageSrc}
          layout={true}
        />
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          onClick={() => setOpen(!isOpen)}
          layout={true}
          transition={transition}
        />
      </div>
  );
};

export default ImageZoom;