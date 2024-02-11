import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../styles/AuctionCard.css';

const AuctionCard = ({ images, name, price, description }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="auction-card">
            <div className="image-container">
                {images.length > 1 && (
                    <FaArrowLeft
                        className="arrow-left"
                        onClick={goToPreviousImage}
                    />
                )}
                <img
                    src={images[currentImageIndex]}
                    alt={name}
                    className="auction-image"
                />
                {images.length > 1 && (
                    <FaArrowRight
                        className="arrow-right"
                        onClick={goToNextImage}
                    />
                )}
            </div>
            <h3 className="auction-name">{name}</h3>
            <p className="auction-price">{price}</p>
            <p className="auction-description">{description}</p>
        </div>
    );
};

export default AuctionCard;
