import './Login.css';
import LoginBG from '../../assets/LoginBG.png';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaUser } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import axios from "axios";


const host_name = 'https://gamecraftcode.pro';

function Login() {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const checkToken = async () => {
            try {
                const res = await fetch(`${host_name}:8080/api/protected`, {
                  headers: {
                    authorization: `Bearer ${token}`
                  }
                });
    
                if (!res.ok)
                    return;
          
                const data = await res.json();
                localStorage.setItem('justLoggedIn', 'true'); 

                if (data.role === "admin")
                    navigate(`/admin/${data.user.id}/profile`);
                else
                    navigate(`/account/${data.user.id}/profile`);
              } catch (err) {
                
              }
            }
        
        checkToken();
      }, []);

    const [showPassword, setShowPassword] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        axios.post(`${host_name}:8080/api/login`,
            {
                login, 
                password
            }
        )
        .then((response) => {
            const { token, user } = response.data;

            localStorage.setItem('justLoggedIn', 'true'); 
            localStorage.setItem("token", token);
            
            if (user.role === "admin")
                navigate(`/admin/${user.id}/profile`);
            else
                navigate(`/account/${user.id}/profile`);
          })
          .catch((error) => {
            console.error("Login error:", error);
            if (error.response) {
              console.log("Response data:", error.response.data);
              console.log("Status:", error.response.status);
            } else if (error.request) {
              console.log("No response received:", error.request);
            } else {
              console.log("Request error:", error.message);
            }
          });
    };

    return (
        <div className='page-container'>
            <div className='dark-bg'></div>
            <div className='login-wrapper'>
                <div className='left-illustration'>
                    <div className="logo-header">
                            <img 
                                src="/logo.jpg" 
                                alt="GameCraftCode" 
                                className="school-logo"
                            />
                            <h1 className="school-name">GameCraftCode</h1>
                        </div>
                    <img src={LoginBG} alt="GameCraft illustration" />
                </div>

                <div className="login-container">
                    <div className='login-fields'>
                        <h2 className="logo"><span>#</span>Личный кабинет</h2>

                        <div className="input-group">
                            <input type="text" placeholder="Имя пользователя" onChange={(event) => setLogin(event.target.value)}/>
                            <FaUser className="icon" />
                        </div>

                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} placeholder="Пароль" onChange={(event) => setPassword(event.target.value)}/>
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <IoEyeOutline color="#00d6ff"/> : <IoEyeOffOutline color="#00d6ff"/>}
                            </span>
                        </div>

                        <button className='login-button' onClick={handleSubmit}>Войти</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
