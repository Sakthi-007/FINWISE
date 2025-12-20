import React from 'react'
import { NavLink } from 'react-router'
import "../styles/navbar.css"

const logout=()=>{
    console.log("log out function");
}

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-logo">FINWISE</div>
        <ul className="navbar-links">
            <li><NavLink to={"/"}>Dashboard</NavLink></li>
            <li><NavLink to={"/transactions"}>Transactions</NavLink></li>
            <li><NavLink to={"/upload"}>Upload</NavLink></li>
        </ul>
        {/* <button onClick={logout}>Logout</button> */}
        <button className="navbar-logout" onClick={logout}>Logout</button>
    </div>
  )
}

export default Navbar
