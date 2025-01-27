# Decentralized File Storage and Access Control System

This project is a decentralized application (dApp) for secure file storage, encryption, and access control using **Ethereum**, **Attribute-Based Encryption (ABE)**, and **Pinata IPFS**. The system enables users to upload, modify, and delete files with fine-grained access policies. It also provides encryption and decryption mechanisms for data confidentiality using FAME (Functional Attribute-Based Encryption).

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Setup](#setup)  


---

## Features

- **Decentralized File Storage**: Uses IPFS (via Pinata) to store files securely and generate unique content hashes.
- **Attribute-Based Encryption**: Ensures access control by encrypting files with policies like `role:doctor AND department:oncology`.
- **Smart Contract Integration**: Tracks user roles, data ownership, and policies on the Ethereum blockchain.
- **Access Management**: Allows file owners to modify access policies or delete files securely.
- **End-to-End Encryption**: Encrypts sensitive data before uploading and decrypts it for authorized users only.

---

## Tech Stack

- **Smart Contract**: Solidity (deployed on Ethereum)
- **Frontend**: React.js with Web3.js
- **Backend**: Go (Golang) with Gin Framework
- **Storage**: Pinata IPFS
- **Encryption**: Attribute-Based Encryption using `gofe` library

---

## Prerequisites

1. Node.js (>= 18.x)
2. Go (Golang) (>= 1.19)
3. Ganache
4. MetaMask extension installed in the browser
5. Pinata account with API keys
6. Postman

---

## Setup

### Backend

1. Clone the repository:

   ```bash
   git clone https://github.com/nachiketgupte/Crypto-Cloud.git
   cd decentralized-file-storage
2. Install Dependencies:
   
   ```bash
   go mod tidy
  
3. Run the server:
   
   ```bash
   go run main.go

### Smart Contract Details

The smart contract is implemented in Solidity and deployed on the Ethereum blockchain. It manages user roles, file metadata, access policies, and ownership in a secure and decentralized manner.

1. Install Truffle:

   ```bash
   npm install -g truffle

2. Install Ganache:
   ```bash
   npm install -g ganache

3. Navigate to main directory and initialize truffle:
   ```bash
   truffle init

4. Compile the Solidity Smart COntract to generate the ABI and the Byte Code

   ```bash
   truffle compile

5. Open the Ganache GUI/CLI
   ```
   ganache
6. Deploy the contracts to the Ganache network
   ```
   truffle migrate --network development
### Run the front-end application

1. Install the node modules:

   ```
   npm install
2. Run the application:

   ```
   npm start
