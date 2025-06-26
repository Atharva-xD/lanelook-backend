import React from "react";
import '../index.css';

function Product(props) {
  // Get the primary image (first image from images array or fallback to single image)
  const productImage = props.product.images && props.product.images.length > 0 
    ? props.product.images[0] 
    : props.product.image;

  return (
    <div className="col-2">
      <div className="card my-2" style={{ width: "13rem" }}>
        <img 
          src={productImage} 
          className="card-img-top" 
          alt={props.product.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">{props.product.name}</h5>
          <p className="card-text">{props.product.description}</p>
        </div>
        <div className="d-flex justify-content-around">
            <h3>₹{props.product.price}</h3>
            <button className="btn btn-primary mb-3">
            {props.product.quantity}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
