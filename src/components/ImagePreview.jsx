import React from 'react';

const ImagePreview = ({ images, imageSize, includeBackgroundColor }) => {

    return (
        <div className="image-preview">
            {images.map((image, index) => (
                <div key={index} className="image-container" style={{ backgroundColor: includeBackgroundColor ? image.rgb : 'transparent', width: `${imageSize}px`, height: 'auto' }}>
                    <img src={image.url} alt={`Uploaded ${index}`} style={{ width: `${imageSize}px`, height: 'auto' }} />
                </div>
            ))}
        </div>
    );
};

export default ImagePreview;