import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  //   useEffect(() => {
  //     console.log("USER OBJECT IN useEffect:", user);
  //     if (user && user.role === "admin") {
  //       navigate("/admin/dashboard");
  //     }
  //   }, [user, navigate]);

  const validate = () => {
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setFormError("Please enter a valid email.");
      return false;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return false;
    }
    setFormError("");
    return true;
  };

  useEffect(() => {
    console.log("USER OBJECT IN useEffect:", user);
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("About to dispatch loginUser...");
    dispatch(loginUser({ email, password, role: "admin" }));
    console.log("Dispatched loginAdmin");
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>

      {error && <p className="admin-login-error">{error}</p>}

      <form onSubmit={handleSubmit} className="admin-login-form">
        <input
          type="email"
          placeholder="Email"
          className="admin-login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="admin-login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {formError && <p className="error-msg">{formError}</p>}
        <button type="submit" className="admin-login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
