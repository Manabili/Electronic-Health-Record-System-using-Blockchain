// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.7.0;

contract Merge {
     
    mapping(string => mapping(string => string)) dateToIpfsPatient;         //map to store ipfs of records
    mapping(string => mapping(string => string)) doctorsInfo_in_hospital;   //map to store doctor's details in hospital
    mapping(string => mapping(string => string)) patientsInfo_in_hospital;  //map to store patient's details in hospital
    
    mapping(string => doctor) doctorlist;           //map to store doctor's details
    mapping(string => patient) patientlist;         //map to store patient's details
    mapping(string => bool) allowed_doctors;        //map to check if a doctor is allowed or not to view the records by patient

    bytes32 public common_hash;
   
     struct doctor {
         string doctor_id;
         string doctor_name;
         string doctor_address;
         string doctor_phone;
         string  doctor_email;
         string  doctor_dept;
         bytes32 doctor_hash;
         string[] Hash_of_visited_patients;
      }
     doctor d;
    
    struct patient{
         string patient_id;
         string patient_name;
         string patient_address;
         string patient_phone;
         string patient_email;
         bytes32 patient_hash;
         string[] Hash_of_visited_doctors;
     }
     patient p;
     
     //Function to get Private Key for Doctors
     function getHashD(string memory _id, string memory _doctor_name) public view returns(bytes32){
            
            
            require(bytes(doctorlist[_id]. doctor_id).length == 0, "Doctor already exists with this id");
         
            return (sha256(abi.encodePacked(_id , _doctor_name, '*&^')));
     }
     
     //Function to register a new Doctor to the system
     function newRegistrationD(string memory _id,string memory _doctor_name, string memory _doctor_address, string memory _phone, string memory _email,string memory _dept, bytes32 _hash)public {
         
         
         require(bytes(doctorlist[_id].doctor_id).length == 0, "Doctor already exists with this id"); 

         require(sha256(abi.encodePacked(_id , _doctor_name, '*&^')) == _hash, "Wrong Infomation");
         
         doctorlist[_id] = doctor({ doctor_id:_id, doctor_name : _doctor_name,doctor_address : _doctor_address,  doctor_phone : _phone,  doctor_email : _email,  doctor_dept : _dept, doctor_hash : _hash, Hash_of_visited_patients : new string[](0) }) ;
    }
         
    //Function to view Doctor's details
    function ViewDetailsD(string memory _id, bytes32 _hash) public view returns (string memory,string memory,string memory, string memory, string memory , string memory) {
 
     require(bytes(doctorlist[_id].doctor_id).length != 0, "Doctor doesn't exist with this id");
     require(doctorlist[_id].doctor_hash == _hash, "Doctor's ID and Hash doesn't match");
     
     return (doctorlist[_id].doctor_id, doctorlist[_id].doctor_name, doctorlist[_id].doctor_address, doctorlist[_id]. doctor_phone, doctorlist[_id]. doctor_email, doctorlist[_id]. doctor_dept);
     
    }
    
    //Function to get Private Key for Patient
    function getHashP(string memory _id, string memory _patient_name) public view returns(bytes32){
            
            require(bytes(patientlist[_id].patient_id).length == 0, "Patient already exists with this id");
               
            return (sha256(abi.encodePacked(_id ,_patient_name, '*()*)*(*_&')));
    }
     
    //Function to register a new Patient to the system
    function newRegistrationP(string memory _id, string memory _patient_name, string memory _patient_address, string memory _phone, string memory _email, bytes32 _hash)public {
         
         require(bytes(patientlist[_id].patient_id).length == 0, "Patient exists with this id");
         
         require(sha256(abi.encodePacked(_id ,_patient_name, '*()*)*(*_&')) == _hash, "Wrong Information");

         
         patientlist[_id] = patient({patient_id:_id, patient_name : _patient_name,patient_address : _patient_address, patient_phone : _phone, patient_email : _email, patient_hash : _hash, Hash_of_visited_doctors : new string[](0) }) ;


    }
         
    //Function to view Patient's details
    function ViewDetailsP(string memory _id, bytes32 _hash) public view returns (string memory,string memory,string memory, string memory, string memory ){
             
     require(bytes(patientlist[_id].patient_id).length != 0, "Patient doesn't exist with this id");
     
     require(patientlist[_id].patient_hash == _hash, "Patient's ID and Hash doesn't match");
     
     return (patientlist[_id].patient_id, patientlist[_id].patient_name, patientlist[_id].patient_address, patientlist[_id].patient_phone, patientlist[_id].patient_email);
     
    }
    
    //Function to add records 
    function Add_record(string memory h_id, string memory p_id, string memory d_id, string memory _date, string memory _ipfshash) public {

           
           require(bytes(patientlist[p_id].patient_id).length != 0, "Patient doesn't exist with this id");
           
           doctor memory d1 = doctorlist[d_id];
           patient memory p1 = patientlist[p_id];
           
           doctorsInfo_in_hospital[h_id][d_id] = string(abi.encodePacked(d1.doctor_id, ' , ', d1.doctor_name, ' , ', d1.doctor_address, ' , ',  d1.doctor_phone, ' , ', d1.doctor_email, ' , ', d1.doctor_dept));
           patientsInfo_in_hospital[h_id][p_id] = string(abi.encodePacked(p1.patient_id, ' , ', p1.patient_name, ' , ', p1.patient_address, ' , ', p1.patient_phone, ' , ', p1.patient_email));

           patientlist[p_id].Hash_of_visited_doctors.push(d_id);
            
           doctorlist[d_id].Hash_of_visited_patients.push(p_id);


           dateToIpfsPatient[p_id][_date] = _ipfshash;

    }

    //Function to give permission to a doctor (by patient) to view records
    function give_permission_to_doctor(string memory d_id) public {
              allowed_doctors[d_id] = true;
    }
    
    //Function to remove permission for a doctor(by pateint) to view records
    function remove_permission_for_doctor(string memory d_id) public {
             allowed_doctors[d_id] = false;
    }
    
    //Function to view records as a patient
    function view_record_as_patient(string memory p_id, bytes32 p_hash, string memory _date) public view returns(string memory) {
         
 
         require(patientlist[p_id].patient_hash == p_hash, "Patient's ID and Hash doesn't match");

         require(bytes(dateToIpfsPatient[p_id][_date]).length != 0 , "No Record exists for the given date");

         return dateToIpfsPatient[p_id][_date];

    } 
    
    //Function to view records as a doctor
    function view_record_as_doctor(string memory p_id, string memory d_id, string memory _date) public view returns(string memory) {

           require(bytes(patientlist[p_id].patient_id).length != 0, "Patient doesn't exist with this id");
           require(allowed_doctors[d_id] == true, "Doctor is not allowed");

           
           return dateToIpfsPatient[p_id][_date];

    }
    
    //Function to view doctor's contact details from hospital
    function View_Doctors_info(string memory _hos_id, string memory _doc_id) public view returns(string memory) {


         require(bytes(doctorlist[_doc_id].doctor_id).length != 0, "Doctor doesn't exist with this id");
         return doctorsInfo_in_hospital[_hos_id][_doc_id];
    }
    
    //Function to view patient's contact details from hospital
    function View_Patients_info(string memory _hos_id, string memory _pat_id) public view returns(string memory) {

         require(bytes(patientlist[_pat_id].patient_id).length != 0, "Patient doesn't exist with this id");
         return patientsInfo_in_hospital[_hos_id][_pat_id];
    }    
}