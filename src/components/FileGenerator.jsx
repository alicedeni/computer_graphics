import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FileGenerator = ({ images, includeBackgroundColor, imageSize }) => {
    const generateHTML = async () => {
        const base64Images = await Promise.all(images.map(async (image) => {
            const response = await fetch(image.url);
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        }));
    
        const imageWidth = `${imageSize}px`;
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sorted Images</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        outline: 0;
                        scroll-behavior: smooth;
                        box-sizing: border-box;
                    }
                    body {
                        background: rgb(248, 238, 255);
                        padding: 20px 0px;
                    }
                    .main-container {
                        max-width: 800px;
                        margin: auto;
                        padding: 20px;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }
                    h1 { 
                        text-align: center; 
                    }
                    .image-preview {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    
                    .image-container {
                        margin: 10px;
                        width: ${imageWidth}; /* Set width based on imageSize */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    img { 
                        width: 100%; 
                        height: auto; 
                        border-radius: 5px; /* Same border radius */
                    }
                </style>
            </head>
            <body>
                <div class="main-container">
                    <h1>Sorted Images</h1>
                    <div class="image-preview">
                        ${base64Images.map((base64Image, index) => `
                            <div class="image-container" style="${includeBackgroundColor ? `background-color:${images[index].rgb};` : 'background-color: transparent;'}">
                                <img src="${base64Image}" alt="Image ${index + 1}" />
                            </div>
                        `).join('')}
                    </div>
                </div>
            </body>
            </html>
        `;
    
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sorted_images.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const generatePDF = async () => {
        const pdf = new jsPDF();
        const imagePreviewDiv = document.querySelector('.image-preview');
        
        const canvas = await html2canvas(imagePreviewDiv);
        const imgData = canvas.toDataURL('image/png');
    
        const imgWidth = pdf.internal.pageSize.width - 20;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        let positionY = 0;

        if (imgHeight > pageHeight) {
            let remainingHeight = imgHeight;
    
            while (remainingHeight > 0) {
                pdf.addPage();
                const positionYForPage = positionY - (imgHeight - remainingHeight);
                pdf.addImage(imgData, 'PNG', 10, positionYForPage, imgWidth, imgHeight);
                remainingHeight -= pageHeight;
            }
            pdf.deletePage(1); 
        } else {
            pdf.addImage(imgData, 'PNG', 10, positionY, imgWidth, imgHeight);
        }
    
        pdf.save('sorted_images.pdf');
    };

    return (
        <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={generateHTML}>Download HTML</button>
            <button onClick={generatePDF}>Download PDF</button>
        </div>
    );
};

export default FileGenerator;