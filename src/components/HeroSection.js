import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LuShoppingBag } from "react-icons/lu";
import { FiSliders } from "react-icons/fi";
import { MdOutlineShield } from "react-icons/md";
import { FiTruck } from "react-icons/fi";
import "./HeroSection.css";
import menwithspecs from "../images/manwithspecs.png"

const textVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" }
    },
};

// Define animation variants
const containerVariants = {
    hidden: { scale: 0 },
    visible: {
        scale: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            staggerChildren: 0.3, // Stagger the children animations
        },
    },
};
const itemVariants = {
    hidden: { x: -50, opacity: 0 }, // Start from the left
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }, // Move to original position
};

export default function HeroSection() {
    return (
        <div>
            <div className="hero-section">
                {/* Text Section */}
                <div className="hero-container">
                    <div className="hero-content">
                        <motion.p
                            variants={textVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="hero-eyewear-label"
                        >
                            <span role="img" aria-label="eye">👁️</span> Glasses & Eyewear
                        </motion.p>

                        <motion.h1
                            variants={textVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="hero-heading"
                        >
                            Perfect Glasses for <br /> Your Unique Style
                        </motion.h1>

                        <motion.p
                            variants={textVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="hero-paragraph"
                        >
                            Explore eyewear crafted to match your lifestyle — combining innovation, elegance, and all-day visual clarity.
                        </motion.p>

                        <motion.div
                            variants={textVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="hero-buttons"
                        >
                            <Link to="/shop">Browse Woman</Link>
                            <Link to="/shop">Browse Men</Link>
                        </motion.div>

                        {/* <motion.p
                            variants={textVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="hero-quiz-link"
                        >
                            Take a quiz to find your frames ↗
                        </motion.p> */}
                    </div>

                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="hero-image"
                    >
                        <img src={menwithspecs} alt="hero-man" />
                    </motion.div>
                </div>

            </div>
            {/* Features Section */}
            <div className="features-section">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={containerVariants}
                        className="features-container"
                    >
                        <motion.div className="feature-item" variants={itemVariants}>
                            <div className="feature-icon"><LuShoppingBag /></div>
                            <p>Shop online and collect in one of our 1000 stores.</p>
                        </motion.div>
                        <motion.div className="feature-item" variants={itemVariants}>
                            <div className="feature-icon"><FiSliders /></div>
                            <p>Free fitting and adjustment in offline store.</p>
                        </motion.div>
                        <motion.div className="feature-item" variants={itemVariants}>
                            <div className="feature-icon"><MdOutlineShield /></div>
                            <p>We accept most insurance plans, online and offline.</p>
                        </motion.div>
                        <motion.div className="feature-item" variants={itemVariants}>
                            <div className="feature-icon"><FiTruck /></div>
                            <p>Free shipping and 30-day returns online and offline.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
