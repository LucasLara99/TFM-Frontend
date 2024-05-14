import { useAuth } from '../../Hooks/useAuth';
import Header from '../Header/Header';
import './Equipos.css';
import { useParams } from 'react-router-dom';

const Equipos = () => {
    const { user } = useAuth();
    const { leagueName } = useParams();

    const handleCreateTeam = () => {
        if (user) {
            const teamName = `${leagueName} ${user.facultad}`;
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