import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, NavLink, Route, Switch, withRouter, Router } from 'react-router-dom';

import Home from './Home';
import './App.css'

import history from './history';

class Login extends Component {
   render() {
    return(
      <div>
       
       <Router history={history}>

        <div margin-right = "30px">
          <NavLink to="/">Home</NavLink> 
          &nbsp; &nbsp; &nbsp;

          <NavLink to="/Register" >Register</NavLink>
          &nbsp; &nbsp; &nbsp; 

          <NavLink to="/Login">Login</NavLink>
          &nbsp; &nbsp; &nbsp;

         </div> 

        <ul>

        <ul>
          <input className = 'log_lh1' type = 'button' onClick={() => history.push('/signup_hos')} value = 'Log In as Hospital' />
        </ul>

        <ul>
          <input className = 'log_ld1' type = 'button' onClick={() => history.push('/signup_doc')} value = 'Log In as Doctor' /> 
        </ul>  

        <ul>
          <input className = 'log_lp1' type = 'button' onClick={() => history.push('/signup_pat')} value = 'Log In as Patient' />
          </ul>


        </ul>

        </Router>
      </div>
    );
   }
}

export default Login