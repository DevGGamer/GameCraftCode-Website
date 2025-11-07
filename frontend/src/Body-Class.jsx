import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function BodyClassHandler() {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.remove("landing", "platform");
    
    if (location.pathname === "/") {
      document.body.classList.add("landing");
    } else if (location.pathname === "/login") {
      document.body.classList.add("platform");
    }
  }, [location]);

  return null;
}

export default BodyClassHandler;
