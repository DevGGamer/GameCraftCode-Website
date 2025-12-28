import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import './Account.css'
import { useState, useEffect } from "react";
import axios from "axios";

const host_name = 'http://localhost';

function Account()
{
    const { id } = useParams();

    const [showOverlay, setShowOverlay] = useState(false);
    const [showText, setShowText] = useState(false);
    const [userName, setUserName] = useState("");

    const location = useLocation();
    const [pages, setPages] = useState([])

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.get(`${host_name}:8000/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            setPages(GetPages(response.data.role, id));
            setUserName(response.data.userInfo.name)
          })
          .catch((error) => {
            console.log(error);
          });

          const justLoggedIn = localStorage.getItem('justLoggedIn');
          if (justLoggedIn === 'true')
              setShowOverlay(true);
          
          localStorage.removeItem('justLoggedIn');
          
          const textTimer = setTimeout(() => {
              setShowText(true);
            }, 500);
      
            const overlayTimer = setTimeout(() => {
              setShowOverlay(false);
            }, 4000);
      
            return () => {
              clearTimeout(textTimer);
              clearTimeout(overlayTimer);
            };
      }, [id]);

    return (
        <>
        {
            showOverlay && (
                <div className="welcome-overlay fade-in-out">
                    <h1 className={`welcome-text ${showText ? 'fade-in-out' : ''}`}>Добро пожаловать{userName !== '' ? `, ${userName}` : "" }!</h1>
                </div>
            )
        }
        <div className={`account-page-container ${showOverlay ? 'blurred' : ''}`}>
            {/* Навигация между вложенными страницами */}
            <nav>
                <div className="navigation-account-buttons-container">
                    {
                    pages.map((page, index) => {
                        const isActive = location.pathname === page.link;
                        return (
                            <Link to={page.link}  key={index}>
                                <div className={`navigation-account-button ${isActive ? "selected-account-mode" : ""}`}>
                                    {page.pageName}
                                </div>
                            </Link>
                        );
                    })
                }
                </div>
            
                <Link to="/" id="quit-button" onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userRole");
                        localStorage.removeItem("justLoggedIn");
                    }}>
                    <div className="quit-button-container">
                        Выйти из аккаунта
                    </div>
                </Link>
            </nav>

            <div className="account-mode">
                <Outlet />
            </div>
        </div>
        </>
    );
}

function GetPages(role, userID)
{
    switch (role)
    {
        case "admin":
            return [
                {
                    "pageName" : "Профиль",
                    "link" : `/admin/${userID}/profile`
                },
                {
                    "pageName" : "Расписание",
                    "link" : `/admin/${userID}/shedule`
                },
                {
                    "pageName" : "Курсы",
                    "link" : `/admin/${userID}/courses`
                },
                {
                    "pageName" : "Ученики",
                    "link" : `/admin/${userID}/students`
                },
                {
                    "pageName" : "Пользователи",
                    "link" : `/admin/${userID}/adminPanel`
                },
                {
                    "pageName" : "Настройки",
                    "link" : `/account/${userID}/settings`
                }
            ];
        
        case "student":
            return [
                {
                    "pageName" : "Профиль",
                    "link" : `/account/${userID}/profile`
                },
                {
                    "pageName" : "Расписание",
                    "link" : `/account/${userID}/shedule`
                },
                {
                    "pageName" : "Обучение",
                    "link" : `/account/${userID}/education`
                },
                {
                    "pageName" : "Настройки",
                    "link" : `/account/${userID}/settings`
                }
            ];

        case "teacher":
            return [
                {
                    "pageName" : "Профиль",
                    "link" : `/account/${userID}/profile`
                },
                {
                    "pageName" : "Расписание",
                    "link" : `/account/${userID}/shedule`
                },
                {
                    "pageName" : "Ученики",
                    "link" : `/account/${userID}/students`
                }
            ];
    }
}

export default Account;