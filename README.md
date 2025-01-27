# Decentralized File Storage and Access Control System
This project is a decentralized application (dApp) for secure file storage, encryption, and access control using Ethereum, Attribute-Based Encryption (ABE), and Pinata IPFS. The system enables users to upload, modify, and delete files with fine-grained access policies. It also provides encryption and decryption mechanisms for data confidentiality using FAME (Functional Attribute-Based Encryption).

Table of Contents
Features
Tech Stack
Prerequisites
Setup
Usage
Smart Contract Details
Server-Side Implementation
React Front-End Features
Future Enhancements
Features
Decentralized File Storage: Uses IPFS (via Pinata) to store files securely and generate unique content hashes.
Attribute-Based Encryption: Ensures access control by encrypting files with policies like role:doctor AND department:oncology.
Smart Contract Integration: Tracks user roles, data ownership, and policies on the Ethereum blockchain.
Access Management: Allows file owners to modify access policies or delete files securely.
End-to-End Encryption: Encrypts sensitive data before uploading and decrypts it for authorized users only.
Tech Stack
Smart Contract: Solidity (deployed on Ethereum)
Frontend: React.js with Web3.js
Backend: Go (Golang) with Gin Framework
Storage: Pinata IPFS
Encryption: Attribute-Based Encryption using gofe library
Prerequisites
Node.js (>= 14.x)
Go (Golang) (>= 1.19)
Ganache or Ethereum Testnet (e.g., Sepolia, Rinkeby)
MetaMask extension installed in the browser
Pinata account with API keys
Docker (optional, for containerization)
Setup
Backend
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-repo-url.git  
cd decentralized-file-storage  
Install dependencies:

bash
Copy
Edit
go mod tidy  
Configure environment variables in backend/main.go:

Replace Pinata_api_key and Pinata_secret_api_key with your Pinata API credentials.
Run the server:

bash
Copy
Edit
go run main.go  
Smart Contract
Install Truffle or Hardhat for contract deployment.
Deploy the contract:
bash
Copy
Edit
npx hardhat run scripts/deploy.js --network sepolia  
Update the deployed contract address in the frontend and backend configurations.
Frontend
Navigate to the frontend folder:
bash
Copy
Edit
cd frontend  
Install dependencies:
bash
Copy
Edit
npm install  
Start the development server:
bash
Copy
Edit
npm start  
Usage
Connect to MetaMask and select the correct Ethereum network.
Register users with appropriate roles using the Admin Panel.
Upload files with access policies using the File Upload feature.
Modify access policies, fetch, or delete files as needed.
Smart Contract Details
Functions:

createNewUser: Registers a new user with specific roles.
uploadData: Stores file metadata and access policies on the blockchain.
modifyPolicy: Allows owners to update file access policies.
deleteFile: Deletes file metadata from the blockchain.
Events:

UserCreated: Logs when a new user is registered.
DataUploaded: Logs when a file is uploaded.
Server-Side Implementation
Key Functionalities
Encryption:

Uses FAME (Functional Attribute-Based Encryption) to encrypt files based on policies.
Pinata Integration:

Uploads and retrieves files from IPFS via Pinata APIs.
Decryption:

Decrypts files for authorized users based on their attributes.
APIs:

/encrypt: Encrypts a message based on user roles.
/file: Encrypts and uploads a file to IPFS.
/fetch: Downloads and decrypts a file.
/modify: Modifies file access policies.
React Front-End Features
MetaMask Integration:

Connects MetaMask for user authentication and transactions.
File Upload & Management:

Handles file uploads, modifications, and deletions with the backend and blockchain.
User-Friendly UI:

Displays user roles and file details with easy-to-use forms.
Real-Time Updates:

Reacts to MetaMask account changes dynamically.
Future Enhancements
Role-Based Dashboards: Create distinct interfaces for admins and regular users.
Audit Logs: Track file access and modifications.
Layer-2 Scaling: Reduce gas costs using Polygon or Optimism.
Mobile-Friendly UI: Enhance accessibility for mobile users.
