import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, NavLink, Route, Switch, withRouter, Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import Merge from './abis/Merge.json';

import history from './history';

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

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
    console.log('Network Id')
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
    doc_id : '',
    Patient_name : '',
    _address : '',
    phone : '',
    email : '',
    date : '',
    contract : '',
    web3: '',
    account: '',
    message : '',
    networkData : '',
    status : '',
    visible : '',
    IpfsHash : ''
 };

 this.handleChange = this.handleChange.bind(this);

 this.showDetails = this.showDetails.bind(this)
}

handleChange(event){
     event.preventDefault()
     this.setState({
     [event.target.name] : event.target.value
    })
}

 
 async showDetails(event) {

     //event.preventDefault()
     //console.log(this.state)

     this.setState({message : "Waiting for transaction result !" })

     const { state } = this.props.location
     
     console.log(state[1])
     const result = await this.state.contract.methods.ViewDetailsP(state[0], state[1]).call({ from: this.state.account })

    this.setState({status : 1})      
    this.setState({visible : true})

     console.log('result is',result)
     
     
     this.setState({pat_id : result[0]})
     this.setState({Patient_name : result[1]})
     this.setState({_address : result[2]})
     this.setState({phone : result[3]})
     this.setState({email : result[4]})
 
     this.setState({message : "Transaction successful" })

     alert('Result is successfully fetched from blockchain !')
 }
 
 
myfunction(event) {
  var x = document.getElementById("pat_hidden");
  if (x.style.display === "block") {
    x.style.display = "show";
  } else {
    x.style.display = "block";
  }
}


 viewAsPatient = async(event) => {
    
  console.log(this.state);
  
  const { state } = this.props.location
  const {date} = this.state;

  this.setState({message : "Waiting for Ipfs !" })

  const result = await this.state.contract.methods.view_record_as_patient(state[0], state[1], date).call({ from: this.state.account });

  console.log(result)

  this.setState({IpfsHash : result})

  this.setState({message : "Ipfs is successfully fetched!" })

}

GivePermissionToDoctor = async(event) => {
   const {d_id} = this.state;
   const result = await this.state.contract.methods.give_permission_to_doctor(d_id).send({ from: this.state.account }).then((result, error) => {
  
    if(error)
    {
         alert('Something is wrong ! Please try again. ')
         return
    }
    
    this.setState({message : "Transaction successful" })
  })
}


RemovePermissionForDoctor = async(event) => {
   const {d_id} = this.state;
   const result = await this.state.contract.methods.remove_permission_for_doctor(d_id).send({ from: this.state.account }).then((result, error) => {
  
    if(error)
    {
         alert('Something is wrong ! Please try again. ')
         return
    }
    
    this.setState({message : "Transaction successful" })
  })

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

        <h2>View Patient's Contact Details</h2>
       
        <div>
        <input type = 'button' onClick = {() => {this.showDetails(); this.myfunction()}} value = 'View Details'/>
       
        </div>
       </div>
       <hr />
        
        <h1>{this.state.message}</h1>

      <hr />
      <div id = "pat_hidden" style = {{display : 'none'}}>
      
          <p>Public Key  : {this.state.pat_id}</p>
          <p>Patient Name  : {this.state.Patient_name}</p>
          <p>Patient Adrress : {this.state._address}</p>
          <p>Contact no : {this.state.phone}</p>
          <p>Email address  : {this.state.email}</p>
   
      </div>
      <hr/>
           <div>

        <h2>View Records as Patient</h2>

        
        <div>
        <label htmlFor='date'>Enter Date </label>
        <input type = 'text' name = 'date' onChange = {this.handleChange}/>
        </div>

       <div>
       <input type = 'button' onClick = {this.viewAsPatient} value = 'Submit'/>
       </div>
       
       
       <a href = {`https://ipfs.infura.io/ipfs/${this.state.IpfsHash}`} target="_blank" rel="noopener noreferrer"> Your Record is ready ! Click Here to Check </a>
      </div>

      <div>
           <h2> Give Permission to Doctor</h2>
           <div>
             <lable htmlFor = 'd_id'>Enter Doctor's Public Key</lable>
             <input type = 'text' name = 'd_id' onChange = {this.handleChange}/>
            </div>

             <div>
             <input type = 'button' onClick = {this.GivePermissionToDoctor} value = 'Submit'/>
             </div>

      </div>
     
      <div>
           <h2> Remove Permission for Doctor</h2>
           <div>
             <lable htmlFor = 'd_id'>Enter Doctor's Public Key</lable>
             <input type = 'text' name = 'd_id' onChange = {this.handleChange}/>
            </div>

             <div>
             <input type = 'button' onClick = {this.RemovePermissionForDoctor} value = 'Submit'/>
             </div>

      </div>

     </div>
     
     
   )
 }
}


export default patient;

