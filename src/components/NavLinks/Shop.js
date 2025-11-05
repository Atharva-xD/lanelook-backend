import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Shop.css';
import Footer from '../Footer';
import ProductDetails from './ProductDetails';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [mode, setMode] = useState('page');
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [after, setAfter] = useState(null);
  const [before, setBefore] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchProducts = useCallback(async () => {
    try {
      const params = {
        mode,
        limit,
      };
      if (mode === 'page') {
        params.page = page;
      } else {
        if (after) params.after = after;
        if (before) params.before = before;
      }
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (sortBy === 'price-low') {
        params.sortBy = 'price';
        params.sortOrder = 'asc';
      } else if (sortBy === 'price-high') {
        params.sortBy = 'price';
        params.sortOrder = 'desc';
      }

      const response = await axios.get(`${API_URL}/api/products`, { params });
      const list = response.data.data || [];
      setProducts(list);
      setPageInfo(response.data.pageInfo || null);
      // Extract unique categories from products
      const uniqueCategories = [...new Set(list.map(product => product.category))];
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
  }, [API_URL, mode, limit, page, after, before, selectedCategory, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleNext = () => {
    if (mode === 'page') {
      if (pageInfo?.hasNextPage) setPage(p => p + 1);
    } else if (pageInfo?.hasNextPage) {
      setBefore(null);
      setAfter(pageInfo.nextCursor || null);
    }
  };

  const handlePrev = () => {
    if (mode === 'page') {
      if (pageInfo?.hasPrevPage) setPage(p => Math.max(1, p - 1));
    } else if (pageInfo?.hasPrevPage) {
      setAfter(null);
      setBefore(pageInfo.prevCursor || null);
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

  // Filter products based on selected price range (category handled on server)
  const filteredProducts = products.filter(product => {
    // Category filter
    const categoryMatch = true;

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

            {/* Pagination Mode */}
            <div className="filter-section">
              <h4 className="filter-section-title">Pagination Mode</h4>
              <select
                className="sort-select"
                value={mode}
                onChange={(e) => {
                  const nextMode = e.target.value;
                  setMode(nextMode);
                  setPage(1);
                  setAfter(null);
                  setBefore(null);
                }}
              >
                <option value="page">Page</option>
                <option value="cursor">Cursor</option>
              </select>
            </div>

            {/* Page Size */}
            <div className="filter-section">
              <h4 className="filter-section-title">Items per page</h4>
              <select
                className="sort-select"
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value, 10));
                  setPage(1);
                  setAfter(null);
                  setBefore(null);
                }}
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
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
                      src={product.images && product.images.length > 0 ? product.images[0] : product.image}
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

            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button className="pagination-button" onClick={handlePrev} disabled={!pageInfo?.hasPrevPage}>Prev</button>
              {mode === 'page' && (
                <span className="pagination-info">Page {pageInfo?.page || page} of {pageInfo?.totalPages || 1}</span>
              )}
              {mode === 'cursor' && (
                <span className="pagination-info">{pageInfo?.limit || limit} per page</span>
              )}
              <button className="pagination-button" onClick={handleNext} disabled={!pageInfo?.hasNextPage}>Next</button>
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