'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

function ImageZoom(props) {
  const { src, alt } = props;
  
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Configuração mais suave para os springs
  const springConfig = {
    damping: 30,
    stiffness: 300,
    mass: 0.5
  };

  const scaleSpring = useSpring(scale, springConfig);
  const xSpring = useSpring(x, {
    ...springConfig,
    stiffness: 400, // Spring mais forte para o retorno ao centro
  });
  const ySpring = useSpring(y, {
    ...springConfig,
    stiffness: 400, // Spring mais forte para o retorno ao centro
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      scale.set(1);
      x.set(0);
      y.set(0);
      setIsZoomed(false);
    }
  }, [isOpen]);

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleOverlayClick = (e) => {
    if (e.currentTarget) {
      setIsOpen(false);
    }
  };

  const handleZoomedImageClick = (e) => {
    e.stopPropagation();
    if (!isDragging) {
      if (isOpen && !isZoomed) {
        setIsZoomed(true);
        scale.set(2);
      } else if (isOpen && isZoomed) {
        setIsZoomed(false);
        scale.set(1);
        x.set(0);
        y.set(0);
      }
    }
  };

  const handlePinch = (_, info) => {
    const newScale = Math.min(Math.max(scale.get() * info.scale, 1), 3);
    scale.set(newScale);
    setIsZoomed(newScale > 1);
  };

  const handlePan = (_, info) => {
    if (scale.get() > 1) {
      x.set(x.get() + info.delta.x);
      y.set(y.get() + info.delta.y);
    }
  };

  const handleDoubleTap = () => {
    const newScale = scale.get() > 1 ? 1 : 2;
    scale.set(newScale);
    setIsZoomed(newScale > 1);
    if (newScale === 1) {
      x.set(0);
      y.set(0);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    // Retorna a imagem ao centro com uma animação suave
    x.set(0);
    y.set(0);
    
    // Pequeno timeout para evitar que o click seja acionado logo após o drag
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  };

  if (!mounted) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto cursor-zoom-in"
      />
    );
  }

  return (
    <>
      <motion.div 
        className="relative inline-block" 
        role="button" 
        tabIndex={0} 
        onClick={handleImageClick}
        // whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="max-w-full h-auto cursor-zoom-in"
        />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
          className="overlay fixed inset-0 z-50 flex items-center justify-center bg-black/80 touch-none"
          onClick={handleOverlayClick} // Função que fecha o modal ao clicar no overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              // Adiciona um wrapper aqui para garantir que o clique seja no overlay
              className="relative"
              onClick={(e) => e.stopPropagation()} // Impede que o clique na imagem feche o overlay
            >
              <motion.img
                src={src}
                alt={alt}
                className={`max-w-[90%] max-h-[90vh] object-contain ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'}`}
                onClick={handleZoomedImageClick} // Para o clique de zoom
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { type: 'spring', ...springConfig } }}
                exit={{ scale: 0.5, opacity: 0 }}
                style={{ x: xSpring, y: ySpring, scale: scaleSpring }}
                drag={isZoomed}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.4}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </motion.div>
          </div>
        </motion.div>
        
        )}
      </AnimatePresence>
    </>
  );
}

export default ImageZoom;