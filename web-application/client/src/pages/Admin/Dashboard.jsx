import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Welcome Admin 👋</h1>
      <p>Logged in as: <strong>{user?.name}</strong></p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
