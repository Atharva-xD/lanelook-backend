import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Shop.css';
import Footer from '../Footer';
import ProductDetails from './ProductDetails';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      // Extract unique categories from products
      const uniqueCategories = [...new Set(response.data.map(product => product.category))];
      setCategories([
        { id: "all", name: "All Products" },
        ...uniqueCategories.map(cat => ({
          id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1)
        }))
      ]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    setAddedToCart(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    navigate('/cart');
  };

  // Price ranges for filtering
  const priceRanges = [
    { id: "all", name: "All Prices" },
    { id: "under8000", name: "Under ₹8000" },
    { id: "8000to12000", name: "₹8000 - ₹12000" },
    { id: "over12000", name: "Over ₹12000" }
  ];

  // Filter products based on selected category and price range
  const filteredProducts = products.filter(product => {
    // Category filter
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;

    // Price filter
    let priceMatch = true;
    if (selectedPriceRange === "under8000") {
      priceMatch = product.price < 8000;
    } else if (selectedPriceRange === "8000to12000") {
      priceMatch = product.price >= 8000 && product.price <= 12000;
    } else if (selectedPriceRange === "over12000") {
      priceMatch = product.price > 12000;
    }

    return categoryMatch && priceMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    }
    return 0;
  });

  // Render stars for ratings
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
    <>
      <div className="shop-container container">
        <div className="shop-content clearfix">
          {/* Filter Sidebar */}
          <div className="filter-sidebar">
            <h3 className="filter-title">Filter Products</h3>

            {/* Category Filter */}
            <div className="filter-section">
              <h4 className="filter-section-title">Categories</h4>
              <ul className="filter-list">
                {categories.map(category => (
                  <li key={category.id} className="filter-option">
                    <a href='#shopping-products'>
                      <button
                        className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range Filter */}
            <div className="filter-section">
              <h4 className="filter-section-title">Price Range</h4>
              <ul className="filter-list">
                {priceRanges.map(range => (
                  <li key={range.id} className="filter-option">
                    <a href='#shopping-products'>
                      <button
                        className={`filter-button ${selectedPriceRange === range.id ? 'active' : ''}`}
                        onClick={() => setSelectedPriceRange(range.id)}
                      >
                        {range.name}
                      </button>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort Options */}
            <div className="filter-section">
              <h4 className="filter-section-title">Sort By</h4>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Container */}
          <div className="products-container" id='shopping-products'>
            <div className="products-grid">
              {sortedProducts.map(product => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.03 }}
                  className="product-card"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      <div className="stars-container">
                        {renderRatingStars(4.5)}
                      </div>
                      <span className="rating-text">(4.5)</span>
                    </div>
                    <div className="product-footer">
                      <span className="product-price">₹{product.price}</span>
                      <button 
                        className={`custom-add-to-cart-btn${addedToCart[product._id] ? ' added' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (addedToCart[product._id]) {
                            handleViewCart(e);
                          } else {
                            handleAddToCart(product);
                          }
                        }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={addedToCart[product._id] ? 'view-cart' : 'add-to-cart'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {addedToCart[product._id] ? 'View Cart' : 'Add to Cart'}
                          </motion.span>
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty state */}
            {sortedProducts.length === 0 && (
              <div className="empty-state">
                <p className="empty-text">No products match your filter criteria.</p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedPriceRange("all");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Product Details Modal */}
            {selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={handleAddToCart}
              />
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Shop;