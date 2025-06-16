import React from "react";
import "./WhyChooseUs.css";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

const features = [
  {
    id: "01",
    title: "Unparalleled Selection",
    description: "Explore a vast range of eyewear styles tailored to your unique taste and needs.",
  },
  {
    id: "02",
    title: "Premium Quality",
    description: "Our eyewear is crafted with the finest materials for durability and comfort.",
  },
  {
    id: "03",
    title: "Expert Guidance",
    description: "Receive personalized advice from our knowledgeable team of eyewear specialists.",
  },
  {
    id: "04",
    title: "Personalized Service",
    description: "Enjoy a tailored shopping experience that caters to your individual preferences.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="why-container">
        <motion.div 
          className="why-text"
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="why-label">
            <Eye size={16} color="#9c5820" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="why-heading">
            Discover the Benefits of <br /> Choosing Us
          </h2>
          <p className="why-paragraph">
            Experience exceptional service and quality products that enhance your vision and style.
          </p>
        </motion.div>

        <div className="why-features">
          {features.map((feature, index) => (
            <motion.div 
              className="why-feature-card" 
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-id">{feature.id}</div>
              <div className="feature-line"></div>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
