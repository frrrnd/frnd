import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Mail.css';

interface MailProps {
  href: string;
  children: string;
  hover: string;
  className?: string;
  speed?: number;
}

const Mail: React.FC<MailProps> = ({ href, children, hover, className = '', speed = 50 }) => {
  const [displayText, setDisplayText] = useState(children);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const getRandomChar = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz@._-0123456789';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  const animateToHover = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const current = displayText;
    const target = hover;
    const finalLength = target.length;
    let iterations = 0;
    const maxIterations = 20;
    
    intervalRef.current = setInterval(() => {
      let result = '';
      
      for (let i = 0; i < finalLength; i++) {
        const targetChar = target[i];
        const revealPoint = (i / finalLength) * maxIterations;
        
        if (iterations > revealPoint + 10) {
          result += targetChar;
        } else if (iterations > revealPoint) {
          result += Math.random() > 0.3 ? getRandomChar() : targetChar;
        } else {
          result += current[i] || getRandomChar();
        }
      }
      
      setDisplayText(result);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setDisplayText(target);
      }
    }, speed);
  }, [displayText, hover, speed]);

  const animateToOriginal = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const current = displayText;
    const target = children;
    let iterations = 0;
    const maxIterations = 25;
    
    intervalRef.current = setInterval(() => {
      let result = '';
      
      // Processa apenas os caracteres necessários
      for (let i = 0; i < current.length; i++) {
        const targetChar = target[i] || '';
        const currentChar = current[i] || '';
        
        if (i < target.length) {
          // Posições que existem no texto final
          const revealPoint = (i / target.length) * maxIterations * 0.6;
          
          if (iterations > revealPoint + 8) {
            result += targetChar;
          } else if (iterations > revealPoint) {
            result += Math.random() > 0.4 ? getRandomChar() : targetChar;
          } else {
            result += currentChar;
          }
        } else {
          // Caracteres extras que devem desaparecer
          const disappearPoint = maxIterations * 0.3;
          
          if (iterations > disappearPoint + (i - target.length) * 2) {
            // Não adiciona nada (caractere some)
          } else if (iterations > disappearPoint) {
            result += Math.random() > 0.6 ? getRandomChar() : '';
          } else {
            result += currentChar;
          }
        }
      }
      
      setDisplayText(result);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setDisplayText(target);
      }
    }, speed);
  }, [displayText, children, speed]);

  const handleMouseEnter = useCallback(() => {
    animateToHover();
  }, [animateToHover]);

  const handleMouseLeave = useCallback(() => {
    animateToOriginal();
  }, [animateToOriginal]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <motion.a
      href={href}
      className={`mail-component ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        transition: { duration: 0.1 }
      }}
    >
      <span className="mail-text">
        {displayText}
      </span>
    </motion.a>
  );
};

export default Mail;