import React,{useEffect} from "react";

import { useSelector } from "react-redux";

import UserNavbar from '../../components/user/UserNavbar';
import { useNavigate } from "react-router-dom";

const UserHome = ()=>{
    const {user} = useSelector((state)=>state.auth);

    const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

    return(
        <>
        <UserNavbar/>
        <div className="user-home">
           <h1>Welcome, {user?.name || "Guest"}</h1>

            <p> How are you </p>
        </div>
        </>
    )
}

export default UserHome;