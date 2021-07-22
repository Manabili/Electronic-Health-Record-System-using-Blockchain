// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.7.0;


contract Hospital {
    
     mapping(string => hospital) hospitallist; 
     
     struct hospital{
         string id;
         string hospital_name;
         string hospital_address;
         string phone;
         string email;
         bytes32 hos_hash;

     }
     hospital h;

     //Function to get private key for Hospital
     function getHashH(string memory _hos_id, string memory _hospital_name) public view returns(bytes32){
            
            require(bytes(hospitallist[_hos_id].id).length == 0, "Hospital already exists with this id");
               
            return (sha256(abi.encodePacked(_hos_id , _hospital_name, '*&^89763263')));
     }
     
     //Function to register a new Hospital to the system
     function newRegistrationH(string memory _hos_id, string memory _hospital_name, string memory _hospital_address,  string memory _phone, string memory _email, bytes32 _hash)public {
         
         
         require(bytes(hospitallist[_hos_id].id).length == 0, "Hospital already exists with this id");
         
         require(sha256(abi.encodePacked(_hos_id , _hospital_name, '*&^89763263')) == _hash, "Wrong information");


         hospitallist[_hos_id] = hospital({ id:_hos_id, hospital_name : _hospital_name, hospital_address : _hospital_address, phone : _phone, email : _email, hos_hash : _hash }) ;
         
    }
         
   //Function to view hospital details
    function ViewDetailsH(string memory _hos_id, bytes32 _hash) public view returns (string memory,string memory,string memory, string memory,string memory ){

     require(bytes(hospitallist[_hos_id].id).length != 0, "Hospital doesn't exists with this id");
     require(hospitallist[_hos_id].hos_hash == _hash, "Hospital ID and Hash doesn't match");
     
     return (hospitallist[_hos_id].id, hospitallist[_hos_id].hospital_name, hospitallist[_hos_id].hospital_address, hospitallist[_hos_id].phone, hospitallist[_hos_id].email);
     
    }           
    
}