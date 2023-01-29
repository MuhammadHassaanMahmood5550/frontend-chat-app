import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginUserMutation } from '../services/appApi';
import "../css/login.css"
import { useContext } from 'react';
import { AppContext } from '../context/appContext';
import { Spinner } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {socket} = useContext(AppContext);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser({email, password}).then(({data}) => {
     if(data){
      //socket work here
      socket.emit('new-user');
      //navigate to the chat
      console.log("login user data", data);
      navigate("/Chat");
     }
    });
  }

  return (
  <div className="main_login">
    <div className="container">
      <div className="row  align-items-center ">
        <div className="col-md-5 login_bg"></div>
        <div className="col-md-5 mx-auto">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              {error && <p className='alert alert-danger'>{error.data}</p>}
              <label htmlFor="">Email address</label>
              <input type="email" className='form-control' placeholder='user@example.com' required
               value={email}
               onChange={(e) => setEmail(e.target.value)} />
              <small className='text-muted'>we'll never share your email with anyone else.</small>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="">Password</label>
              <input type="password" className='form-control' required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className='btn btn-primary mt-3' type='submit'>
              {isLoading ? <Spinner animation='grow'/> : "Login"}
            </button>
            <p className='mt-3'>Don't have an account ? <Link to="/signup">Signup</Link> </p>
          </form>
        </div>
      </div>

    </div>
  </div>
  )
}

export default Login
