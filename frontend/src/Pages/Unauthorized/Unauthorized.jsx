import { useNavigate } from "react-router-dom";
import './Unauthorized.css'

function Unauthorized()
{
    const navigate = useNavigate();

    return (
      <div className="access-denied-container">
        <div className="access-denied-box">
          <h1 className="neon-text">Доступ запрещён</h1>
          <p className="neon-subtext">
            У вас недостаточно прав для доступа к этой странице.
          </p>
          <button className="neon-button" onClick={() => navigate("/")}>
            Вернуться на главную
          </button>
        </div>
      </div>
    );
}

export default Unauthorized;