import React, { useState } from 'react';
import { motion } from 'framer-motion';
import "./WorkPreview.css";

interface ViewportLinkProps {
  href: string;
  title: string;
  image: string;
  children: React.ReactNode;
}

const WorkPreview = ({
  href,  
  image, 
  children 
}: ViewportLinkProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <a 
        href={href} 
        className="block"
      >
        {children}
      </a>

      {isHovering && (
        <div 
          className="fixed pointer-events-none z-10"
          style={{
            left: mousePosition.x + 20,  // Offset 20px to the right
            top: mousePosition.y + 20,   // Offset 20px down
          }}
        >
          <motion.img
            src={image}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
            className="motion-image h-auto shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default WorkPreview;