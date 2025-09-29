import './Header.css'
import personalAccountIcon from "../../assets/personalAccountIcon.png"
import {Link} from "react-router-dom"

function Header()
{
    return (
        <header>
            <nav>
                <ul>
                    <li>Главная</li>
                    <li>Цены</li>
                    <li>Контакты</li>
                </ul>
            </nav>

            <div>
                <div className="personal-account">
                    <Link to="/login"><img src={personalAccountIcon} alt="personal-account-icon" /></Link>
                </div>
            </div>
        </header>
    );
}

export default Header;