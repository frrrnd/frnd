import React, { useState } from 'react';
import './GlossyButton.css';

const GlossyButton = () => {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="btn-container">
      <a
        href="#!"
        className="glossy-btn"
        onMouseMove={handleMouseMove}
        style={{ '--x': buttonPosition.x, '--y': buttonPosition.y }}
      >
        Button!
      </a>
    </div>
  );
};

export default GlossyButton;