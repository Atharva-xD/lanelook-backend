import React from 'react';
import "../index.css";
import { Link } from "react-router-dom";
import glasses1 from "../images/glasses1.jpg";
import glasses2 from "../images/glasses2.jpg";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

function CartOverlay({close}) {
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
          <div className="row">
            <div className="cart-items">
              <div className="img col-3 col-md-4">
                <img
                  src={glasses1}
                  alt="glasses1"
                  className="img-fluid"
                />
              </div>
              <div className="item-details">
                <p className="p-title">Eyeglasses</p>
                <p className="p-price">1 x ₹850</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="cart-items">
              <div className="img col-3 col-md-4">
                <img
                  src={glasses2}
                  alt="glasses2"
                  className="img-fluid"
                />
              </div>
              <div className="item-details">
                <p className="p-title">Eyeglasses</p>
                <p className="p-price">1 x ₹850</p>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-footer">
          <div className="btns">
            <button className="btn btn-primary">Checkout</button>
            <button className="btn btn-secondary">
              <Link
                to="/cart"
                className="text-decoration-none text-white"
                onClick={close}
              >
                View Cart
              </Link>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CartOverlay;
