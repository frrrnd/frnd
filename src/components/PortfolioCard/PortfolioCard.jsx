import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import './PortfolioCard.css';

const PortfolioCard = ({ src, title, slug, description }) => {
  const cardRef = useRef(null);
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calcula o progresso baseado na posição do componente na tela
      const progress = Math.min(
        Math.max(
          0, 
          1 - (rect.top / 2) / windowHeight
        ), 
        1
      );

      scrollProgress.set(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chama ao carregar a página

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollProgress]);

  // Transforma o progresso em escala: de 0.8 até 1
  const scale = useSpring(
    useTransform(scrollProgress, [0, 1], [0.8, 1]),
    { stiffness: 1000, damping: 40 }
  );

  return (
    <motion.article
      ref={cardRef}
      className="portfolio-card"
      style={{ scale }}
    >
      <a href={`/works/${slug}`} title={`View ${title}`}>
        <figure>
          <motion.img
            src={src}
            alt={title}
            loading="lazy"
          />
        </figure>

        <div className="portfolio-card__footer">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </a>
    </motion.article>
  );
};

export default PortfolioCard;