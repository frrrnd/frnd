import React from 'react';
import { motion, useTransform } from 'framer-motion';

const HomeCards = () => {
    const image = {
        variantA: {
            scale: 1.1
            },
        
        variantB: {
            scale: 1.2
        }
    };

    const list = {
        initial: {},
        rest: {}
    }

    const card = {
        initial: {
            transition: {
                duration: 5,
                ease: "linear"
            }
        },
        rest: {
            rotate: 0,
            margin: "0 10px",
            transition: {
                duration: 0,
                ease: "linear"
            }
        }
    }

    return(
        <div style={{width: "auto"}}>
            <motion.ul initial="initial" whileHover="rest" animate="initial" variants={list}>
                <motion.li initial={{rotate: -3, margin: "0 -10px"}} variants={card}>
                    <a href="#" target="_blank" title="View on Layers">
                        <figure>
                            <motion.img src="/uploads/images/home-ui.png" alt="Dashboard UI" variants={image} initial="variantA" whileHover="variantB" />
                        </figure>
                    </a>
                </motion.li>

                <motion.li initial={{rotate: 3, margin: "0 -10px"}} variants={card}>
                    <a href="https://layers.to/layers/clu9q6ocx0008ji0da6zr97wh" target="_blank" title="View on Layers">
                        <figure>
                            <motion.img src="/uploads/images/home-ios-player.png" alt="iOS Dock Player" variants={image} initial="variantA" whileHover="variantB" />
                        </figure>
                    </a>
                </motion.li>

                <motion.li initial={{rotate: -3, margin: "0 -10px"}} variants={card}>
                    <a href="#" target="_blank" title="View">
                        <figure>
                            <motion.img src="/uploads/images/home-watch.png" alt="WatchOS App" variants={image} initial="variantA" whileHover="variantB" />
                        </figure>
                    </a>
                </motion.li>

                <motion.li initial={{rotate: 3, margin: "0 -10px"}} variants={card}>
                    <a href="https://layers.to/layers/clvkyjnc0003sl40dv0d6m1yt" target="_blank" title="View on Layers">
                        <figure>
                            <motion.img src="/uploads/images/home-os-dock.png" alt="Arc Icon Mac OS" variants={image} initial="variantA" whileHover="variantB" />
                        </figure>
                    </a>
                </motion.li>
            </motion.ul>
        </div>
    );
};

export default HomeCards;