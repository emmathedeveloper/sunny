import React from 'react';
import AnimationButton from './AnimationButton';

interface AnimationControlsProps {
  animationNames: string[];
  currentAnimation: string | null;
  onPlayAnimation: (name: string) => void;
  onStopAnimation: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  animationNames,
  currentAnimation,
  onPlayAnimation,
  onStopAnimation,
  position = 'bottom',
}) => {
  const getContainerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      display: 'flex',
      gap: '10px',
      zIndex: 1000,
      flexWrap: 'wrap',
      padding: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '10px',
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          justifyContent: 'center',
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          justifyContent: 'center',
        };
      case 'left':
        return {
          ...baseStyle,
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          flexDirection: 'column',
        };
      case 'right':
        return {
          ...baseStyle,
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          flexDirection: 'column',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={getContainerStyle()}>
      {animationNames.map((name) => (
        <AnimationButton
          key={name}
          name={name}
          isActive={currentAnimation === name}
          onClick={() => onPlayAnimation(name)}
        />
      ))}
      
      {animationNames.length > 0 && (
        <AnimationButton
          name="Stop"
          isActive={false}
          onClick={onStopAnimation}
          variant="stop"
        />
      )}
    </div>
  );
};

export default AnimationControls;