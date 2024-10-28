import React, { useState } from 'react';

const ColorGradientSlider = ({ onColorSelect }) => {
    const gradientColors = [
        'rgb(255, 0, 0)',    // Red
        'rgb(255, 127, 0)',  // Orange-Red
        'rgb(255, 255, 0)',  // Yellow
        'rgb(127, 255, 0)',  // Yellow-Green
        'rgb(0, 255, 0)',    // Green
        'rgb(0, 255, 127)',  // Cyan-Green
        'rgb(0, 255, 255)',  // Cyan
        'rgb(0, 127, 255)',  // Cyan-Blue
        'rgb(0, 0, 255)',    // Blue
        'rgb(127, 0, 255)',  // Blue-Purple
        'rgb(255, 0, 255)',  // Purple
        'rgb(255, 0, 127)'   // Pink
    ];

    const [sliderValue, setSliderValue] = useState(0);

    const gradientStyle = {
        background: `linear-gradient(to right, ${gradientColors.join(', ')})`,
    };

    const handleSliderChange = (e) => {
        const value = e.target.value;
        setSliderValue(value);

        const selectedColor = gradientColors[value];
        
        onColorSelect(selectedColor); 
    };

    return (
        <div className="color-gradient-slider">
            <input 
                type="range" 
                min="0" 
                max={gradientColors.length - 1} 
                value={sliderValue}
                onChange={handleSliderChange} 
                className="slider"
                style={gradientStyle} 
                step="1"
            />
        </div>
    );
};

export default ColorGradientSlider;