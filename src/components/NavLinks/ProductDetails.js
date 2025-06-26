import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import './ProductDetails.css';
import { FaTimes, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../redux/slices/wishlistSlice';
import { useAuth } from '../../context/AuthContext';
import { addToCart } from '../../redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = ({ product, onClose }) => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist);
  const isInWishlist = wishlist.items.some(item => item.product._id === product._id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Get all images for the product
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : []);

  // Fetch wishlist on component mount
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleWishlistToggle = () => {
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist({ productId: product._id }));
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate('/cart');
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
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
          
          {/* Image Section at Top */}
          <div className="product-details-image-section">
            <div className="product-details-image-container">
              {/* Main Image Display */}
              <div className="product-details-main-image">
                <img 
                  src={productImages[currentImageIndex]} 
                  alt={`${product.name} - ${currentImageIndex + 1}`} 
                />
                
                {/* Navigation Arrows - Only show if multiple images */}
                {productImages.length > 1 && (
                  <>
                    <button 
                      className="product-details-nav-btn product-details-nav-prev"
                      onClick={prevImage}
                    >
                      <FaChevronLeft />
                    </button>
                    <button 
                      className="product-details-nav-btn product-details-nav-next"
                      onClick={nextImage}
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>

              {/* Image Thumbnails - Only show if multiple images */}
              {productImages.length > 1 && (
                <div className="product-details-thumbnails">
                  {productImages.map((image, index) => (
                    <div 
                      key={index}
                      className={`product-details-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => selectImage(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} thumbnail ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Information Section */}
          <div className="product-details-info-section">
            <div className="product-details-basic-info">
              <div className="product-details-rating">
                <div className="product-details-stars">
                  {renderRatingStars(4.5)}
                </div>
                <span className="product-details-rating-text">(4.5)</span>
              </div>
              <p className="product-details-price">₹{product.price}</p>
              <p className="product-details-category">Category: {product.category}</p>
              <p className="product-details-description">{product.description}</p>
            </div>
            
            <div className="product-details-specifications">
              <h3>Product Specifications</h3>
              <div className="product-details-specs-grid">
                <div className="product-details-specs-column">
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
                </div>
                
                <div className="product-details-specs-column">
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
                </div>
                
                <div className="product-details-specs-column">
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
            </div>

            <div className="product-details-actions">
              <button 
                className={`product-details-add-to-cart${isAddedToCart ? ' added' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isAddedToCart) {
                    handleViewCart(e);
                  } else {
                    handleAddToCart();
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isAddedToCart ? 'view-cart' : 'add-to-cart'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isAddedToCart ? 'View Cart' : 'Add to Cart'}
                  </motion.span>
                </AnimatePresence>
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
  );
};

export default ProductDetails;