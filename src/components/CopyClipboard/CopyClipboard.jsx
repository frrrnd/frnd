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
        
        // Adiciona a classe 'clicked' ao elemento
        setIsClicked(true);

        // Remove a classe após 2 segundos
        setTimeout(() => {
            setIsClicked(false);
        }, 1000);
    };

    return (
        <a 
            className={`clipboard ${isClicked ? 'clicked' : ''}`} 
            href="#!" 
            onClick={() => copyToClipBoard('dotfernando@gmail.com')}
        >
            {copySuccess ? 'email copied!' : 'copy email'}
        </a>
    )
};

export default CopyClipboard;