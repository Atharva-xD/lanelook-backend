import React from 'react';
import { Star } from 'lucide-react';
import { Link } from "react-router-dom";
import './ProductDetails.css';
import { FaTimes, FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';

const ProductDetails = ({ product, onClose, onAddToCart }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const isInWishlist = wishlist.items.some(item => item._id === product._id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

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

  if (!product) return null;

  return (
    <div className="product-details-overlay" onClick={onClose}>
      <div className="product-details-content" onClick={e => e.stopPropagation()}>
        <div className="product-details-container">
          <div className="product-details-header">
            <h2 className="product-details-name">{product.name}</h2>
            <FaTimes
              className="product-details-cancel-icon"
              onClick={onClose}
              style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#333' }}
            />
          </div>
          <div className="product-details-body">
            <div className="product-details-image-container">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-details-info">
              <div className="product-details-rating">
                <div className="product-details-stars">
                  {renderRatingStars(4.5)}
                </div>
                <span className="product-details-rating-text">(4.5)</span>
              </div>
              <p className="product-details-price">₹{product.price}</p>
              <p className="product-details-category">Category: {product.category}</p>
              <p className="product-details-description">{product.description}</p>
              
              <div className="product-details-specifications">
                <h3>Product Specifications</h3>
                <div className="product-details-specs-grid">
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Product ID:</span>
                    <span className="product-details-spec-value">{product.productId}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Frame Style:</span>
                    <span className="product-details-spec-value">{product.frameStyle}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Model No:</span>
                    <span className="product-details-spec-value">{product.modelNo}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Frame Width:</span>
                    <span className="product-details-spec-value">{product.frameWidth}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Frame Dimensions:</span>
                    <span className="product-details-spec-value">{product.frameDimensions}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Frame Colour:</span>
                    <span className="product-details-spec-value">{product.frameColour}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Weight:</span>
                    <span className="product-details-spec-value">{product.weight}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Weight Group:</span>
                    <span className="product-details-spec-value">{product.weightGroup}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Material:</span>
                    <span className="product-details-spec-value">{product.material}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Frame Material:</span>
                    <span className="product-details-spec-value">{product.frameMaterial}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Temple Material:</span>
                    <span className="product-details-spec-value">{product.templeMaterial}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Prescription Type:</span>
                    <span className="product-details-spec-value">{product.prescriptionType}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Vision Type:</span>
                    <span className="product-details-spec-value">{product.visionType}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Frame Style Secondary:</span>
                    <span className="product-details-spec-value">{product.frameStyleSecondary}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Collection:</span>
                    <span className="product-details-spec-value">{product.collection}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Warranty:</span>
                    <span className="product-details-spec-value">{product.warranty}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Gender:</span>
                    <span className="product-details-spec-value">{product.gender}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Height:</span>
                    <span className="product-details-spec-value">{product.height}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Condition:</span>
                    <span className="product-details-spec-value">{product.condition}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Temple Colour:</span>
                    <span className="product-details-spec-value">{product.templeColour}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Brand Name:</span>
                    <span className="product-details-spec-value">{product.brandName}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Product Type:</span>
                    <span className="product-details-spec-value">{product.productType}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Frame Type:</span>
                    <span className="product-details-spec-value">{product.frameType}</span>
                  </div>
                  <div className="product-details-spec-item">
                    <span className="product-details-spec-label">Frame Shape:</span>
                    <span className="product-details-spec-value">{product.frameShape}</span>
                  </div>
                </div>
              </div>

              <div className="product-details-actions">
                <button 
                  className="product-details-add-to-cart"
                  onClick={() => onAddToCart(product)}
                >
                  Add to Cart
                </button>
                <button 
                  className={`product-details-wishlist ${isInWishlist ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                >
                  {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
                <Link 
                  to="/book" 
                  className="product-details-book-slot"
                  state={{ productInfo: {
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    productId: product.productId
                  }}}
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;