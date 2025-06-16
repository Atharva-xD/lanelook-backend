// backend/utils/validation.js
const validateRegistration = (data) => {
    const { name, email, password, role } = data;
  
    if (!name || !email || !password || !role) {
      throw new Error('Please provide all required fields');
    }
  
    if (!validateEmail(email)) {
      throw new Error('Please provide a valid email');
    }
  
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  
    return true;
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };
  
  const validateProduct = (data) => {
    const { name, price, category, description } = data;
  
    if (!name || !price || !category || !description) {
      throw new Error('Please provide all required product fields');
    }
  
    if (price < 0) {
      throw new Error('Price must be a positive number');
    }
  
    return true;
  };
  
  module.exports = {
    validateRegistration,
    validateEmail,
    validateProduct
  };
  