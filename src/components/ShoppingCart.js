import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartItem, fetchCart, clearCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import './ShoppingCart.css';
import { useAuth } from '../context/AuthContext';

function ShoppingCart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      dispatch(clearCart());
      navigate('/signin');
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ productId: id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleBookAppointment = () => {
    navigate('/book');
  };

  if (!isAuthenticated()) {
    return <div className="empty-cart">Your cart is empty. Please <a href="/signin">sign in</a> to add products to your cart.</div>;
  }

  return (
    <div className="shopping-cart-container">
      <div className="cart-items">
        <h2 className="shopping-cart-title">Your Cart</h2>
        {cart.items.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          cart.items.map((item) => (
            <div key={item.product._id} className="cart-item">
              <div className="item-image">
                <img src={item.product.image} alt={item.product.name} />
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.product.name}</h3>
                {item.product.duration && <p className="item-duration">Duration: {item.product.duration} mins</p>}
                <p className="item-price">₹{item.product.price}</p>
              </div>
              <div className="item-quantity">
                <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}>-</button>
                <input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
                  min="1"
                />
                <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>+</button>
              </div>
              <div className="item-total">
                <p>₹{item.product.price * item.quantity}</p>
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
      <div className="cart-summary">
        <h3>Appointment Summary</h3>
        <div className="summary-details">
          <div className="summary-row">
            <span>Total Services:</span>
            <span>{cart.items.length}</span>
          </div>
          <div className="summary-row">
            <span>Total Duration:</span>
            <span>{cart.items.reduce((total, item) => total + ((item.product.duration || 0) * item.quantity), 0)} mins</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>₹{cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)}</span>
          </div>
        </div>
        <button 
          className="proceed-checkout"
          onClick={handleBookAppointment}
          disabled={cart.items.length === 0}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
