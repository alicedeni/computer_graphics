import React, { useState } from 'react';
import { getSortedColorsByHue } from '../utils/colorUtils'; 
import ImagePreview from '../components/ImagePreview';
import ColorGradientSlider from '../components/ColorGradientSlider'; 
import FileGenerator from '../components/FileGenerator';

const MainPage = () => {
    const [images, setImages] = useState([]);
    const [sortedImages, setSortedImages] = useState([]);
    const [sortType, setSortType] = useState('spectrum');
    const [selectedColor, setSelectedColor] = useState('rgb(255,0,0)'); 
    const [topN, setTopN] = useState(5);
    const [imageSize, setImageSize] = useState(100);
    const [includeBackgroundColor, setIncludeBackgroundColor] = useState(false);

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
    
        if (files.length + images.length > 50) {
            alert("You can upload no more than 50 images.");
            return;
        }
    
        const imageURLs = files.map(file => URL.createObjectURL(file));
    
        const colorsWithImages = await Promise.all(
            imageURLs.map(async (url) => {
                const { rgb, hue } = await getSortedColorsByHue(url); 
                return { url, rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, hue };
            })
        );
    
        setImages(prevImages => [...prevImages, ...colorsWithImages]);
        setSortedImages(prevImages => [...prevImages, ...colorsWithImages]);
    };

    const sortImages = () => {
        let sorted;
        if (sortType === 'spectrum') {
            sorted = [...images].sort((a, b) => a.hue - b.hue);
        } else if (sortType === 'topN') {
            sorted = getClosestColors(selectedColor);
        }
        setSortedImages(sorted);
    };

    const getClosestColors = (selectedRgb) => {
        return images
            .map(image => {
                const rgbValues = image.rgb.match(/\d+/g).map(Number); 
                const distance = calculateColorDistance(rgbValues, selectedRgb.match(/\d+/g).map(Number));
                return { ...image, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, topN);
    };

    const calculateColorDistance = (color1, color2) => {
        return Math.sqrt(
            Math.pow(color1[0] - color2[0], 2) +
            Math.pow(color1[1] - color2[1], 2) +
            Math.pow(color1[2] - color2[2], 2)
        );
    };

    return (
        <div className="main-container">
            <div className="header">
                <h1>Image Color Sorter</h1>
            </div>
            <label htmlFor="file-upload" style={{ cursor: 'pointer'}}>
                <input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }}
                    disabled={images.length >= 50}
                />
                <div className="upload">
                    <img src={require('../assets/add.png')} alt="Upload" style={{ width: '24px', marginRight: '10px' }} />
                    Upload Images
                </div>
                <p style={{ marginTop: '10px', color: '#555' }}>
                    {images.length > 0 ? `${images.length} file(s) uploaded` : "No files uploaded yet."}
                </p>
            </label>

            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <label>
                    Sort by:
                    <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                        <option value="spectrum">Spectrum</option>
                        <option value="topN">Top N Color</option>
                    </select>
                </label>

                {sortType === 'topN' && (
                    <>
                        <label>
                            Top N:
                            <input
                                type="number"
                                value={topN}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || (parseInt(value) > 0 && !isNaN(value))) {
                                        setTopN(value);
                                    }
                                }}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                        e.preventDefault();
                                    }
                                }}
                                min="1"
                            />
                        </label>
                        <ColorGradientSlider onColorSelect={setSelectedColor} />
                    </>
                )}

                <button onClick={sortImages}>Sort Images</button>

                <div>
                    <label>
                        Image Size (px):
                        <input 
                            type="number" 
                            value={imageSize} 
                            onChange={(e) => {
                                const value = Math.min(500, e.target.value); 
                                setImageSize(value);
                            }} 
                            max="500" 
                        />
                    </label>
                </div>

                <div>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={includeBackgroundColor} 
                            onChange={() => setIncludeBackgroundColor(!includeBackgroundColor)} 
                        />
                         Include Background Color
                    </label>
                </div>

                <div className="file-download-section">
                    <h2 className="settings-header">Download Your Files</h2>
                    <p>Click the button below to generate and download your sorted images.</p>
                    <FileGenerator images={sortedImages} includeBackgroundColor={includeBackgroundColor} imageSize={imageSize} />
                </div>
            </div>

            <ImagePreview images={sortedImages} imageSize={imageSize} includeBackgroundColor={includeBackgroundColor} />
        </div>
    );
};

export default MainPage;