import ColorThief from 'color-thief-browser';

const rgbToHue = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return h * 360;
};

export const getDominantColors = (imageSrc, numColors = 10) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageSrc;
        img.crossOrigin = "Anonymous";

        img.onload = () => {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, numColors); 
            resolve(palette);
        };
    });
};

const calculateWeightedAverageColor = (palette) => {
    const totalColors = palette.length;
    const colorSum = palette.reduce((acc, color) => {
        acc[0] += color[0]; // R
        acc[1] += color[1]; // G
        acc[2] += color[2]; // B
        return acc;
    }, [0, 0, 0]);

    return colorSum.map(value => Math.round(value / totalColors));
};

export const getProminentColorFromPalette = (palette) => {
    const weightedColor = calculateWeightedAverageColor(palette);
    return weightedColor; 
};

export const getSortedColorsByHue = async (imageSrc, numColors = 10) => {
    const palette = await getDominantColors(imageSrc, numColors);
    
    const prominentColorRGB = getProminentColorFromPalette(palette);
    
    const prominentColorHue = rgbToHue(prominentColorRGB[0], prominentColorRGB[1], prominentColorRGB[2]);

    return { rgb: prominentColorRGB, hue: prominentColorHue };
};