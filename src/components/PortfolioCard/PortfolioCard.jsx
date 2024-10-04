import React from 'react';
import { motion, useTransform } from 'framer-motion';
import './PortfolioCard.css';

const PortfolioCard = ({src, title, slug}) => {
    const image = {
        variantA: {
            opacity: 1
            },

        variantB: {
            opacity: 0.7
        }
    };

    return(
        <article className="portfolio-card">
            <a href={`/works/${slug}`} title={`View ${title}`}>
                <figure>
                    <motion.img src={src} alt={title} variants={image} initial="variantA" whileHover="variantB" loading="lazy" />
                </figure>

                <div className="portfolio-card__footer">
                    <h3>{title}</h3>
                    <p>View project</p>
                </div>
            </a>
        </article>
    );
};

export default PortfolioCard;