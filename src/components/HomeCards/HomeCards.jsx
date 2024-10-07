import React from 'react';
import { motion } from 'framer-motion';
import './HomeCards.css';

const HomeCards = () => {
    const image = {
        variantA: {
            scale: 1.1
            },
        
        variantB: {
            scale: 1.2
        }
    };

    return(
        <div className="home-cards__wrapper">
            <ul>
                <li>
                    <a href="/works/cloudbox" title="Cloudbox">
                        <figure>
                            <motion.img src="/uploads/images/home-ui.webp" alt="Dashboard UI" variants={image} initial="variantA" whileHover="variantB" />
                        </figure>
                    </a>
                </li>

                <li>
                    <a href="/works/feed" title="View">
                        <figure>
                            <motion.img src="/uploads/images/home-ios-player.webp" alt="iOS Dock Player" variants={image} initial="variantA" whileHover="variantB" />
                        </figure>
                    </a>
                </li>

                <li>
                    <a href="/works/trackr" title="View">
                        <figure>
                            <motion.img src="/uploads/images/home-watch.webp" alt="WatchOS App" variants={image} initial="variantA" whileHover="variantB" />
                        </figure>
                    </a>
                </li>

                <li>
                    <a href="/works/feed" title="View">
                        <figure>
                            <motion.img src="/uploads/images/home-os-dock.webp" alt="Arc Icon Mac OS" variants={image} initial="variantA" whileHover="variantB" />
                        </figure>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default HomeCards;