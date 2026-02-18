import React, { useState } from 'react';

interface AnimationButtonProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'primary' | 'stop';
}

const AnimationButton: React.FC<AnimationButtonProps> = ({
  name,
  isActive,
  onClick,
  variant = 'primary',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getBackgroundColor = () => {
    if (variant === 'stop') {
      return isHovered ? '#da190b' : '#f44336';
    }
    if (isActive) {
      return '#2196F3';
    }
    return isHovered ? '#45a049' : '#4CAF50';
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: getBackgroundColor(),
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
      }}
    >
      {name}
    </button>
  );
};

export default AnimationButton;