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

      // Progresso começa quando o topo do card entra na tela (abaixo de 100%)
      // e termina quando o topo do card atinge o centro da tela (50%)
      const start = windowHeight; // Base da viewport
      const end = windowHeight / 2; // Metade da viewport

      // Calcula o progresso com base no topo do card
      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);

      scrollProgress.set(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chama ao carregar a página

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollProgress]);

  // Mapeia o progresso para a escala de 0.8 a 1
  const scale = useSpring(
    useTransform(scrollProgress, [0, 1], [0.9, 1]),
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
