import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FC } from 'react';
import './LinkImage.css';

interface LinkWithPreviewProps {
  href: string;
  text: string;
  images: string[];
}

const LinkWithPreview: FC<LinkWithPreviewProps> = ({ href, text, images }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  
  // Configurações de posicionamento
  const X_OFFSET = 25;  // Espaçamento horizontal entre imagens
  const Y_OFFSET = 80;  // Espaçamento vertical entre imagens
  const BASE_ROTATION = -10; // Rotação base
  const ROTATION_STEP = 8;   // Incremento de rotação por imagem
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const getAnimationConfig = (index: number) => {
    // Calcula rotação alternada para cada imagem
    const rotation = BASE_ROTATION + (index % 2 === 0 ? 1 : -1) * (ROTATION_STEP * index);
    
    return {
      initial: {
        opacity: 0,
        scale: 0.8,
        rotate: rotation,
        x: (mousePosition?.x || 0) - (index * X_OFFSET),
        y: (mousePosition?.y || 0) + (index * Y_OFFSET)
      },
      animate: {
        opacity: 1,
        scale: 1,
        rotate: rotation,
        x: (mousePosition?.x || 0) - (index * X_OFFSET),
        y: (mousePosition?.y || 0) + (index * Y_OFFSET)
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        rotate: rotation,
        x: (mousePosition?.x || 0) - (index * X_OFFSET),
        y: (mousePosition?.y || 0) + (index * Y_OFFSET)
      },
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        delay: index * 0.1
      }
    };
  };
  
  return (
    <span className="link-preview-container">
      <a
        href={href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePosition(null);
        }}
        onMouseMove={handleMouseMove}
      >
        {text}
      </a>
     
      <AnimatePresence>
        {isHovered && mousePosition && (
          <div className="preview-wrapper" style={{
            // perspective: '1000px',
            // transformStyle: 'preserve-3d'
          }}>
            {images.slice().reverse().map((imageUrl, index) => {
              const reverseIndex = images.length - 1 - index;
              return (
                <motion.div
                  key={imageUrl}
                  className="preview-motion-container"
                  {...getAnimationConfig(reverseIndex)}
                >
                  <div
                    className="preview-image-container"
                    style={{
                      transform: `translateY(${-reverseIndex * Y_OFFSET}px) translateX(${-reverseIndex * X_OFFSET}px)`,
                      zIndex: reverseIndex
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Preview ${reverseIndex + 1}`}
                      className="preview-image"
                      style={{ imageRendering: 'high-quality' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default LinkWithPreview;