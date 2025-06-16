// Book.js
import React, { useState, useEffect, useRef } from "react";
import { usePopup } from "../../context/PopupContext";
import emailjs from '@emailjs/browser';
import "./Book.css";

const Book = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    address: '',
    timeSlot: ''
  });
  const [errors, setErrors] = useState({});
  const form = useRef();
  const { showSuccess, showError, showConfirm, showPopup } = usePopup();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.from_name) errors.from_name = 'Name is required';
    if (!formData.from_email || !formData.from_email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      errors.from_email = 'Invalid email address';
    }
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.timeSlot) errors.timeSlot = 'Time slot is required';
    return errors;
  };

  const handleBooking = async () => {
    if (!date || !time) {
      showPopup({
        type: 'error',
        title: 'Error',
        message: 'Please select a date and time.'
      });
      return;
    }

    try {
      console.log('Sending booking request with data:', {
        date,
        time,
        customerName: formData.from_name,
        customerEmail: formData.from_email,
        customerAddress: formData.address
      });

      const response = await fetch('http://localhost:5000/api/slots/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date,
          time,
          customerName: formData.from_name,
          customerEmail: formData.from_email,
          customerAddress: formData.address
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('Backend response:', data);

      if (response.ok) {
        console.log('Booking successful, sending email...');
        try {
          // Prepare EmailJS template parameters
          const templateParams = {
            from_name: formData.from_name,
            to_name: formData.from_name,
            from_email: formData.from_email,
            to_email: formData.from_email,
            message: `Your appointment has been booked for ${date} at ${time}.`,
            address: formData.address
          };

          // Send email using EmailJS
          await emailjs.send(
            'service_kaszvw1',
            'template_89b92u8',
            templateParams,
            'veBJ3jhU_ONNTfYFX'
          );

          console.log('Email sent successfully');
          showPopup({
            type: 'success',
            title: 'Booking Confirmed',
            message: `Your appointment has been booked for ${date} at ${time}. A confirmation email has been sent to ${formData.from_email}.`,
            autoClose: true
          });
          
          // Reset form
          setDate('');
          setTime('');
          setFormData({
            from_name: '',
            from_email: '',
            address: '',
            timeSlot: ''
          });
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          showPopup({
            type: 'warning',
            title: 'Partial Success',
            message: 'Your slot was booked, but we could not send the confirmation email. Please note your appointment time.'
          });
        }
      } else {
        // Handle specific error cases
        if (data.message && data.message.includes('already exists')) {
          showPopup({
            type: 'error',
            title: 'Slot Unavailable',
            message: 'This time slot is already booked. Please select a different time.'
          });
        } else {
          showPopup({
            type: 'error',
            title: 'Booking Failed',
            message: data.message || 'Failed to book slot. Please try again.'
          });
        }
      }
    } catch (error) {
      console.error('Error in handleBooking:', error);
      showPopup({
        type: 'error',
        title: 'Error',
        message: 'Failed to book slot. Please try again.'
      });
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    return maxDate.toISOString().split("T")[0];
  };

  return (
    <div className="book-container">
      <div className="book-content">
        <h1>Book an Appointment</h1>
        <p>Select your preferred date and time for your appointment.</p>

        <form ref={form} className="booking-form">
          <div className="form-group">
            <label htmlFor="date">Select Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Select Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="from_name">Full Name</label>
            <input
              type="text"
              id="from_name"
              name="from_name"
              value={formData.from_name}
              onChange={handleInputChange}
              placeholder="Your full name"
              className={errors.from_name ? 'error-input' : ''}
              required
            />
            {errors.from_name && <div className="error-message">{errors.from_name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="from_email">Email Address</label>
            <input
              type="email"
              id="from_email"
              name="from_email"
              value={formData.from_email}
              onChange={handleInputChange}
              placeholder="Your email address"
              className={errors.from_email ? 'error-input' : ''}
              required
            />
            {errors.from_email && <div className="error-message">{errors.from_email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Complete Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Your complete address"
              className={errors.address ? 'error-input' : ''}
              rows="3"
              required
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>

          <button
            type="button"
            className="book-button"
            onClick={handleBooking}
            disabled={isSubmitting || !date || !time}
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </button>
        </form>

        <div className="booking-info">
          <h3>Booking Information</h3>
          <ul>
            <li>Appointments are available Monday through Friday</li>
            <li>Each appointment lasts approximately 30 minutes</li>
            <li>Please arrive 5 minutes before your scheduled time</li>
            <li>Cancellations must be made at least 24 hours in advance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Book;