import { Link, useMatch } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="main-header">
            <CustomLink to="/home"><b>Inicio</b></CustomLink>
            <CustomLink to="/ligas"><b>Ligas</b></CustomLink>
            <CustomLink to="/equipos"><b>Equipos</b></CustomLink>
            <CustomLink to="/perfil"><b>Perfil</b></CustomLink>
            <Link to="/" onClick={() => localStorage.clear()}><b>Salir</b></Link>
        </header>
    );
};

interface CustomLinkProps {
    to: string;
    children: React.ReactNode;
}

const CustomLink = ({ to, children }: CustomLinkProps) => {
    const match = useMatch(to);
    return (
        <Link to={to} className={match ? 'active-link' : ''}>
            {children}
        </Link>
    );
};

export default Header;