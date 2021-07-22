import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import './App.css';
import Merge from './abis/Merge.json'

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class record extends Component {
  
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
     if(networkData) {
       const contract = web3.eth.Contract(Merge.abi, networkData.address)
       this.setState({ contract })
       //console.log(contract)
       //const IpfsHash = await contract.methods.get().call()
       //this.setState({ IpfsHash })
     } else {
       window.alert('Smart contract not deployed to detected network.')
     }
   }
   


   constructor(props) {
    super(props)

    this.state = {
      IpfsHash: '',
      hos_id : '',
      pat_id : '',
      pat_hash : '',
      doc_id : '',
      doc_hash : '',
      hash : '',
      Combined_hash : '',
      date : '',
      doctor_info_by_hospital : '',
      patient_info_by_hospital : '',
      message  : '',
      contract: '',
      web3: '',
      buffer: '',
      account: ''
    };
  
    this.handleChange = this.handleChange.bind(this)
    this.captureFile = this.captureFile.bind(this)
    //this.getCombinedHash = this.getCombinedHash.bind(this)
    //this.addRecord = this.addRecord(this)
    //this.createCombinedHash = this.createCombinedHash(this)
    //this.viewAsPatient = this.viewAsPatient(this)
    //this.viewAsDoctor = this.viewAsDoctor(this)
    //this.showDoctorsDetails = this.showDoctorsDetails(this)
    //this.showPatientsDetails = this.showPatientsDetails(this)
  }

  handleChange(event){
    event.preventDefault()
    //console.log(event)
    this.setState({
    [event.target.name] : event.target.value
   })
}

getCombinedHash = async(event) => {
    
    //console.log(contract)
    console.log(this.state)
    const result = await this.state.contract.methods.get_combined_hash().call({ from: this.state.account })

    this.setState({Combined_hash : result})
  
    alert(`Combined Hash : ${result}`)
    this.setState({message : "Transaction successful" })
}

createCombinedHash = (event) => {

     //event.preventDefault()
  
     console.log(this.state)

     const {pat_id, pat_hash, doc_id, doc_hash, date} = this.state
  
     this.setState({message : "Waiting for transaction result !" })

     this.state.contract.methods.create_combined_hash(pat_id, pat_hash, doc_id, doc_hash, date).send({ from: this.state.account }).then((result) => {

    })

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
  
     const {hos_id, pat_id, pat_hash, doc_id, doc_hash, date, buffer} = this.state;

     console.log('Submitting the file...')
     //const result = await ipfs.add(buffer);
  
     ipfs.add(buffer, (error, result) => {

       console.log('IPFS result', result)
       //const IpfsHash = result[0].hash

        //this.setState({ IpfsHash })

      if(error){
        console.error(error)
        return
      }
    //here is the callback
       this.state.contract.methods.Add_record(hos_id, pat_id, pat_hash, doc_id, doc_hash, date, result[0].hash).send({ from: this.state.account }).then((r) => {
          //return this.setState({ IpfsHash: result[0].hash })
      })
    })

 
}

viewAsDoctor = async(event) => {
    //event.preventDefault();
    const {Combined_hash} = this.state;
    this.setState({message : "Waiting for Ipfs !" })

    const result = await this.state.contract.methods.view_record_as_doctor(Combined_hash).call({ from: this.state.account });
    
  
    console.log(result)

    this.setState({IpfsHash : result})
}

viewAsPatient = async(event) => {
    
    console.log(this.state);
    
    const {pat_id, pat_hash, date} = this.state;
    this.setState({message : "Waiting for Ipfs !" })

    const result = await this.state.contract.methods.view_record_as_patient(pat_id, pat_hash, date).call({ from: this.state.account });
 
    console.log(result)

    this.setState({IpfsHash : result})
}


