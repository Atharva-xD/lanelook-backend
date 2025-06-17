import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTools, FaCar, FaCalendarAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h5>Business Hours</h5>
          <ul className="business-hours">
            <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
            <li>Saturday: 9:00 AM - 4:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/"><FaCar /> Home</Link></li>
            <li><Link to="/about"><FaCar /> About Us</Link></li>
            <li><Link to="/services"><FaTools /> Services</Link></li>
            <li><Link to="/contact"><FaEnvelope /> Contact</Link></li>
            <li><Link to="/book"><FaCalendarAlt /> Book Appointment</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Contact Info</h5>
          <ul className="contact-info">
            <li>
              <i><FaPhone /></i>
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <i><FaEnvelope /></i>
              <span>service@lanelook.com</span>
            </li>
            <li>
              <i><FaMapMarkerAlt /></i>
              <span>123 Auto Service Lane, City, State 12345</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LaneLook Auto Service. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;