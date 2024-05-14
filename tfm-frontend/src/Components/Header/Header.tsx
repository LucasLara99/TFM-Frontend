import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="main-header">
            <Link to="/home"><b>Inicio</b></Link>
            <Link to="/ligas"><b>Ligas</b></Link>
            <Link to="/equipos"><b>Equipos</b></Link>
            <Link to="/perfil"><b>Perfil</b></Link>
            <Link to="/" onClick={() => localStorage.clear()}><b>Salir</b></Link>
        </header>
    );
};

export default Header;