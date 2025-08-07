import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import '../../styles/UserNavbar.css'


const UserNavbar = ()=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () =>{
    dispatch(logoutUser()); // clear user from redux
    // localStorage.removeItem("user"); 
    navigate("/login");
  }

  const handleprofileClick = () =>{
    navigate('/user/profile');
  };

  return(
    <div className="user-navbar">
      <div className="logo">🌐</div>
      <div className="profile-icon" onClick={handleprofileClick} >
        👤
        
      </div>
      <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
    </div>
  )

}

export default UserNavbar;