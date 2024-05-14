import { useAuth } from '../../Hooks/useAuth';
import './Equipos.css';
import { Link, useParams } from 'react-router-dom';

const Equipos = () => {
    const { user } = useAuth();
    const { leagueName } = useParams();

    const handleCreateTeam = () => {
        if (user) {
            const teamName = `${leagueName} ${user.facultad}`;
            console.log(teamName);
        }
    }

    const handleLogout = () => {
        localStorage.clear();
    }

    return (
        <div className='equipos-main-page'>
            <header className="main-header">
                <Link to="/home"><b>Inicio</b></Link>
                <Link to="/ligas"><b>Ligas</b></Link>
                <Link to="/equipos"><b>Equipos</b></Link>
                <Link to="/perfil"><b>Perfil</b></Link>
                <Link to="/" onClick={handleLogout}><b>Salir</b></Link>
            </header>
            {user && user.rol === 'ADMIN' && (
                <button onClick={handleCreateTeam}>Crear equipo</button>
            )}
        </div>
    );
};

export default Equipos;