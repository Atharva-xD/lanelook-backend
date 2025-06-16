import React from 'react';
import { Star } from 'lucide-react';
import { Link } from "react-router-dom";
import './ProductDetails.css';
import { FaTimes } from "react-icons/fa";

const ProductDetails = ({ product, onClose }) => {
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="text-yellow-500 fill-yellow-500" size={16} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="text-yellow-500 fill-yellow-500" size={16} />);
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={16} />);
      }
    }
    return stars;
  };

  return (
    <div className="product-details-modal">
      <div className="product-details-content">
        <div className="product-details-header">
          <h2 className="product-name">{product.name}</h2>
          <FaTimes
            className="cancel-icon"
            onClick={onClose}
            style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#333' }}
          />
        </div>
        <div className="product-details-body">
          <div className="product-details-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-details-info">
            <div className="product-rating">
              <div className="stars-container">
                {renderRatingStars(4.5)}
              </div>
              <span className="rating-text">(4.5)</span>
            </div>
            <p className="product-price">₹{product.price}</p>
            <p className="product-category">Category: {product.category}</p>
            <p className="product-description">{product.description}</p>
            
            <div className="product-specifications">
              <h3>Product Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Product ID:</span>
                  <span className="spec-value">{product.productId}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frame Style:</span>
                  <span className="spec-value">{product.frameStyle}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Model No:</span>
                  <span className="spec-value">{product.modelNo}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frame Width:</span>
                  <span className="spec-value">{product.frameWidth}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frame Dimensions:</span>
                  <span className="spec-value">{product.frameDimensions}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frame Colour:</span>
                  <span className="spec-value">{product.frameColour}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Weight:</span>
                  <span className="spec-value">{product.weight}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Weight Group:</span>
                  <span className="spec-value">{product.weightGroup}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Material:</span>
                  <span className="spec-value">{product.material}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frame Material:</span>
                  <span className="spec-value">{product.frameMaterial}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Temple Material:</span>
                  <span className="spec-value">{product.templeMaterial}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Prescription Type:</span>
                  <span className="spec-value">{product.prescriptionType}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Vision Type:</span>
                  <span className="spec-value">{product.visionType}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frame Style Secondary:</span>
                  <span className="spec-value">{product.frameStyleSecondary}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Collection:</span>
                  <span className="spec-value">{product.collection}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Warranty:</span>
                  <span className="spec-value">{product.warranty}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Gender:</span>
                  <span className="spec-value">{product.gender}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Height:</span>
                  <span className="spec-value">{product.height}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Condition:</span>
                  <span className="spec-value">{product.condition}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Temple Colour:</span>
                  <span className="spec-value">{product.templeColour}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Brand Name:</span>
                  <span className="spec-value">{product.brandName}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Product Type:</span>
                  <span className="spec-value">{product.productType}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frame Type:</span>
                  <span className="spec-value">{product.frameType}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Frame Shape:</span>
                  <span className="spec-value">{product.frameShape}</span>
                </div>
              </div>
            </div>

            <Link to="/book" className="nav-link">
              <button className="book-slot-btn">
                Book Slot
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;