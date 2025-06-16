// Book.js
import React, { useState, useRef } from 'react';
import './Book.css'; // Import custom styles for the Book component
import emailjs from '@emailjs/browser';

const Book = () => {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    address: '',
    timeSlot: ''
  });

  const [errors, setErrors] = useState({}); // State to track form validation errors
  const form = useRef(); // Ref for the form to be used with EmailJS

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation
  const validateForm = () => {
    let errors = {};
    if (!formData.from_name) {
      errors.from_name = 'Name is required';
    }
    if (!formData.from_email || !formData.from_email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.address) {
      errors.address = 'address is required';
    }
    if (!formData.timeSlot) {
      errors.timeSlot = 'Time slot is required';
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
      // Handle form submission logic here
      // Send email using EmailJS
      emailjs.sendForm('service_kaszvw1', 'template_89b92u8', form.current, 'veBJ3jhU_ONNTfYFX')
        .then((result) => {
          console.log(result.text);
          alert('Slot booked successfully! Confirmation email sent.'); // Success address
        }, (error) => {
          console.log(error.text);
          alert('Failed to book slot. Please try again.'); // Error address
        });

      // Reset form fields
      setFormData({
        from_name: '',
        from_email: '',
        address: '',
        timeSlot: ''
      });
      setErrors({});
    }
  };

  return (
    <div className="book-container container">
      <div className="book-header">
        <h1>Book Your Slot</h1>
      </div>
      <div className="book-form">
        <form ref={form} onSubmit={handleSubmit}> {/* Attach the ref to the form */}
          <input
            type="text"
            name="from_name"
            placeholder="Your Name"
            value={formData.from_name}
            onChange={handleChange}
            required
          />
          {errors.from_name && <div className="error">{errors.from_name}</div>}

          <input
            type="email"
            name="from_email"
            placeholder="Your Email"
            value={formData.from_email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error">{errors.email}</div>}

          <textarea
            name="address"
            placeholder="Your Address"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>
          {errors.address && <div className="error">{errors.address}</div>}


          <select
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            required
          >
            <option value="">Select a time slot</option>
            <option value="09:00-10:00">09 :00-10:00</option>
            <option value="10:00-11:00">10:00-11:00</option>
            <option value="11:00-12:00">11:00-12:00</option>
            <option value="12:00-13:00">12:00-13:00</option>
            <option value="13:00-14:00">13:00-14:00</option>
            <option value="14:00-15:00">14:00-15:00</option>
            <option value="15:00-16:00">15:00-16:00</option>
            <option value="16:00-17:00">16:00-17:00</option>
          </select>
          {errors.timeSlot && <div className="error">{errors.timeSlot}</div>}

          <button type="submit">Book Slot</button>
        </form>
      </div>
    </div>
  );
};

export default Book;
