import React, { useState, useEffect, useRef } from 'react';
import "./CopyClipboard.css";

const CopyClipboard = () => {
    const [copySuccess, setCopySuccess] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const textRef = useRef('Copy my email');
    
    // Reset text after animation completes
    useEffect(() => {
        if (isClicked) {
            textRef.current = 'Email copied!';
        } else {
            textRef.current = copySuccess ? 'Email copied!' : 'Copy my email';
        }
    }, [isClicked, copySuccess]);

    const copyToClipBoard = async (copyMe) => {
        try {
            await navigator.clipboard.writeText(copyMe);
            setCopySuccess('copied!');
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
        
        setIsClicked(true);
        const htmlElement = document.documentElement;
        htmlElement.classList.add('clipboard-active');
        
        // Guarantee text update happens after shuffle effect
        setTimeout(() => {
            htmlElement.classList.remove('clipboard-active');
            setIsClicked(false);
        }, 1000);
    };

    // Handle hover events separately from click events
    const handleMouseEnter = () => {
        if (!isClicked) {
            setIsShuffling(true);
        }
    };

    const handleMouseLeave = () => {
        setIsShuffling(false);
    };

    return (
        <div>
            <a
                className={`clipboard ${isClicked ? 'clicked' : ''}`}
                href="#!"
                onClick={(e) => {
                    e.preventDefault();
                    copyToClipBoard('dotfernando@gmail.com');
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {textRef.current}
            </a>
        </div>
    );
};

export default CopyClipboard;