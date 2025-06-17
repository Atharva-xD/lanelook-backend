import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart as addToCartAction } from '../redux/slices/cartSlice';
import { Link } from "react-router-dom";
import { FaTimes, FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

function WishlistOverlay({ close }) {
    const wishlist = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();

    const handleRemoveFromWishlist = (id) => {
        dispatch(removeFromWishlist(id));
    };

    const handleAddToCart = (item) => {
        dispatch(addToCartAction(item));
        dispatch(removeFromWishlist(item._id));
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
                    {wishlist.items.length === 0 ? (
                        <div className="empty-wishlist">
                            <FaHeart className="empty-icon" />
                            <p>Your wishlist is empty</p>
                        </div>
                    ) : (
                        wishlist.items.map((item) => (
                            <div key={item._id} className="wishlist-item">
                                <div className="img col-3 col-md-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="item-details">
                                    <p className="p-title">{item.name}</p>
                                    <p className="p-price">₹{item.price}</p>
                                    <div className="item-actions">
                                        <button 
                                            className="add-to-cart-btn"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            <FaShoppingCart /> Add to Cart
                                        </button>
                                        <button 
                                            className="remove-item"
                                            onClick={() => handleRemoveFromWishlist(item._id)}
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
