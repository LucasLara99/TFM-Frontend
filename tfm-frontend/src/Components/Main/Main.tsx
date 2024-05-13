import { Link } from 'react-router-dom';
import './Main.css';

const Main = () => {
    return (
        <div className="main-page">
            <header className="main-header">
                <Link to="/home"><b>Inicio</b></Link>
                <Link to="/ligas"><b>Ligas</b></Link>
                <Link to="/equipos"><b>Equipos</b></Link>
                <Link to="/perfil"><b>Perfil</b></Link>
                <Link to="/"><b>Salir</b></Link>
            </header>
            <div className='title-subtitle-container'>
                <h1 className='main-title'>Bienvenido a UDC Leagues</h1>
                <h3 className='main-subtitle'>Uniendo a la comunidad universitaria a través del deporte</h3>
            </div>
        </div>
    );
};

export default Main;