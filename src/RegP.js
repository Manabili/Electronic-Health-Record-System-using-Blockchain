import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, NavLink, Route, Switch, withRouter, Router } from 'react-router-dom';
import './App.css'
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
    id : '',
    hash : '',
    Patient_name : '',
    _address : '',
    phone : '',
    email : '',
    contract : '',
    web3: '',
    account: '',
    message : '',
    networkData : ''
 };

 this.handleChange = this.handleChange.bind(this);
 this.getHash = this.getHash.bind(this);
 this.handleSubmit = this.handleSubmit.bind(this)
 this.showDetails = this.showDetails.bind(this)
}

handleChange(event){
     event.preventDefault()
     this.setState({
     [event.target.name] : event.target.value
    })
}
async getHash(event) {
      event.preventDefault()
      //console.log(this.state)

      const{id, Patient_name} = this.state
      
      this.setState({message : "Waiting for Hash !" })

      const result = await this.state.contract.methods.getHashP(id, Patient_name).call({from : this.state.account}).then((result, error) => {
       
        console.log(result)
        console.log(error)

        if(error)
        {
             console.log("ERRORRRRRRRRRRR")
             alert('Wrong information ! Please insert correct inoformation')
             return
        }
        else
        {
            console.log(result)
            alert(`Required Hash is : ${result}`)
        }
    })
    console.log(this.state)


}
async handleSubmit(event){
    
    event.preventDefault()
    
    console.log(this.state)

    const { id, hash, Patient_name, _address, phone, email} = this.state
    
    this.setState({message : "Waiting for transaction result !" })

    const result = await this.state.contract.methods.newRegistrationP(id, Patient_name, _address, phone, email, hash).send({ from: this.state.account }).then((result, error) => {
         
      if(error)
      {
           alert('Wrong information ! Please insert correct inoformation')
           return
      }

    })
    
    console.log(this.state)
    this.setState({message : "Transaction successful" })

    alert(`
             ____your details____\n
              Public Key : ${id}
              NAME : ${Patient_name}
              ADDRESS : ${_address}
              PHONE : ${phone}
              EMAIL : ${email}
               `
           )
       //console.log(this.state)

    }
 
 async showDetails(event) {

     event.preventDefault()
     //console.log(this.state)

     this.setState({message : "Waiting for transaction result !" })

     const {id, hash} = this.state
     console.log(id)
     const result = await this.state.contract.methods.ViewDetailsP(id, hash).call({ from: this.state.account })

     console.log('result is',result)


     this.setState({id : result[0]})
     this.setState({Patient_name : result[1]})
     this.setState({_address : result[2]})
     this.setState({phone : result[3]})
     this.setState({email : result[4]})
 
     this.setState({message : "Transaction successful" })

     //console.log(result)
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
             
        <h1>New Registration</h1>
       
       <div>
        <h2>Get you Hash(For New Registration)</h2>

        <div>
       <label htmlFor='id'>Enter your Public Key </label>
       <input type='text'  name = 'id' onChange = {this.handleChange}/>
       </div>
       
       <div>
       <label htmlFor='name'>Patient Name</label>
       <input type = 'text' name = 'Patient_name' onChange = {this.handleChange}/>
       </div>


       <div>
       <input type = 'button' onClick = {this.getHash} value = 'Submit'/>
       </div>
       </div>

       <br></br> <br></br> 
       
       <div>
        <h2>Add Patient's Information</h2>

       <div>
       <label htmlFor='id'>Enter Your Public Key</label>
       <input type='text'  name = 'id'  onChange = {this.handleChange}/>
       </div>
       
       <div>
       <label htmlFor='hash'>Enter Your Private Key</label>
       <input type = 'text' name = 'hash' onChange = {this.handleChange}/>
       </div>

       <div>
       <label htmlFor='name'>Patient Name</label>
       <input type = 'text' name = 'Patient_name'  onChange = {this.handleChange}/>
       </div>

       <div>
       <label htmlFor='_address'>Enter Address</label>
       <input type = 'text' name = '_address' onChange = {this.handleChange}/>
       </div>

       <div>
       <label htmlFor='phoneNo'>Enter phone no</label>
       <input type = 'text' name = 'phone'  onChange = {this.handleChange}/>
       </div>

       <div>
       <label htmlFor='email'>Enter Email Id</label>
       <input type = 'text' name = 'email' onChange = {this.handleChange}/>
       </div>


       <br></br> <br></br> 
       
       <div>
       <input type = 'button' onClick = {this.handleSubmit} value = 'Register'/>
       </div>
       
       </div>
       </div>
       </div>
   )
 }
}

export default patient;

