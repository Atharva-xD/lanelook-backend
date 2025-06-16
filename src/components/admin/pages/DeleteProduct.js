// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// function DeleteProduct() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function fetchProducts() {
//       const response = await axios.get('/api/products');
//       setProducts(response.data);
//     }
//     fetchProducts();
//   }, []);

//   const deleteProduct = async (id) => {
//     await axios.delete(`/api/products/${id}`);
//     setProducts(products.filter((product) => product.id !== id));
//     alert('Product deleted successfully!');
//   };

//   return (
//     <div>
//       <h1>Delete Product</h1>
//       <ul>
//         {products.map((product) => (
//           <li key={product.id}>
//             {product.name} - {product.price}
//             <button onClick={() => deleteProduct(product.id)}>Delete</button>
//             <Link to={`/update-product/${product.id}`}>Update</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default DeleteProduct;
