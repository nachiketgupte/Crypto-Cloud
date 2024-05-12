import React from "react";

function adminDisplay(params) {
    return (<div className='card p-3 m-3'>
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
  </div>)
}

export default adminDisplay;