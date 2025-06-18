import React from "react";
import logo from "../logo.svg";
import '../index.css';

function Product(props) {
  return (
    <div className="col-2">
      <div className="card my-2" style={{ width: "13rem" }}>
        <img src={logo} className="card-img-top" alt="react" />
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
