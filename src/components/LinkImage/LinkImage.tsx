import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FC } from 'react';

interface LinkWithPreviewProps {
  href: string;
  text: string;
  images: string[];
}

const LinkWithPreview: FC<LinkWithPreviewProps> = ({ href, text, images }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, [images]);

  const OFFSET = 60;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const getAnimationConfig = (index: number) => ({
    initial: { 
      opacity: 0, 
      scale: 0.8,
      x: (mousePosition?.x || 0) - (index * 15),
      y: (mousePosition?.y || 0) + (index * OFFSET)
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      x: (mousePosition?.x || 0) - (index * 15),
      y: (mousePosition?.y || 0) + (index * OFFSET)
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      x: (mousePosition?.x || 0) - (index * 15),
      y: (mousePosition?.y || 0) + (index * OFFSET)
    },
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      delay: index * 0.1 
    }
  });

  return (
    <span className="relative inline-block">
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
          <div className="absolute z-50" style={{ 
            // perspective: '1000px',
            // transformStyle: 'preserve-3d'
          }}>
            {images.slice().reverse().map((imageUrl, index) => {
              const reverseIndex = images.length - 1 - index;
              return (
                <motion.div
                  key={imageUrl}
                  className="absolute pointer-events-none"
                  {...getAnimationConfig(reverseIndex)}
                >
                  <div 
                    className="w-48 h-32 rounded-lg shadow-lg overflow-hidden bg-transparent"
                    style={{
                      transform: `translateY(${-reverseIndex * OFFSET}px) translateX(${-reverseIndex * 15}px)`,
                      zIndex: reverseIndex
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Preview ${reverseIndex + 1}`}
                      className="w-full h-full object-cover"
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
