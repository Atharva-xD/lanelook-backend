import React, { useState, useEffect } from "react";
import "./EditProductModal.css";
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    images: [""],
    category: "",
    about: "",
    productId: "",
    frameStyle: "",
    modelNo: "",
    frameWidth: "",
    frameDimensions: "",
    frameColour: "",
    weight: "",
    weightGroup: "",
    material: "",
    frameMaterial: "",
    templeMaterial: "",
    prescriptionType: "",
    visionType: "",
    frameStyleSecondary: "",
    collection: "",
    warranty: "",
    gender: "",
    height: "",
    condition: "",
    templeColour: "",
    brandName: "",
    productType: "",
    frameType: "",
    frameShape: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (product) {
      // Handle both old single image and new multiple images format
      const images = product.images && product.images.length > 0 
        ? product.images 
        : (product.image ? [product.image] : [""]);

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        image: product.image || "",
        images: images,
        category: product.category || "",
        about: product.about || "",
        productId: product.productId || "",
        frameStyle: product.frameStyle || "",
        modelNo: product.modelNo || "",
        frameWidth: product.frameWidth || "",
        frameDimensions: product.frameDimensions || "",
        frameColour: product.frameColour || "",
        weight: product.weight || "",
        weightGroup: product.weightGroup || "",
        material: product.material || "",
        frameMaterial: product.frameMaterial || "",
        templeMaterial: product.templeMaterial || "",
        prescriptionType: product.prescriptionType || "",
        visionType: product.visionType || "",
        frameStyleSecondary: product.frameStyleSecondary || "",
        collection: product.collection || "",
        warranty: product.warranty || "",
        gender: product.gender || "",
        height: product.height || "",
        condition: product.condition || "",
        templeColour: product.templeColour || "",
        brandName: product.brandName || "",
        productType: product.productType || "",
        frameType: product.frameType || "",
        frameShape: product.frameShape || ""
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle multiple images
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prevState => ({
      ...prevState,
      images: newImages
    }));
  };

  // Add new image field
  const addImageField = () => {
    setFormData(prevState => ({
      ...prevState,
      images: [...prevState.images, ""]
    }));
  };

  // Remove image field
  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prevState => ({
        ...prevState,
        images: newImages
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Filter out empty image URLs and ensure at least one image
      const filteredImages = formData.images.filter(img => img.trim() !== "");
      
      if (filteredImages.length === 0) {
        setError("At least one image is required");
        return;
      }

      const productData = {
        ...formData,
        images: filteredImages,
        image: filteredImages[0] // Set the first image as the primary image
      };

      const response = await axios.put(`${API_URL}/api/products/${product._id}`, productData);
      setSuccess("Product updated successfully!");
      onUpdate(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error updating product");
    }
  };

  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Multiple Images Section */}
              <div className="form-group">
                <label>Product Images</label>
                <div className="images-container">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="image-input-group">
                      <input
                        type="url"
                        placeholder={`Image URL ${index + 1}`}
                        value={imageUrl}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        required={index === 0}
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImageField(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-image-btn"
                    onClick={addImageField}
                  >
                    + Add Another Image
                  </button>
                </div>
                <small className="form-help-text">
                  First image will be used as the primary image in the shop
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="eyeglasses">Eyeglasses</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="screen">Screen Glasses</option>
                  <option value="power">Power Glasses</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="about">About</label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Product Details</h3>
              <div className="form-group">
                <label htmlFor="productId">Product ID</label>
                <input
                  type="text"
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frameStyle">Frame Style</label>
                <input
                  type="text"
                  id="frameStyle"
                  name="frameStyle"
                  value={formData.frameStyle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modelNo">Model Number</label>
                <input
                  type="text"
                  id="modelNo"
                  name="modelNo"
                  value={formData.modelNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frameWidth">Frame Width</label>
                <input
                  type="text"
                  id="frameWidth"
                  name="frameWidth"
                  value={formData.frameWidth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frameDimensions">Frame Dimensions</label>
                <input
                  type="text"
                  id="frameDimensions"
                  name="frameDimensions"
                  value={formData.frameDimensions}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frameColour">Frame Colour</label>
                <input
                  type="text"
                  id="frameColour"
                  name="frameColour"
                  value={formData.frameColour}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Specifications</h3>
              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="weightGroup">Weight Group</label>
                <input
                  type="text"
                  id="weightGroup"
                  name="weightGroup"
                  value={formData.weightGroup}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frameMaterial">Frame Material</label>
                <input
                  type="text"
                  id="frameMaterial"
                  name="frameMaterial"
                  value={formData.frameMaterial}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="templeMaterial">Temple Material</label>
                <input
                  type="text"
                  id="templeMaterial"
                  name="templeMaterial"
                  value={formData.templeMaterial}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Details</h3>
              <div className="form-group">
                <label htmlFor="prescriptionType">Prescription Type</label>
                <input
                  type="text"
                  id="prescriptionType"
                  name="prescriptionType"
                  value={formData.prescriptionType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="visionType">Vision Type</label>
                <input
                  type="text"
                  id="visionType"
                  name="visionType"
                  value={formData.visionType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frameStyleSecondary">Frame Style Secondary</label>
                <input
                  type="text"
                  id="frameStyleSecondary"
                  name="frameStyleSecondary"
                  value={formData.frameStyleSecondary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="collection">Collection</label>
                <input
                  type="text"
                  id="collection"
                  name="collection"
                  value={formData.collection}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="warranty">Warranty</label>
                <input
                  type="text"
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="height">Height</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="condition">Condition</label>
                <input
                  type="text"
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="templeColour">Temple Colour</label>
                <input
                  type="text"
                  id="templeColour"
                  name="templeColour"
                  value={formData.templeColour}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="brandName">Brand Name</label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productType">Product Type</label>
                <input
                  type="text"
                  id="productType"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frameType">Frame Type</label>
                <input
                  type="text"
                  id="frameType"
                  name="frameType"
                  value={formData.frameType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frameShape">Frame Shape</label>
                <input
                  type="text"
                  id="frameShape"
                  name="frameShape"
                  value={formData.frameShape}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="submit-btn">Update Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
