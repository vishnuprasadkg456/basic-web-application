import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import axios from "axios";
import UserNavbar from "../../components/user/UserNavbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import { logoutUser } from "../../features/auth/authSlice";
import "../../styles/userProfile.css";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = user?.token;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  // console.log("Token",token);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  // console.log("Profile image:", profile.profileImage);

  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Frontend sending token:", token);

        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          name: res.data.name,
          email: res.data.email,
          profileImage: res.data.profileImage || "",
        });

        console.log("profile fetched", res.data);
      } catch (err) {
        console.log(
          " Error fetching profile:",
          err.response?.status,
          err.response?.data
        );

        if (err.response?.status === 401) {
          dispatch(logoutUser());
          navigate("/login");
        } else {
          setMessage("Failed to load profile");
        }
        
      }
    };
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", profile.name);
    if (password) formData.append("password", password);
    if (selectedFile) formData.append("profileImage", selectedFile);

    try {
      const res = await axios.put("/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("profile updated succefully");
      setPassword("");

      setProfile({
        name: res.data.name,
        email: res.data.email,
        profileImage: res.data.profileImage || "",
      });
      console.log("profile fetched after handle submit ", res.data);

      dispatch(
        setUser({
          ...user,
          user: {
            ...user.user,
            name: res.data.name,
            profileImage: res.data.profileImage,
          },
        })
      );
    } catch (err) {
      if (err.response?.status === 401) {
    dispatch(logoutUser());
    navigate("/login");
  } else {
    setMessage("Update failed");
  }
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="profile-page">
        <h2>Profile</h2>
        {message && <p className="profile-message">{message}</p>}
        <form onSubmit={handleSubmit} className="profile-form">
          <img
            src={profile.profileImage || "/no-image.png"}
            alt="Profile"
            className="profile-img"
          />

          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            accept="image/*"
          />

          <input
            name="name"
            type="text"
            autoComplete="off"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Name"
          />

          <input
            type="email"
            value={profile.email}
            readOnly
            disabled
            autoComplete="off"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="New Password"
          />

          <button type="submit"> Update Profile</button>
        </form>
      </div>
    </>
  );
};
export default UserProfile;
