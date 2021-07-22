import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, NavLink, Route, Switch, withRouter, Router   } from 'react-router-dom';
import PropTypes from 'prop-types';

import Web3 from 'web3';
import Merge from './abis/Merge.json'
import history from './history';

class patient extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


   async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    console.log(networkId)

    const networkData = Merge.networks[networkId]
    this.setState({networkData : networkData })
    if(networkData) {
      const contract = new web3.eth.Contract(Merge.abi, networkData.address)
      this.setState({ contract })
       
    }
     else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

 constructor(props){
  super(props)

  this.state = {
    pat_id : '',
    pat_hash : '',
    Patient_name : '',
    _address : '',
    phone : '',
    email : '',
    contract : '',
    web3: '',
    account: '',
    message : '',
    networkData : '',
    status : ''
 };

 this.handleChange = this.handleChange.bind(this);
 //this.getHash = this.getHash.bind(this);
 //this.handleSubmit = this.handleSubmit.bind(this)
 this.showDetails = this.showDetails.bind(this)
}

handleChange(event){
     event.preventDefault()
     this.setState({
     [event.target.name] : event.target.value
    })
}

 
 async showDetails(event) {

     event.preventDefault()
     //console.log(this.state)

     this.setState({message : "Waiting for transaction result !" })

     const {pat_id, pat_hash} = this.state
     console.log(pat_hash)
     
     const result = await this.state.contract.methods.ViewDetailsP(pat_id, pat_hash).call({ from: this.state.account }).then((result, error) => {
      if(result)
      {
         this.setState({status : 1})      
      }
      if(error)
      {
         alert('Wrong information !')
      }

  })

     console.log('result is',result)

     if(this.state.status)
     {
         let data = [pat_id, pat_hash]
         return (
   
          this.props.history.push({
            pathname: '/LogP',
            state : data
              
          })
         )
     }

     /*this.setState({id : result[0]})
     this.setState({Patient_name : result[1]})
     this.setState({_address : result[2]})
     this.setState({phone : result[3]})
     this.setState({email : result[4]})
 
     this.setState({message : "Transaction successful" })

     //console.log(result)*/
     alert('Result is successfully fetched from blockchain !')
 }


 render() {
   return (
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

      </Router>  

      <div>
        <h2>View Patient's Details</h2>

        <div>
        <label htmlFor='pat_id'>Enter your Public Key</label>
        <input type='text'  name = 'pat_id' id = 'id1' onChange = {this.handleChange}/>
        </div>

        <div>
        <label htmlFor='pat_hash'>Enter your Private Key</label>
        <input type = 'text' name = 'pat_hash' onChange = {this.handleChange}/>
        </div>
       
        <div>
        <input type = 'button' onClick = {this.showDetails} value = 'View Details'/>
        </div>
       </div>


     </div>
     
     
   )
 }
}

export default patient;

