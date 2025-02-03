import React, { useState } from 'react';
import "./Share.css";

const Share = ({slug}) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [isClicked, setIsClicked] = useState(false);

    const copyToClipBoard = async copyMe => {
        try {
            await navigator.clipboard.writeText(copyMe);
            setCopySuccess('copied!');
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
        
        setIsClicked(true);
        const htmlElement = document.documentElement;
        htmlElement.classList.add('share-active');

        setTimeout(() => {
            htmlElement.classList.remove('share-active');
            setIsClicked(false);
        }, 1000);
    };

    return (
        <a 
            className={`share ${isClicked ? 'clicked' : ''}`} 
            href="#!" 
            onClick={(e) => { 
                e.preventDefault();
                copyToClipBoard(`${slug}`);
            }
        }
        >
            {copySuccess ? 'Link copied!' : 'Share'}
        </a>
    )
};

export default Share;