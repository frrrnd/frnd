import React, { useState } from 'react';
import "./CopyClipboard.css";

const CopyClipboard = () => {
    const [copySuccess, setCopySuccess] = useState('');
    const [isClicked, setIsClicked] = useState(false);

    const copyToClipBoard = async copyMe => {
        try {
            await navigator.clipboard.writeText(copyMe);
            setCopySuccess('Copied!');
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
        
        setIsClicked(true);
        const htmlElement = document.documentElement;
        htmlElement.classList.add('clipboard-active');

        setTimeout(() => {
            htmlElement.classList.remove('clipboard-active');
            setIsClicked(false);
        }, 1000);
    };

    return (
        <a 
            className={`clipboard ${isClicked ? 'clicked' : ''}`} 
            href="#!" 
            onClick={(e) => { 
                e.preventDefault();
                copyToClipBoard('dotfernando@gmail.com')}}
        >
            {copySuccess ? 'email copied!' : 'copy email'}
        </a>
    )
};

export default CopyClipboard;