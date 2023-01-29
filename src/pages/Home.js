import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import "../css/home.css";
function Home() {
  return (
    <div className="main_home">
      <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>Share the chat with your friends</h1>
          <p>Chat App lets connect with the world</p>
          <LinkContainer to="/chat">         
          <button className='btn btn-success'>Get Started <i className='fas fa-comments home-message-icon ms-2'></i> </button>
          </LinkContainer>
        </div>
        <div className="col-md-6 home_bg">

        </div>
      </div>
      </div>
    </div>
  )
}

export default Home
