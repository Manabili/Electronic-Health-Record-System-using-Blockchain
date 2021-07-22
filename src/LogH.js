import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, NavLink, Route, Switch, withRouter, Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import './App.css'
import Web3 from 'web3';
import Hospital from './abis/Hospital.json'
import Merge from './abis/Merge.json'
import history from './history';


class hospital extends Component {

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

    const networkData1 = Hospital.networks[networkId]
    const networkData2 = Merge.networks[networkId]
    
    //this.setState({networkData : networkData })
    if(networkData1) {
      const contract1 = new web3.eth.Contract(Hospital.abi, networkData1.address)
      this.setState({ contract1 })
      //console.log(contract1)

    if(networkData2) {
      const contract2 = new web3.eth.Contract(Merge.abi, networkData2.address)
      this.setState({ contract2 })
      //console.log(contract2)
    }
      //console.log(contract)
      //const HospitalHash = await contract.methods.get().call()
      //this.setState({ HospitalHash })

      //var result = await contract.methods.store_hospital_details(_id,_hos,_phone).send(function (err, result) {
       
    }
     else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

 constructor(props){
  super(props)

  this.state = {
    hos_id : '',
    doc_id : '',
    pat_id : '',
    Hospital_name : '',
    _address : '',
    phone : '',
    email : '',
    hash : '',
    doctor_info_by_hospital : '',
    patient_info_by_hospital : '',
    contract1 : '',
    contract2 : '',
    web3: '',
    account: '',
    message : '',
    networkData : ''
 };

 this.handleChange = this.handleChange.bind(this);

 this.showDetails = this.showDetails.bind(this)
 //this.showDoctorsDetails = this.showDoctorsDetails(this)
 //this.showPatientsDetails = this.showPatientsDetails(this)

}

handleChange(event){
     //event.preventDefault()
     //console.log(event)
     this.setState({
     [event.target.name] : event.target.value
    })
}


 async showDetails(event) {
     
     /*console.log('Event is : ')
     console.log(this.state)
     this.setState({id : event.target.value})
     const {id, Hospital_name, phone} = this.state*/

     //event.preventDefault()
     
     //console.log(this.state)
     console.log("Entering show details file !")
     this.setState({message : "Waiting for transaction result !" })


     const { state } = this.props.location

     //console.log('id is :', state[0])
     //console.log('hash : ', state[1])

     //alert(state[1]);

     const result = await this.state.contract1.methods.ViewDetailsH(state[0], state[1]).call({ from: this.state.account })

     console.log('result is',result)


     this.setState({hos_id : result[0]})
     this.setState({Hospital_name : result[1]})
     this.setState({_address : result[2]})
     this.setState({phone : result[3]})
     this.setState({email : result[4]})
     

     this.setState({message : "Transaction successful" })

     //console.log(result)
     alert('Result is successfully fetched from blockchain !')
 }
 

showDoctorsDetails = async(event) => {
     //event.preventDefault()
     
     //console.log(this.state)
    
     this.setState({message : "Waiting for transaction result !" })
     
     const { state } = this.props.location

     const {doc_id} = this.state
    
     const result = await this.state.contract2.methods.View_Doctors_info(state[0], doc_id).call({ from: this.state.account })

     console.log(result)


     this.setState({doctor_info_by_hospital : result})


     this.setState({message : "Transaction successful" })

    alert('Result is successfully fetched from blockchain !')  
 }

showPatientsDetails = async(event) => {

     //event.preventDefault()
     //console.log(this.state)
   
     this.setState({message : "Waiting for transaction result !" })

     const { state } = this.props.location

     const {pat_id} = this.state

     const result = await this.state.contract2.methods.View_Patients_info(state[0], pat_id).call({ from: this.state.account })

     console.log('result is',result)


     this.setState({patient_info_by_hospital : result})


     this.setState({message : "Transaction successful" })

     alert('Result is successfully fetched from blockchain !')  
}

myfunction(event) {
  var x = document.getElementById("hos_hidden");
  if (x.style.display === "block") {
    x.style.display = "show";
  } else {
    x.style.display = "block";
  }
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
       <h2>View Hospital's Details</h2>
       
       <div>
       <input type = 'button' onClick = {() => {this.showDetails(); this.myfunction()}} value = 'View Details'/>
       </div>
  
       <hr />
        
        <h1>{this.state.message}</h1>
      <hr />
      
      <div id = "hos_hidden" style = {{display : 'none'}}>
      
      
        <p>Hospital's Public Key: {this.state.hos_id}</p>
        <p>Hospital Name : {this.state.Hospital_name}</p>
        <p>Adress : {this.state._address}</p>
        <p>Contact no : {this.state.phone}</p>
        <p>Email Id : {this.state.email}</p>
      
      </div>

     </div>
     
      <div>
     <h2> View Doctor's Details from Hospital</h2>

       <div>
       <label htmlFor='doc_id'>Enter Doctor's Public Key</label>
       <input type = 'text' name = 'doc_id' onChange = {this.handleChange}/>
       </div>
      
       <div>
       <input type = 'button' onClick = {this.showDoctorsDetails} value = 'Submit'/>
       </div>

       <p>Doctor's details : {this.state.doctor_info_by_hospital}</p>

       </div>

       <div>
      <h2> View Patient's Details from Hospital</h2>


       <div>
       <label htmlFor='pat_id'>Enter Patient's Public Key</label>
       <input type = 'text' name = 'pat_id' onChange = {this.handleChange}/>
       </div>
       
       <div>
       <input type = 'button' onClick = {this.showPatientsDetails} value = 'Submit'/>
       </div>

       <p>Patient's details  : {this.state.patient_info_by_hospital}</p>

       </div>
     
     </div>
     
   )
 }
}

export default hospital;


