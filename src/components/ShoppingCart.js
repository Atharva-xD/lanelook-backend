import React from 'react';
import glasses1 from "../images/glasses1.jpg";
import './ShoppingCart.css';
import "../index.css";

function ShoppingCart() {
  return (
    <div className="shopping-cart-container">
      <h2 className="shopping-cart-title">Shopping Cart</h2>
      <div className="cart-items">
        <div className="cart-item">
          <img src={glasses1} alt="item 1" className="item-image" />
          <div className="item-details">
            <p className="item-name">Fresh Strawberries</p>
            <p className="item-price">₹36.00</p>
          </div>
          <div className="item-quantity">
            <button>-</button>
            <input type="text" value="1" />
            <button>+</button>
          </div>
          <p className="item-total">₹36.00</p>
        </div>
        {/* Add more cart items similarly */}
      </div>
      <div className="cart-summary">
        <p className="subtotal">CART <span>TOTALS</span></p>
        <div className="shipping-info">
          <p>Shipping:</p>
          <p>There are no shipping methods available. Please double check your address.</p>
        </div>
        <div className="calculate-shipping">
          <p>Calculate Shipping</p>
          <select>
            <option>Select a country...</option>
            {/* Add options */}
          </select>
          <input type="text" placeholder="State / country" />
          <input type="text" placeholder="Postcode / Zip" />
          <button>Update Totals</button>
        </div>
        <div className="total">
          <p>Total: <span>₹79.65</span></p>
        </div>
        <button className="proceed-checkout">Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default ShoppingCart;
