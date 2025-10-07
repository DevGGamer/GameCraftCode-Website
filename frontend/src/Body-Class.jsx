import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function BodyClassHandler() {
  const location = useLocation();

  useEffect(() => {
    // удаляем все возможные классы
    document.body.classList.remove("start-page", "login-page");
    
    // добавляем класс в зависимости от маршрута
    if (location.pathname === "/") {
      document.body.classList.add("landing");
    } else if (location.pathname === "/login") {
      document.body.classList.add("platform");
    }
  }, [location]);

  return null; // компонент ничего не рендерит
}

export default BodyClassHandler;
