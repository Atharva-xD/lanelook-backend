import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartItem, clearCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import "../index.css";
import { useAuth } from '../context/AuthContext';

function CartOverlay({ close }) {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      dispatch(clearCart());
      close();
      navigate('/signin');
    }
  }, [isAuthenticated, dispatch, navigate, close]);

  if (!isAuthenticated()) {
    return null;
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="cart-overlay"
    >
      <div className="container">
        <div className="cart-header">
          <h1>My Cart</h1>
          <FaTimes
            className="cancel-icon"
            onClick={close}
          />
        </div>
        <div className="cart-item-container">
          {cart.items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="img col-3 col-md-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="img-fluid"
                  />
                </div>
                <div className="item-details">
                  <p className="p-title">{item.product.name}</p>
                  <p className="p-price">₹{item.product.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}>-</button>
                    <input type="number" value={item.quantity} min="1" onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))} />
                    <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>+</button>
                  </div>
                  <button 
                    className="remove-item"
                    onClick={() => handleRemoveItem(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-summary">
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{cart.items.length}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)}</span>
            </div>
          </div>
          <div className="btns">
            <Link to="/cart" className="btn btn-primary" onClick={close}>
              View Cart
            </Link>
            <Link to="/book" className="btn btn-secondary" onClick={close}>
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CartOverlay;
