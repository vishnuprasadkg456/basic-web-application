import { useState,useEffect } from "react";

import { useDispatch,useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import '../../styles/UserAuth.css'

const UserAuth = () =>{
    const [isLoginMode,setIsLoginMode]=useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user,loading}=useSelector((state)=>state.auth);
    const [error,setError] = useState('');

    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:'',
    });

    const toggleMode = () => {
        setError('');
        setIsLoginMode(!isLoginMode);
    }

    const handleChange = (e)=>{
        setFormData((prev)=>({
            ...prev,
            [e.target.name]:e.target.value,
        }));
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');

        if(isLoginMode){  // login
            dispatch(loginUser({
                email:formData.email,
                password:formData.password,
                role:'user'
            }));
        }else{
              
            try{
                await axios.post('/api/auth/user/register',formData);
                dispatch(loginUser({
                    email: formData.email,
                    password:formData.password,
                    role:'user'
                }));
            }catch(err){
                setError(err.response?.data?.message||"Signup Failed");
            }
        }

    };

    // useEffect(()=>{
    //     if(user && user.user.role === 'user'){
    //         navigate('/user/home');
    //     }
    // },[user,navigate]);

      useEffect(()=>{
        if (user?.role === 'user'){
            navigate('/user/home');
        }
    },[user,navigate]);

    return(

        <div className="auth-page">
            <form onSubmit={handleSubmit} className="auth-form">
              <h2>{isLoginMode?'User Login' : 'Sign Up'}</h2>

              {error && (<p className="error-msg" >{error}</p>)}

              {!isLoginMode && (
                <input 
                type="text"
                name = "name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required 
                />
              )}

              <input 
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
               />

               <input 
               type="password" 
               name="password"
               placeholder="Password"
               value={formData.password}
               onChange={handleChange}
               required 
               />

               <button type="submit" disabled={loading} >
                {loading?'Please wait...' : isLoginMode? 'Login' : 'Sign up'}
               </button>
                
                <p className="toggle-text" >
                    {isLoginMode?"Don't have an account?" : 'Already have an account?' }{' '}
                    <span className="toggle-link" onClick={toggleMode}>
                        {isLoginMode?'Sign Up' : 'login'}

                    </span>
                </p>




            </form>
        </div>
    );


};

export default UserAuth;