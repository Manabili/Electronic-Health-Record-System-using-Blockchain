import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';


import { NavLink } from 'react-router-dom';

import Register from './Register';
import Login from './Login';
import Home from './Home';
import RegH from './RegH';
import RegD from './RegD';
import RegP from './RegP';
import history from './history';

class Reg extends Component {
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
          <input className = 'log_rh1' type = 'button' onClick={() => history.push('/RegH')} value = 'Hospital Registration' />
        </ul>

        <ul>
          <input className = 'log_rh1' type = 'button' onClick={() => history.push('/regD')} value = 'Doctor Registration' /> 
        </ul>  

        <ul>
          <input className = 'log_rh1' type = 'button' onClick={() => history.push('/RegP')} value = 'Patient Registartion' />
          </ul>


        </ul>
      </Router>
      </div>
    );
   }
}

export default Reg