import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null); // null for create, user object for edit
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUsers = async (keyword = "") => {
    try {
      setError("");
      const token = user?.token;
      const res = await axios.get(`/api/admin/users${keyword ? `?keyword=${keyword}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    if (user?.token) fetchUsers();
  }, [user?.token]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/admin/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const openCreateModal = () => {
    setModalUser(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = user?.token;
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(search);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Modal form submit handler (for both create and edit)
  const handleModalSubmit = async (formData) => {
    try {
      const token = user?.token;
      if (modalUser) {
        // Edit
        await axios.put(`/api/admin/users/${modalUser._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create
        await axios.post(`/api/admin/users`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      fetchUsers(search);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save user");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Welcome Admin 👋</h1>
      <p>
        Logged in as: <strong>{user?.name}</strong>
      </p>
      <button onClick={handleLogout}>Logout</button>
      <hr />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>All Users</h2>
        <button onClick={openCreateModal}>+ Create User</button>
      </div>
      <form onSubmit={handleSearch} style={{ margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.5rem", width: "60%" }}
        />
        <button type="submit" style={{ marginLeft: "1rem" }}>Search</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4}>No users found.</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => openEditModal(u)}>Edit</button>
                  <button onClick={() => handleDelete(u._id)} style={{ marginLeft: "0.5rem", background: "red" }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Create/Edit */}
      {showModal && (
        <UserModal
          user={modalUser}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

// Simple modal component for create/edit user
const UserModal = ({ user, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff", padding: "2rem", borderRadius: "8px", minWidth: "300px"
      }}>
        <h3>{user ? "Edit User" : "Create User"}</h3>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={{ width: "100%", margin: "0.5rem 0" }} />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required style={{ width: "100%", margin: "0.5rem 0" }} />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required={!user} style={{ width: "100%", margin: "0.5rem 0" }} />
        <select name="role" value={form.role} onChange={handleChange} style={{ width: "100%", margin: "0.5rem 0" }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div style={{ marginTop: "1rem" }}>
          <button type="submit">{user ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose} style={{ marginLeft: "1rem" }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;