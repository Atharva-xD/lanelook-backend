import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import "./Header.css";
import glasses1 from "../images/glasses1.jpg";
import glasses2 from "../images/glasses2.jpg";
import glasses3 from "../images/glasses3.jpg";
import glasses4 from "../images/glasses4.jpg";
import { Eye } from "lucide-react";

export class Header extends Component {
  // Animation variants for staggered product cards
  containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Product data for easier maintenance
  products = [
    { id: 1, image: glasses1, alt: "glasses1", title: "Eyeglasses" },
    { id: 2, image: glasses2, alt: "glasses2", title: "Sunglasses" },
    { id: 3, image: glasses3, alt: "glasses3", title: "Screen Glasses" },
    { id: 4, image: glasses4, alt: "glasses4", title: "Power Sunglasses" }
  ];

  render() {
    return (
      <div className='container'>
        {/* --- Best Sellers Header --- */}
        <motion.div 
          className='header-section'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className='header-content'>
            <div className="header-label">
              <Eye size={16} color="#9c5820" />
              <span>Best Sellers</span>
            </div>
            <h2 className="header-title">
              Explore Customer Favorites <br /> in Every Style
            </h2>
          </div>
          <div>
            <Link to="/shop" className="view-all-btn">
              View All <span>➔</span>
            </Link>
          </div>
        </motion.div>

        {/* --- Product Type Cards --- */}
        <motion.div 
          className='products-grid'
          variants={this.containerVariants}
          initial="hidden"
          animate="visible"
        >
          {this.products.map((product) => (
            <motion.div 
              key={product.id}
              className='glasses'
              variants={this.cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/shop">
                <img 
                  src={product.image} 
                  alt={product.alt} 
                  loading="lazy"
                />
                <h5>{product.title}</h5>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }
}

export default Header;