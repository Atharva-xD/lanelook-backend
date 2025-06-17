import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import './Services.css';

function Services() {
  const services = useSelector((state) => state.services.services);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (service) => {
    dispatch(addToCart({
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration,
      image: service.image
    }));
  };

  const handleBookAppointment = (service) => {
    dispatch(addToCart({
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration,
      image: service.image
    }));
    navigate('/book');
  };

  return (
    <div className="services-container">
      <h2 className="services-title">Our Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-image">
              <img src={service.image} alt={service.name} />
            </div>
            <div className="service-details">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-info">
                <span className="duration">Duration: {service.duration} mins</span>
                <span className="price">₹{service.price}</span>
              </div>
              <div className="service-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(service)}
                >
                  Add to Cart
                </button>
                <button 
                  className="book-now-btn"
                  onClick={() => handleBookAppointment(service)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services; 