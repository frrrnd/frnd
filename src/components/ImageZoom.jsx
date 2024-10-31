import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const ImageZoom = ({ src, alt }) => {
  const [mounted, setMounted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const imageRef = useRef(null);

  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = {
    damping: 30,
    stiffness: 300,
    mass: 0.5,
  };

  const scaleSpring = useSpring(scale, springConfig);
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true);
    }
  }, []);

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsZoomed((prev) => !prev);
    setIsAnimating(true);

    if (!isZoomed) {
      const rect = imageRef.current.getBoundingClientRect();
      const maxScaleWidth = window.innerWidth / rect.width;
      const maxScaleHeight = window.innerHeight / rect.height;
      const maxScale = Math.min(maxScaleWidth, maxScaleHeight);

      const centerX = window.innerWidth / 2 - (rect.left + rect.width / 2);
      const centerY = window.innerHeight / 2 - (rect.top + rect.height / 2);

      x.set(centerX);
      y.set(centerY);
      scale.set(maxScale);
    } else {
      x.set(0);
      y.set(0);
      scale.set(1);

      setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Tempo da animação de fechamento em ms
    }
  };

  if (!mounted) {
    return <img src={src} alt={alt} className="max-w-full h-auto cursor-zoom-in" ref={imageRef} />;
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {(isZoomed || isAnimating) && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={imageRef}
        className={`relative inline-block ${isZoomed || isAnimating ? 'z-50' : 'z-0'}`}
        role="button"
        tabIndex={0}
        onClick={handleImageClick}
        style={{
          x: xSpring,
          y: ySpring,
          scale: scaleSpring,
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          className={`max-w-full h-auto ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        />
      </motion.div>
    </>
  );
};

export default ImageZoom;
