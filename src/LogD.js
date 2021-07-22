import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, NavLink, Route, Switch, withRouter, Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import Merge from './abis/Merge.json';

import history from './history';

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class doctor extends Component {

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
    hos_id : '',
    doc_id : '',
    pat_id : '',
    doc_hash : '',
    Doctor_name : '',
    phone : '',
    email : '',
    _address : '',
    dept : '',
    date : '',
    contract : '',
    web3: '',
    account: '',
    message : '',
    networkData : '',
    buffer : '',
    IpfsHash: ''
 };

 this.handleChange = this.handleChange.bind(this);
 this.captureFile = this.captureFile.bind(this);
 this.showDetails = this.showDetails.bind(this)
}

handleChange(event){
     event.preventDefault()
     //console.log(event)
     this.setState({
     [event.target.name] : event.target.value
    })
}

 
 async showDetails(event) {

     //event.preventDefault()
     //console.log(this.state)
     
     console.log("Entering show details file !")
     this.setState({message : "Waiting for transaction result !" })


     const { state } = this.props.location

     const result = await this.state.contract.methods.ViewDetailsD(state[0], state[1]).call({ from: this.state.account })

     console.log('result is',result)


     this.setState({id : result[0]})
     this.setState({Doctor_name : result[1]})
     this.setState({_address : result[2]})
     this.setState({phone : result[3]})
     this.setState({email : result[4]})
     this.setState({dept : result[5]})

     this.setState({message : "Transaction successful" })

     alert('Result is successfully fetched from blockchain !')
      //console.log(result)
 }
 
 captureFile = (event) => {
  //event.preventDefault()

  console.log('photo submitted !')
  const file = event.target.files[0]
  const reader = new window.FileReader()
  console.log(reader.readAsArrayBuffer(file))
  reader.onloadend = () => {
    this.setState({ buffer: Buffer(reader.result) })
    console.log('buffer', this.state.buffer)
  }
  console.log(event.target.files)
}

 addRecord = (event) => {

  //event.preventDefault()
  const { state } = this.props.location

  const {hos_id, pat_id, date, buffer} = this.state;

  console.log('Submitting the file...')
  //const result = await ipfs.add(buffer);

  ipfs.add(buffer, (error, result) => {

    console.log('IPFS result', result)


   if(error){
     console.error(error)
     return
   }
 //here is the callback
    this.state.contract.methods.Add_record(hos_id, pat_id, state[0], date, result[0].hash).send({ from: this.state.account }).then((r) => {
       //return this.setState({ IpfsHash: result[0].hash })
   })

   console.log(result[0].hash)
   
 })

 

}

/*getCombinedHash = async(event) => {
    
  //console.log(contract)
  console.log(this.state)
  const result = await this.state.contract.methods.get_combined_hash().call({ from: this.state.account })

  this.setState({Combined_hash : result})

  alert(`Combined Hash : ${result}`)
  this.setState({message : "Transaction successful" })
}

createCombinedHash = (event) => {

   //event.preventDefault()

   const { state } = this.props.location

   const {pat_id, date} = this.state

   this.setState({message : "Waiting for transaction result !" })

   this.state.contract.methods.create_combined_hash(pat_id, state[0], state[1], date).send({ from: this.state.account }).then((result) => {

  })

}*/


viewAsDoctor = async(event) => {

  this.setState({IpfsHash : ''})
  //event.preventDefault();
  const { state } = this.props.location
  
  //console.log(state)

  const {pat_id, date} = this.state
  console.log(pat_id, state[0], state[1], date)

  this.setState({message : "Waiting for Ipfs !" })

  const result = await this.state.contract.methods.view_record_as_doctor(pat_id, state[0], date).call({ from: this.state.account });
  

  this.setState({IpfsHash : result})
  
  console.log(this.state.IpfsHash)

  //this.setState({IpfsHash : result})
}

myfunction(event) {
  var x = document.getElementById("doc_hidden");
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
       <h2>View Doctor's Details</h2>

       <input type = 'button' onClick = {() => {this.showDetails(); this.myfunction()}} value = 'View Details'/>
       </div>
  
       <hr />
        
        <h1>{this.state.message}</h1>
      
      
      <hr />
      <div id = "doc_hidden" style = {{display : 'none'}}>
        <p>Doctor's Public Key : {this.state.doc_id}</p>
        <p>Doctor Name : {this.state.Doctor_name}</p>
        <p>Doctor's Address : {this.state._address}</p>
        <p>Contact no : {this.state.phone}</p>
        <p>Email address : {this.state.email}</p>
        <p>Department : {this.state.dept}</p>
     
     </div>

     <div>
        <h2> Add records </h2>

        <div>
       <label htmlFor='hos_id'>Enter Hospital's Public Key  </label>
       <input type='text'  name = 'hos_id' onChange = {this.handleChange}/>
       </div>

        <div>
       <label htmlFor='pat_id'>Enter Patient's Public Key </label>
       <input type='text'  name = 'pat_id' onChange = {this.handleChange}/>
       </div>
       
       <div>
        <label htmlFor='date'>Enter Date </label>
        <input type = 'text' name = 'date' onChange = {this.handleChange}/>
        </div>
     
      
         <div>
        <label htmlFor='buffer'>Upload Files Here </label>
        <input type = 'file' name = 'buffer' onChange = {this.captureFile}/>
        </div>

            
       <div>
       <input type = 'button' onClick = {this.addRecord} value = 'Submit'/>
       </div>
      </div>

      <div>
       <h2>View Records as Doctor</h2>

       <div>
       <label htmlFor='pat_id'>Enter Patient's Public Key  </label>
       <input type='text'  name = 'pat_id' onChange = {this.handleChange}/>
       </div>

       <div>
        <label htmlFor='date'>Enter Date </label>
        <input type = 'text' name = 'date' onChange = {this.handleChange}/>
        </div>

       <div>
       <input type = 'button' onClick = {this.viewAsDoctor} value = 'Submit'/>
       </div>
       
       <a href = {`https://ipfs.infura.io/ipfs/${this.state.IpfsHash}`} target="_blank" rel="noopener noreferrer"> Your Record is ready ! Click Here to Check </a>
       </div>

       <br></br>
       <hr/>
       
  
     
       <hr />

       <p>Ipfs is : {this.state.IpfsHash}</p>
     </div>
   )
 }
}

export default doctor;

