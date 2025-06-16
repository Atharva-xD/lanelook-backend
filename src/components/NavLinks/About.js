import React from "react";
import "./About.css";
import { Link } from "react-router-dom";
import manImage from "./images/pfp.avif";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

// Define animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 }, // Start off-screen
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.3, // Stagger children animations
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0, scale: 0.8 }, // Start hidden and scaled down
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }, // Fade in and scale up
};

export default function EyewearCommitment() {
  return (
    <div className="eyewear-wrapper container">
      <motion.div
        className="eyewear-grid"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
      >
        <div className="eyewear-image-section">
          <img src={manImage} alt="New Collection" />
          <motion.div
            className="eyewear-overlay"
            initial="hidden"
            whileInView="visible"
            variants={overlayVariants}
          >
            <h2>New Collection</h2>
            <p>Explore our newest arrivals featuring cutting-edge designs and unmatched comfort.</p>
            <Link to="/shop"><button>Shop Now!</button></Link>
          </motion.div>
        </div>

        <div className="eyewear-text-section">
          <span className="eyewear-label">👁️ ABOUT US</span>
          <h1>Our Commitment to <br />Quality Eyewear</h1>
          <p>
            Our eyewear collection offers a blend of style and comfort for every occasion.
            Discover frames that enhance your features and lenses that provide clarity.
          </p>


          <motion.div className="eyewear-point" variants={containerVariants}>
            <CheckCircle className="check-icon" />
            <div>
              <strong>Vision Clarity</strong>
              <p>Our lenses are crafted to provide maximum clarity and reduce strain for all-day wear.</p>
            </div>
          </motion.div>

          <motion.div className="eyewear-point" variants={containerVariants}>
            <CheckCircle className="check-icon" />
            <div>
              <strong>Fashion and Style</strong>
              <p>From sleek minimalism to bold statements, find frames that match your personal vibe.</p>
            </div>
          </motion.div>

          <motion.div className="eyewear-point" variants={containerVariants}>
            <CheckCircle className="check-icon" />
            <div>
              <strong>Quality and Durability</strong>
              <p>Built with premium materials, our eyewear is designed to withstand daily wear and last longer.</p>
            </div>
          </motion.div>

        </div>
      </motion.div>

      <div className="eyewear-brands">
        <h3>Over <span>92+</span> Eyewear Brand</h3>
        {/* <div className="brand-logos">
          <img src="/path-to/brand1.png" alt="brand" />
          <img src="/path-to/brand2.png" alt="brand" />
          <img src="/path-to/brand3.png" alt="brand" />
          <img src="/path-to/brand4.png" alt="brand" />
          <img src="/path-to/brand5.png" alt="brand" />
        </div> */}
      </div>
    </div>
  );
}
