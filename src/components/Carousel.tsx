import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use o useScroll para rastrear o progresso do scroll horizontal
  const { scrollXProgress } = useScroll({
    container: containerRef,
    target: containerRef,
  });
  
  // Transforme o valor do scroll para criar um efeito parallax suave
  const x = useTransform(scrollXProgress, [0, 1], ['0%', '-100%']);

  return (
    <div 
      ref={containerRef}
      className={`overflow-x-auto scrollbar-hide snap-x snap-mandatory ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
      }}
    >
      <motion.div 
        className="flex gap-4 px-4 py-2 min-w-max wrap"
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.2}
        dragMomentum={true}
      >
        {React.Children.map(children, (child) => (
          <div className="snap-start shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Carousel;