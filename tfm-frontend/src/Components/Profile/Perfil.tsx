import { Link } from 'react-router-dom';
import './Perfil.css';

const Perfil = () => {

    return (
        <div className='perfil-main-page'>
            <header className="main-header">
                <Link to="/home"><b>Inicio</b></Link>
                <Link to="/ligas"><b>Ligas</b></Link>
                <Link to="/equipos"><b>Equipos</b></Link>
                <Link to="/perfil"><b>Perfil</b></Link>
                <Link to="/"><b>Salir</b></Link>
            </header>
        </div>
    );
}

export default Perfil;