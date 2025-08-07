import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const { user } = useSelector((state) => state.auth);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
