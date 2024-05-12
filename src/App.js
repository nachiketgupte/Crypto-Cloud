import Web3 from 'web3';
import './App.css';
import { useState, useEffect } from 'react';
import contractAbi from './MainContractAbi.json';
import axios from "axios";
import CryptoJS from 'crypto-js';
import * as FileSaver from 'file-saver';

function App() {
  const [web3, setWeb3] = useState(null);
  const [mainContract, setMainContract] = useState(null);
  const [userRoles, setUserRoles] = useState();
  const [userAddress, setUserAddress] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [createUserStatus, setCreateUserStatus] = useState(null);
  const [hash, setHash] = useState('');
  const [file, setFile] = useState('');
  const [address, setAddress] = useState('');
  const [pinataUrl, setpinataUrl] = useState('');
  const [url, setUrl] = useState('');
  const [deleteUrl, setDeleteUrl] = useState('');
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [selectedDepartment, setSelectedDepartment] = useState('cardiology');
  const [selectedModifier, setSelectedModifier] = useState('AND');
  const [policy, setPolicy] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  const [fileDeleteStatus, setFileDeleteStatus] = useState(null);


const handleFileUpload = async (e) => {
  e.preventDefault();
  console.time('handleFileUpload');
  const uploadPolicy = "role:" + selectedRole + " " + selectedModifier + " " + "department:" +  selectedDepartment;
  setPolicy(uploadPolicy)
    const accounts = await web3.eth.getAccounts();
    const selectedAddress = accounts[0];
    const res = await mainContract.methods.doesUserExist(selectedAddress).call();
    if(!res) {
      console.log("User doesn't exist", res);
      setFileUploadError('Only registered users can upload documents');
      return;
    }
    const fileData = new FormData();
    fileData.append("file", file);
    fileData.append("attributes", uploadPolicy);
    try {
      const result = await axios.post("http://localhost:8080/file", fileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      let link = result.data.url;
      let hsh = result.data.hash;
      setHash(hsh);
      const accounts = await web3.eth.getAccounts();
      const selectedAddress = accounts[0];
      const id = link;
      console.log(id);
      // Check if MetaMask is connected
      if (!selectedAddress) {
      console.error('No MetaMask account connected');
      return;
      }
      try {
        await mainContract.methods.uploadData(hsh, uploadPolicy, link).send({ from: selectedAddress, gas: 3000000, gasPrice: '1000000000' });
        setpinataUrl(link);
        setFileUploadError(null);
      } catch (error) {
        console.log('Error uploading data', error);
      }
    } catch (error) {
      console.log(error);
    }
    console.timeEnd('handleFileUpload');
  }

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum)
        setWeb3(web3Instance);
        // Listen for changes in MetaMask accounts
        window.ethereum.on('accountsChanged', (accounts) => {
        setAddress(accounts[0]); // Update address in state
        });
        try {
          await window.ethereum.request({method:'eth_requestAccounts'})
          const accounts = await web3Instance.eth.getAccounts();
          setAddress(accounts[0]);
          const contractAddress = '0xcB222df2657DE2A9747E0D0F3470cAD54a89A537';
          const contract = new web3Instance.eth.Contract(contractAbi, contractAddress);
          setMainContract(contract)
        } catch (error) {
          console.log('Error connecting to Metamask');
        }
      } else {
        console.log('Metamask is not installed');
      }
    }
    loadWeb3();
  }, []);

  // Function to get user roles
  const getUserRoles = async () => {
    try {
      const result = await mainContract.methods.getUser(userAddress).call();
      setUserRoles(result);
      console.log(result);
    } catch (error) {
      setUserRoles('')
      console.error('Error fetching user roles:', error);
    }
  };

  // Function to create a new user
  const createNewUser = async () => {
    if (!web3 || !mainContract) {
      console.error('Web3 or contract not initialized');
      return;
    }
    const accounts = await web3.eth.getAccounts();
    const selectedAddress = accounts[0];
     // Check if MetaMask is connected
    if (!selectedAddress) {
      console.error('No MetaMask account connected');
      return;
    }
    const roles = 'role:' + selectedRole + ' AND ' + 'department:' + selectedDepartment;
    console.log(roles);
    try {
      await mainContract.methods.createNewUser(newUserAddress, roles).send({ from: selectedAddress, gas: 3000000, gasPrice: '1000000000' });
      console.log('New user created successfully');
      setCreateUserStatus(true)
    } catch (error) {
      console.error('Error creating new user:', error);
      setCreateUserStatus(false)
    }
  };

  // const uploadData = async () => {
  //   const accounts = await web3.eth.getAccounts();
  //   const selectedAddress = accounts[0];
  //   const id = link;
  //   console.log(id);
  //    // Check if MetaMask is connected
  //   if (!selectedAddress) {
  //     console.error('No MetaMask account connected');
  //     return;
  //   }
  //   try {
  //     await mainContract.methods.uploadData(hash, policy, link).send({ from: selectedAddress, gas: 3000000, gasPrice: '1000000000' });
  //   } catch (error) {
  //     console.log('Error uploading data', error);
  //   }
  // }

  const getData = async (e) => {
    e.preventDefault();
    let userRoles;
    try {
      const result = await mainContract.methods.getUser(address).call();
      userRoles = result;
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
    try {
      const response = await mainContract.methods.getData(url).call()
      console.log('The result is: ', response);
      const newFileUrl = response.url;
      const fileUrl = 'https://aqua-fast-hamster-823.mypinata.cloud/ipfs/' + newFileUrl;
      console.log(fileUrl);
      if(address.toLocaleLowerCase() === response.owner.toLocaleLowerCase()) {
        userRoles = response.policy;
      }
      const formData = new FormData();
      formData.append('url', fileUrl);
      formData.append('attributes', userRoles);
      console.log('User Roles:', userRoles);
      try {
        const result = await axios.post("http://localhost:8080/fetch", formData, {
          headers: {
          'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob'
        })
        console.log(result.data);
        const blob = new Blob([result.data]);
        FileSaver.saveAs(blob, 'downloaded_file.pdf');
        
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteFile = async (e) => {
    e.preventDefault();
    const result = await mainContract.methods.getData(deleteUrl).call();
    console.log(result);
    const fileData = new FormData();
    fileData.append("url", result.url);
    try {
      await mainContract.methods.deleteFile(deleteUrl).send({ from: address, gas: 3000000, gasPrice: '1000000000' });
      const response = await axios.post("http://localhost:8080/delete", fileData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      setFileDeleteStatus(true);
  } catch (error) {
      console.log('Error deleting file ', error);
      setFileDeleteStatus(false);
  }
  }

  const modifyPolicy = async (e) => {
    e.preventDefault();
    let fileUrl;
    let userRoles;
    let newUrl;
    let owner;

    // 1. Fetch URL
    try {
      const result = await mainContract.methods.getData(url).call();
      fileUrl = "https://aqua-fast-hamster-823.mypinata.cloud/ipfs/" + result.url;
      owner = result.owner;
      console.log('File link: ', fileUrl);
      // console.log('Owner:', owner + " " + address);
      if(address.toLocaleLowerCase() === owner.toLocaleLowerCase()) {
        userRoles = result.policy;
      } else {
        console.log('Only owner can modify policy');
        return;
      }
      console.log('Url: ', fileUrl);
    } catch (error) {
      console.log(error);
    }
    // 3. Call API
    const newPolicy = "role:" + selectedRole + " " + selectedModifier + " " + "department:" +  selectedDepartment;
    const fileData = new FormData();
    fileData.append("url", fileUrl);
    fileData.append("attributes", userRoles);
    fileData.append("policy", newPolicy);
    try {
      const result = await axios.post("http://localhost:8080/modify", fileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      newUrl = result.data.url;
      console.log(newUrl);
    } catch (error) {
      console.log(error);
    }

    // 4. Change URL in blockchain
    try {
      const result = await mainContract.methods.modifyPolicy(newPolicy, url, newUrl).send({ from: address, gas: 3000000, gasPrice: '1000000000' });
    } catch (error) {
      console.log(error);
    }

    // 5. Verify
    try {
      const result = await mainContract.methods.getData(url).call();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='container p-2'>
      <h1 className='mb-4' style={{fontWeight:'bold'}}>Crypto Cloud</h1>
      <div className='container'>
        <h3 className='mb-4' style={{fontWeight:"bold"}}>Connected to Metamask by account {address}</h3>
      </div>
      <div className='card p-3 m-3'>
        <h2 className='card-title'>Get User Attributes</h2>
        <input type="text" className='form-control mb-3' placeholder="Enter user address" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
        <button className='btn btn-outline-primary col-2 mb-3' onClick={getUserRoles}>Get Attributes</button>
        {userRoles && (
          <p style={{color:"green", fontWeight:'bold'}}>User Attributes: {userRoles}</p>
        )}
        {userRoles === '' && (
          <p style={{color:"red", fontWeight:"bold"}}>User not found</p>
        )}
      </div>
      <div className='card p-3 m-3'>
        <h2 className='card-title'>Create New User</h2>
        <input type="text" className = "form-control mb-3" placeholder="Enter new user address" value={newUserAddress} onChange={(e) => setNewUserAddress(e.target.value)} />
        <label for="roles">Choose role:</label>
        <select name="roles" id="roles" className = "form-select mb-3" value={selectedRole} onChange={(e) => {setSelectedRole(e.target.value)}}>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="patient">Patient</option>
        </select>
        <label for="department">Choose a department:</label>
        <select name="department" id="department" className = "form-select mb-3" value={selectedDepartment} onChange={(e) => {setSelectedDepartment(e.target.value)}}>
          <option value="cardiology">Cardiology</option>
          <option value="oncology">Oncology</option>
          <option value="hepatology">Hepatology</option>
          <option value="pathology">Pathology</option>
        </select>
        <button className='btn btn-outline-primary col-2' onClick={createNewUser}>Create User</button>
        {createUserStatus === true && (
          <p style={{ color: "green", fontWeight: "bold" }}>New User Created successfully</p>
        )}
        {createUserStatus === false && (
          <p style={{ color: "red", fontWeight: "bold" }}>Error creating user</p>
        )}
      </div>
      <div className='card p-3 m-3'>
        <h2>Upload your files</h2>
        <form>
        <label className='form-label' for="roles">Choose role:</label>
        <select name="roles" className='form-select mb-3' id="roles" value={selectedRole} onChange={(e) => {setSelectedRole(e.target.value)}}>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="patient">Patient</option>
        </select>
        <label className='form-label'> Choose policy: </label>
        <select className='form-select mb-3' value={selectedModifier} onChange={(e) => {setSelectedModifier(e.target.value)}}>
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <label className='form-label' for="department">Choose a department:</label>
        <select name="department" className = 'form-select mb-3' id="department" value={selectedDepartment} onChange={(e) => {setSelectedDepartment(e.target.value)}}>
          <option value="cardiology">Cardiology</option>
          <option value="oncology">Oncology</option>
          <option value="hepatology">Hepatology</option>
          <option value="pathology">Pathology</option>
        </select>
        <label className='form-label'>Upload file:</label>
          <input type='file'className='form-control mb-3' onChange={(e) => setFile(e.target.files[0])} />
          <button className='btn btn-outline-primary' onClick={handleFileUpload}>Upload</button>
        </form>
          {pinataUrl ? <p className='mt-3' style={{color:'green',fontWeight:'bolder'}}>File successfully uploaded at: <a href = {"https://aqua-fast-hamster-823.mypinata.cloud/ipfs/" + pinataUrl} target = "_blank" rel='noreferrer'>https://aqua-fast-hamster-823.mypinata.cloud/ipfs/{pinataUrl}</a> , File ID: {hash}</p> : <p>{fileUploadError}</p>}
      </div>
      <div className='card p-3 m-3'>
        <h2>Download Files</h2>
        <form>
        <input className = 'form-control mb-3' type="text" placeholder='Enter url' onChange={(e) => {setUrl(e.target.value)}}/>
          <button className='btn btn-outline-primary' onClick={getData}>Download</button>
        </form>
      </div>
      <div className='card p-3 m-3'>
        <h2>Delete File</h2>
        <form>
        <input className = 'form-control mb-3' type="text" placeholder='Enter url' onChange={(e) => {setDeleteUrl(e.target.value)}}/>
          <button className='btn btn-outline-primary' onClick={deleteFile}>Delete</button>
        </form>
        {fileDeleteStatus === true && (
          <p style={{ color: "green", fontWeight: "bold" }}>File deleted successfully</p>
        )}
        {fileDeleteStatus === false && (
          <p style={{ color: "red", fontWeight: "bold" }}>Error deleting file</p>
        )}
      </div>
      <div className='card p-3 m-3'>
        <h2>Modify Access Policy</h2>
        <form>
        <select name="roles" className='form-select mb-3' id="roles" value={selectedRole} onChange={(e) => {setSelectedRole(e.target.value)}}>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="patient">Patient</option>
        </select>
        <label className='form-label'> Choose policy: </label>
        <select className='form-select mb-3' value={selectedModifier} onChange={(e) => {setSelectedModifier(e.target.value)}}>
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <label className='form-label' for="department">Choose a department:</label>
        <select name="department" className = 'form-select mb-3' id="department" value={selectedDepartment} onChange={(e) => {setSelectedDepartment(e.target.value)}}>
          <option value="cardiology">Cardiology</option>
          <option value="oncology">Oncology</option>
          <option value="hepatology">Hepatology</option>
          <option value="pathology">Pathology</option>
        </select>
        <label className='form-label'>Enter resource ID: </label>
        <input className = 'form-control mb-3' type="text" placeholder='Enter ID' onChange={(e) => {setUrl(e.target.value)}}/>
          <button className='btn btn-outline-primary' onClick={modifyPolicy}>Modify</button>
        </form>
      </div>
    </div>
  );
}

export default App;
