import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditProductModal from './EditProductModal';
import axios from 'axios';
import './ProductsTable.css';

const ProductsTable = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching products");
      setLoading(false);
    }
  };

  // Function to add a new product
  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  // Function to update product details
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const response = await axios.put(`/api/products/${updatedProduct._id}`, updatedProduct);
      const updatedProducts = products.map((product) =>
        product._id === updatedProduct._id ? response.data : product
      );
      setProducts(updatedProducts);
    } catch (err) {
      setError("Error updating product");
    }
  };

  // Function to show delete confirmation
  const showDeleteConfirmation = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  // Function to cancel delete
  const cancelDelete = () => {
    setDeleteConfirm({ show: false, id: null });
  };

  // Function to delete a product
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/api/products/${deleteConfirm.id}`);
      setProducts(products.filter((product) => product._id !== deleteConfirm.id));
      setDeleteConfirm({ show: false, id: null });
    } catch (err) {
      setError("Error deleting product. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="products-table container">
      {/* Tabs Section */}
      <div className="tabs">
        <button
          className={activeTab === 'details' ? 'active-tab' : ''}
          onClick={() => setActiveTab('details')}
        >
          Product Details
        </button>
        <button
          className={activeTab === 'overview' ? 'active-tab' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Products Overview
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === 'details' && (
          <div className="product-details-tab text-center">
            <h3>Product Form</h3>
            <ProductForm onAddProduct={handleAddProduct} />
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="products-overview-tab">
            <h3>Products Overview</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.category}</td>
                    <td>
                      <button 
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsModalOpen(true);
                        }}
                        className='editproductData'
                        title="Edit Product"
                      >
                        <FaRegEdit />
                      </button>
                      <button 
                        onClick={() => showDeleteConfirmation(product._id)} 
                        className='deleteproductData'
                        title="Delete Product"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Product Modal */}
        {isModalOpen && (
          <EditProductModal
            product={selectedProduct}
            onUpdateProduct={handleUpdateProduct}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="delete-confirmation-modal">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="modal-buttons">
                <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
                <button onClick={handleDeleteProduct} className="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTable;
