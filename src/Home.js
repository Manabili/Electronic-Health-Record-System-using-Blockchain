import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';

import './App.css';

import Home from './Home';
import Register from './Register';
import Login from './Login'
import { NavLink } from 'react-router-dom';
import history from './history';

class home extends Component {
  render() {
    return (  
      <div> 
         
        <h1>Electronic Health Record system using Blockchain </h1>
       
        <Router history={history}>
       
       
        <div>
          <NavLink to="/">Home</NavLink> 
          &nbsp; &nbsp; &nbsp;

          <NavLink to="/Register" >Register</NavLink>
          &nbsp; &nbsp; &nbsp; 

          <NavLink to="/Login">Login</NavLink>
          &nbsp; &nbsp; &nbsp;

         </div> 
         
          </Router>

          <hr/>
          <div className = "home_margin">
          <p className = "heeh">@copyright to :</p>
          <p> Manabili Nath</p>
          <p> Ritu Agarwalla</p>
          <p> Akangsha Goswami</p>
          <p> Smriti Suman </p>
          </div>
        </div>
       
    );
  }
}
 
export default home;