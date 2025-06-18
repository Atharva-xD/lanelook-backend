// Book.js
import React, { useState, useRef } from "react";
import { usePopup } from "../../context/PopupContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import emailjs from '@emailjs/browser';
import { useAuth } from "../../context/AuthContext";
import "./Book.css";

const Book = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    address: '',
    timeSlot: ''
  });
  const [errors, setErrors] = useState({});
  const form = useRef();
  const { showPopup } = usePopup();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Get product information from location state or cart
  const productInfo = location.state?.productInfo;
  const selectedProducts = productInfo ? [productInfo] : cartItems;

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
    if (!time) errors.time = 'Time slot is required';
    if (!date) errors.date = 'Date is required';
    
    // Debug logs
    console.log('Selected Products:', selectedProducts);
    console.log('Cart Items:', cartItems);
    console.log('Product Info:', productInfo);
    
    if (!selectedProducts || selectedProducts.length === 0) {
      console.log('No products selected');
      errors.products = 'Please select at least one product';
    }
    return errors;
  };

  const handleBooking = async () => {
    if (!isAuthenticated()) {
      showPopup({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please sign in to book an appointment.'
      });
      navigate('/signin');
      return;
    }

    if (!date || !time) {
      showPopup({
        type: 'error',
        title: 'Error',
        message: 'Please select a date and time.'
      });
      return;
    }

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      showPopup({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields and select at least one product.'
      });
      return;
    }

    try {
      // Transform products to match the backend schema
      const formattedProducts = selectedProducts.map(product => ({
        id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        productId: product._id
      }));

      console.log('Sending booking request with data:', {
        date,
        time,
        customerName: formData.from_name,
        customerEmail: formData.from_email,
        customerAddress: formData.address,
        products: formattedProducts
      });

      const response = await fetch('http://localhost:5000/api/slots/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date,
          time,
          customerName: formData.from_name,
          customerEmail: formData.from_email,
          customerAddress: formData.address,
          selectedProducts: formattedProducts,
          totalAmount: formattedProducts.reduce((sum, p) => sum + p.price, 0)
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
            address: formData.address,
            products: selectedProducts.map(p => p.name).join(', '),
            totalAmount: selectedProducts.reduce((sum, p) => sum + p.price, 0),
            orderId: data.order._id // Add order ID to email
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
            message: `Your appointment has been booked for ${date} at ${time}. A confirmation email has been sent to ${formData.from_email}. Order ID: ${data.order._id}`,
            autoClose: true
          });
          
          // Clear the cart after successful booking
          dispatch(clearCart());
          
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
          console.error('Email sending error:', emailError);
          showPopup({
            type: 'error',
            title: 'Email Error',
            message: 'Booking was successful but there was an error sending the confirmation email.'
          });
        }
      } else {
        throw new Error(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      showPopup({
        type: 'error',
        title: 'Booking Error',
        message: error.message || 'Failed to book appointment. Please try again.'
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

        {selectedProducts.length > 0 && (
          <div className="selected-products-info">
            <h3>Selected Products</h3>
            <div className="products-grid">
              {selectedProducts.map((product) => (
                <div key={product._id} className="product-preview">
                  <img src={product.image} alt={product.name} />
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p>Price: ₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-amount">
              <h4>Total Amount: ₹{selectedProducts.reduce((sum, p) => sum + p.price, 0)}</h4>
            </div>
          </div>
        )}

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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
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