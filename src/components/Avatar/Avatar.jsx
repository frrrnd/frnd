import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Avatar = ({ status = 'available', src = '/api/placeholder/64/64' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isAvailable = status === 'available';
  const statusText = isAvailable ? 'available for work' : 'not available for work';
  const statusColor = isAvailable ? 'bg-green-500' : 'bg-red-500';

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar Image */}
      <img
        src={src}
        alt="User avatar"
        className="w-16 h-16 rounded-full object-cover cursor-pointer"
      />
      
      {/* Status Container */}
      <div className="absolute top-2 right-2 translate-x-1/2">
        <motion.div
          layout
          initial={false}
          animate={{
            width: isHovered ? 'auto' : '10px',
            height: isHovered ? '20px' : '10px',
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut"
          }}
          className={`flex items-center origin-left ${statusColor} rounded-full overflow-hidden`}
        >
          <motion.span
            animate={{
              opacity: isHovered ? 1 : 0
            }}
            transition={{
              duration: 0.1,
              delay: isHovered ? 0.1 : 0
            }}
            className="text-xs text-white px-2 py-0.5 whitespace-nowrap"
          >
            {statusText}
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

export default Avatar;