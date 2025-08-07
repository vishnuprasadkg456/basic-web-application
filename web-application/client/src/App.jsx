import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserAuth from "./pages/User/UserAuth";
import AdminLogin from "./pages/Admin/AdminLogin";
import UserHome from "./pages/User/UserHome";
import UserProfile from "./pages/User/UserProfile";
import AdminDashboard from "./pages/Admin/Dashboard";



function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */} 
        <Route path="/login" element={<UserAuth />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        
        {/* user protected routes */}

        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/profile" element={<UserProfile />} />



        {/* admin protected routes */}



            
        

         <Route path="/admin/dashboard" element={<AdminDashboard />} />

          
       
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
