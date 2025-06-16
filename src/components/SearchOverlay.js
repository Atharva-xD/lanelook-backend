import React from 'react';
import "../index.css";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

function SearchOverlay({ close }) {
    return (
        <motion.div
            className="search-overlay"
            initial={{ y: -300 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="search-bar">
                <FaTimes
                    className="cancel-icon"
                    onClick={close}
                />
                <input type="search" placeholder="Search..." />
                <button>Search</button>
            </div>
        </motion.div>
    );
}

export default SearchOverlay;
