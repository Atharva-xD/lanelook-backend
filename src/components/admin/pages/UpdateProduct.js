// import React, { useEffect, useState } from 'react';
// import ProductForm from '../components/ProductForm';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// function UpdateProduct() {
//   const { id } = useParams();
//   const [product, setProduct] = useState({});

//   useEffect(() => {
//     async function fetchProduct() {
//       const response = await axios.get(`/api/products/${id}`);
//       setProduct(response.data);
//     }
//     fetchProduct();
//   }, [id]);

//   const updateProduct = async (data) => {
//     await axios.put(`/api/products/${id}`, data);
//     alert('Product updated successfully!');
//   };

//   return (
//     <div>
//       <h1>Update Product</h1>
//       <ProductForm onSubmit={updateProduct} defaultValues={product} />
//     </div>
//   );
// }

// export default UpdateProduct;
