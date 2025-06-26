import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist, fetchWishlist, clearWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';

function WishlistOverlay({ close }) {
    const wishlist = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Check authentication and redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            dispatch(clearWishlist());
            close();
            navigate('/signin');
        }
    }, [isAuthenticated, dispatch, navigate, close]);

    // Fetch wishlist on component mount (only if authenticated)
    useEffect(() => {
        if (isAuthenticated()) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    // Don't render if not authenticated
    if (!isAuthenticated()) {
        return null;
    }

    const handleRemoveFromWishlist = (productId) => {
        dispatch(removeFromWishlist(productId));
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart({ productId: item.product._id, quantity: 1 }));
        dispatch(removeFromWishlist(item.product._id));
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="wishlist-overlay"
        >
            <div className="container">
                <div className="wishlist-header">
                    <h1>My Wishlist</h1>
                    <FaTimes
                        className="cancel-icon"
                        onClick={close}
                    />
                </div>
                <div className="wishlist-item-container">
                    {wishlist.loading ? (
                        <div className="loading-wishlist">
                            <p>Loading wishlist...</p>
                        </div>
                    ) : wishlist.items.length === 0 ? (
                        <div className="empty-wishlist">
                            <FaHeart className="empty-icon" />
                            <p>Your wishlist is empty</p>
                        </div>
                    ) : (
                        wishlist.items.map((item) => (
                            <div key={item.product._id} className="wishlist-item">
                                <div className="img col-3 col-md-4">
                                    <img
                                        src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : item.product.image}
                                        alt={item.product.name}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="item-details">
                                    <p className="p-title">{item.product.name}</p>
                                    <p className="p-price">₹{item.product.price}</p>
                                    <div className="item-actions">
                                        <button 
                                            className="add-to-cart-btn"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            <FaShoppingCart /> Add to Cart
                                        </button>
                                        <button 
                                            className="remove-item"
                                            onClick={() => handleRemoveFromWishlist(item.product._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="wishlist-footer">
                    <div className="wishlist-summary">
                        <div className="summary-row">
                            <span>Total Items:</span>
                            <span>{wishlist.items.length}</span>
                        </div>
                    </div>
                    <div className="btns">
                        <Link to="/shop" className="btn btn-primary" onClick={close}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default WishlistOverlay;
