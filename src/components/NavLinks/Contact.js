import React, { useState, useRef } from 'react';
import './Contact.css'; // Import custom styles for the Contact component
import emailjs from '@emailjs/browser'; // Import EmailJS
import manwithspecstwo from "./images/menwithspecstwo.png";
import { HelpCircle, MapPin, Phone } from 'lucide-react';
import { Eye } from "lucide-react";
import { LuSmile } from "react-icons/lu";
import { motion } from 'framer-motion'; // Import Framer Motion

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({}); // State to track form validation errors
  const form = useRef(); // Ref for the form to be used with EmailJS

  const faqData = [
    {
      question: "Can I wear contact lenses instead of glasses?",
      answer: "Yes. Our team can guide you to the best option based on your needs."
    },
    {
      question: "How often should I get my eyes checked?",
      answer: "We recommend at least once every 12 months or as advised by your optometrist."
    },
    {
      question: "Can I get prescription lenses for sunglasses?",
      answer: "Absolutely! Prescription sunglasses are available for most frame styles."
    },
    {
      question: "Can I buy glasses without a prescription?",
      answer: "Yes, you can buy non-prescription frames with demo lenses or blue light filters."
    },
    {
      question: "What types of lenses are available for glasses?",
      answer: "We offer single vision, bifocal, progressive, and blue-light filtering lenses for various needs."
    },
    {
      question: "How do I choose the right frame for my glasses?",
      answer: "Our stylists can help you pick frames based on your face shape, preferences, and lifestyle."
    }    
  ];

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation
  const validateForm = () => {
    let errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    if (!formData.email || !formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.message) {
      errors.message = 'Message is required';
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if validation fails
    } else {
      // Send email using EmailJS
      emailjs.sendForm('service_kaszvw1', 'template_vegyi9n', form.current, 'veBJ3jhU_ONNTfYFX')
        .then((result) => {
          console.log(result.text);
          alert('Message sent successfully!'); // Success message
        }, (error) => {
          console.log(error.text);
          alert('Failed to send message. Please try again.'); // Error message
        });

      // Reset form fields
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      setErrors({});
      setSubmitted(true); // Set submitted to true after successful submission
    }
  };

  return (
    <div className="contact-wrapper">
      {/* Header */}
      <section className="contact-header">
        <div className="contactUs-label">
          <Eye size={16} color="#9c5820" />
          <span>GET IN TOUCH</span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Our Friendly Team
        </motion.h1>
        <motion.p
          className="description"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          We are here to assist you with any inquiries regarding our eyewear products. Your satisfaction is our priority!
        </motion.p>
      </section>

      {/* Contact Cards */}
      <div className="contact-cards">
        <div className="contact-card">
          <LuSmile className='icon' />
          <h3>Chat to Sales</h3>
          <p>Speak to our friendly sales team for assistance with your orders.</p>
          <a href="mailto:sales@lanelook.com">sales@lanelook.com</a>
        </div>
        <div className="contact-card">
          <HelpCircle className="icon" />
          <h3>Chat to Support</h3>
          <p>We’re here to help with any issues you may have.</p>
          <a href="mailto:support@lanelook.com">support@lanelook.com</a>
        </div>
        <div className="contact-card">
          <MapPin className="icon" />
          <h3>Visit Us</h3>
          <p>Come visit our office HQ for personalized assistance.</p>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer">View on Google Maps</a>
        </div>
        <div className="contact-card">
          <Phone className="icon" />
          <h3>Call Us</h3>
          <p>Mon-Fri from 8am to 5pm. We’re just a call away!</p>
          <a href="tel:+911234567899">+91 1234567899</a>
        </div>
      </div>

      {/* Promo Section */}
      <div className="promo-section">
        <div className='promo-container'>
          <div className="promo-text">
            <p className="promo-subtitle">PROMOTIONS</p>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Limited-Time Offer –<br />Enjoy Exclusive Discounts<br />on Premium Eyewear!
            </motion.h2>
            <motion.p
              className="descriptiontwo"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Discover our latest collection and take advantage of our special offers today!
            </motion.p>
            <button className="promo-btn">Shop Now!</button>
          </div>
          <img src={manwithspecstwo} alt="Promo" className="promo-image" />
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className='faq-container'>
          <div className="contactUs-label">
            <Eye size={16} color="#9c5820" />
            <span>QUESTIONS & ANSWERS</span>
          </div>
          <h2>Discover The Most Common Questions</h2>
          <p className="description">
            Here are some frequently asked questions about our eyewear products and services.
          </p>
          <div className="faq-grid">
            {faqData.map((item, index) => (
              <motion.div
                className="faq-item"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered animation
                viewport={{ once: true }} // Animation triggers only once
              >
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="form-section">
        <h2>DIDN’T FIND THE ANSWER YOU ARE LOOKING FOR?</h2>
        <h3>Send Us Your Query</h3>
        <form ref={form} onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
        {submitted && <p className="submit-message">Thank you! We’ll get back to you soon.</p>}
      </section>
    </div>
  );
};

export default Contact;
