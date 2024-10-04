import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollingImage = ({ imageSrc, imageAlt }) => {
  const ref = useRef(null);

  // Obtenha os valores de rolagem relativos ao elemento
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "center 75%"] // Ajusta a escala na metade da viewport
  });

  // Transforma o valor de rolagem em uma escala de 0 a 1
  const scale = useTransform(scrollYProgress, [0.8, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref}>
      <motion.div
        style={{
          scale,
          opacity,
          margin: 'auto',
          position: 'relative'
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
        />
      </motion.div>
    </div>
  );
};

export default ScrollingImage;