import { useAuth } from '../../Hooks/useAuth';
import Header from '../Header/Header';
import './Equipos.css';
import { useLocation } from 'react-router-dom';

const Equipos = () => {
    const { user } = useAuth();
    const location = useLocation();
    const liga = location.state?.liga;

    const handleCreateTeam = () => {
        if (user) {
            const teamName = `${liga} ${user.facultad}`;
            console.log(teamName);
        }
    }

    return (
        <div className='equipos-main-page'>
            <Header />
            {user && user.rol === 'ADMIN' && (
                <button onClick={handleCreateTeam}>Crear equipo</button>
            )}
        </div>
    );
};

export default Equipos;