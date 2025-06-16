import React, { Component } from 'react';
import "../index.css";

export default class Footer extends Component {
  render() {
    return (
      <div className='container-fluid footer'>
        <div className='row'>
          <div className='col-lg-4 col-md-4 col-sm-12'>
            <h5>About Us</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.</p>
          </div>
          <div className='col-lg-4 col-md-4 col-sm-12'>
            <h5>Quick Links</h5>
            <ul>
              <li><a href='#'>Home</a></li>
              <li><a href='#'>About</a></li>
              <li><a href='#'>Contact</a></li>
            </ul>
          </div>
          <div className='col-lg-4 col-md-4 col-sm-12'>
            <h5>Follow Us</h5>
            <ul>
              <li><a href='#'><i className='fab fa-facebook-f'></i> Facebook</a></li>
              <li><a href='#'><i className='fab fa-twitter'></i> Twitter</a></li>
              <li><a href='#'><i className='fab fa-instagram'></i> Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className='text-center text-color'>
          <p>&copy; 2024 Lane Look. All rights reserved.</p>
        </div>
      </div>
    )
  }
}