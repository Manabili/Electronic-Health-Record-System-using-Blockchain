import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Hospital from './Hospital';
import Doctor from './Doctor';
import Patient from './Patient';
import Record from './Record';
import Register from './Register';
import Login from './Login';
import signup_hos from  './signup_hos';
import signup_doc from  './signup_doc';
import signup_pat from  './signup_pat';

import RegH from './RegH';
import RegD from './RegD';
import RegP from './RegP';

import LogH from './LogH';
import LogD from './LogD';
import LogP from './LogP';


import history from './history';
import { NavLink } from 'react-router-dom';

class App extends Component {
  render() {
    return (  
      <div> 
       <Router history={history}>
       
         <div>
          <Switch>
            <Route path="/" component={Home} exact/>

            <Route path="/Register" component={Register}/>
            <Route path="/RegH" component={RegH}/>
            <Route path="/RegD" component={RegD}/>
            <Route path="/RegP" component={RegP}/> 

            <Route path="/Login" component={Login}/>
            <Route path="/signup_hos" component={signup_hos}/>
            <Route path="/signup_doc" component={signup_doc}/>
            <Route path="/signup_pat" component={signup_pat}/>

            <Route path="/logH" component={LogH}/>
            <Route path="/LogD" component={LogD}/>
            <Route path="/LogP" component={LogP}/> 

 
          </Switch>
          </div> 
  
         </Router>
         </div>

    );
  }
}
 
export default App;