render() {
  return (
      <div>

      <div>
        <h2> Add records </h2>

        <div>
       <label htmlFor='hos_id'>Enter Hospital's ID</label>
       <input type='text'  name = 'hos_id' onChange = {this.handleChange}/>
       </div>

        <div>
       <label htmlFor='pat_id'>Enter Patient's ID</label>
       <input type='text'  name = 'pat_id' onChange = {this.handleChange}/>
       </div>
       
       <div>
       <label htmlFor='pat_hash'>Enter Patient's Hash</label>
       <input type = 'text' name = 'pat_hash' onChange = {this.handleChange}/>
       </div>

       <div>
       <label htmlFor='doc_id'>Enter Doctor's ID</label>
       <input type = 'text' name = 'doc_id' onChange = {this.handleChange}/>
       </div>
       
       <div>
       <label htmlFor='doc_hash'>Enter Doctor's Hash</label>
       <input type = 'text' name = 'doc_hash' onChange = {this.handleChange}/>
       </div>
       
       <div>
        <label htmlFor='date'>Enter Date </label>
        <input type = 'text' name = 'date' onChange = {this.handleChange}/>
        </div>
     
      
         <div>
        <label htmlFor='buffer'>Upload Files Here</label>
        <input type = 'file' name = 'buffer' onChange = {this.captureFile}/>
        </div>

            
       <div>
       <input type = 'button' onClick = {this.addRecord} value = 'Submit'/>
       </div>
      </div>


       <hr />
       
       <div>

        <h2>View Records as Patient</h2>

        <div>
       <label htmlFor='pat_id'>Enter Patient's ID</label>
       <input type='text'  name = 'pat_id' onChange = {this.handleChange}/>
       </div>

        <div>
        <label htmlFor='pat_hash'>Enter Your Hash</label>
        <input type = 'text' name = 'pat_hash' onChange = {this.handleChange}/>
        </div>
        
        <div>
        <label htmlFor='date'>Enter Date </label>
        <input type = 'text' name = 'date' onChange = {this.handleChange}/>
        </div>

       <div>
       <input type = 'button' onClick = {this.viewAsPatient} value = 'Submit'/>
       </div>
       
       
       <a href = {`https://ipfs.infura.io/ipfs/${this.state.IpfsHash}`}> Your Record is ready ! Click Here to Check </a>
      </div>
      
      <div>
       <h2>View Records as Doctor</h2>
       
       <div>
         <h3>Get Combined Hash for this session</h3>

       <div>
       <label htmlFor='pat_id'>Enter Patient's ID</label>
       <input type='text'  name = 'pat_id' onChange = {this.handleChange}/>
       </div>
       
       <div>
       <label htmlFor='pat_hash'>Enter Patient's Hash</label>
       <input type = 'text' name = 'pat_hash' onChange = {this.handleChange}/>
       </div>

       <div>
       <label htmlFor='doc_id'>Enter Doctor's ID</label>
       <input type = 'text' name = 'doc_id' onChange = {this.handleChange}/>
       </div>
       
       <div>
       <label htmlFor='doc_hash'>Enter Doctor's Hash</label>
       <input type = 'text' name = 'doc_hash' onChange = {this.handleChange}/>
       </div>
       
       <div>
        <label htmlFor='date'>Enter Date </label>
        <input type = 'text' name = 'date' onChange = {this.handleChange}/>
        </div>
   
       <div>
       <input type = 'button' onClick = {() => {this.createCombinedHash(); this.getCombinedHash();}} value = 'Submit'/>
       </div>
       </div>
       
       <p>Combined Hash is : {this.state.Combined_hash}</p>
  
        <div>
         <h3>Combined Hash !</h3>

        <div>
        <label htmlFor='Combined_hash'>Enter Combined Hash </label>
        <input type = 'text' name = 'Combined_hash' onChange = {this.handleChange}/>
       </div>
       
       <div>
       <input type = 'button' onClick = {this.viewAsDoctor} value = 'Submit'/>
       </div>
       
       <a href = {`https://ipfs.infura.io/ipfs/${this.state.IpfsHash}`}> Your Record is ready ! Click Here to Check </a>
       
       <br></br>
       <hr/>
       
     </div>
     </div>

     
     </div>
  );
 }
}
export default record;





//img src={`https://ipfs.infura.io/ipfs/${this.state.IpfsHash}`}


/*    const networkData1 = Hospital.networks[networkId]
    const networkData2 = Merge.networks[networkId]
    
    //this.setState({networkData : networkData })
    if(networkData1) {
      const contract1 = new web3.eth.Contract(Hospital.abi, networkData1.address)
      this.setState({ contract1 })
      console.log(contract1)

    if(networkData2) {
      const contract2 = new web3.eth.Contract(Merge.abi, networkData2.address)
      this.setState({ contract2 })
      console.log(contract2)
    }
    
    showDoctorsDetails = async(event) => {
     //event.preventDefault()
     
     console.log(this.state)
    
     this.setState({message : "Waiting for transaction result !" })

     const {hos_id, doc_id} = this.state
    
     const result = await this.state.contract.methods.View_Doctors_info(hos_id, doc_id).call({ from: this.state.account })

     console.log(result)


     this.setState({doctor_info_by_hospital : result})


     this.setState({message : "Transaction successful" })

    alert('Result is successfully fetched from blockchain !')  
 }

showPatientsDetails = async(event) => {

     //event.preventDefault()
     //console.log(this.state)
   
     this.setState({message : "Waiting for transaction result !" })


     const {hos_id, pat_id} = this.state

     const result = await this.state.contract.methods.View_Patients_info(hos_id, pat_id).call({ from: this.state.account })

     console.log('result is',result)


     this.setState({patient_info_by_hospital : result})


     this.setState({message : "Transaction successful" })

     alert('Result is successfully fetched from blockchain !')  
}



    <div>
     <h2> View Doctor's Details from Hospital</h2>

      <div>
       <label htmlFor='hos_id'>Enter Hospital ID</label>
       <input type='text'  name = 'hos_id' onChange = {this.handleChange}/>
       </div>

       <div>
       <label htmlFor='doc_id'>Enter Doctor's ID</label>
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
       <label htmlFor='hos_id'>Enter Hospital ID</label>
       <input type='text'  name = 'hos_id' onChange = {this.handleChange}/>
       </div>

       <div>
       <label htmlFor='pat_id'>Enter Patient's ID</label>
       <input type = 'text' name = 'pat_id' onChange = {this.handleChange}/>
       </div>
       
       <div>
       <input type = 'button' onClick = {this.showPatientsDetails} value = 'Submit'/>
       </div>

       <p>Patient's details  : {this.state.patient_info_by_hospital}</p>

       </div>

       */