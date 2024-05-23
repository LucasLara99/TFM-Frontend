import { useState, useEffect } from 'react';
import axios from 'axios';
import './Equipos.css'; 
import { Team } from '../../Models/Team';
import Header from '../Header/Header';
import { useAuth } from '../../Hooks/useAuth';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Equipos = () => {
    const { user } = useAuth();
    const [userTeams, setUserTeams] = useState([]);

    useEffect(() => {
        const fetchUserTeams = async () => {
            if (!user?.id) {
                console.log('userId is undefined');
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/users/${user.id}/teams`);
                setUserTeams(response.data);
            } catch (error) {
                console.error('Error fetching user teams:', error);
            }
        };

        fetchUserTeams();
    }, [user?.id]);

    return (
        <div className='equipos-main-page'>
            <Header />
            <div className="equipos-container">
                <div className="equipos-list">
                    {userTeams.map((team: Team) => (
                        <div key={team.id} className="equipo-card">
                            <h3 className="equipo-name">{team.name}</h3>
                            <div className="equipo-details">
                                <p><strong>Horario:</strong> {team.schedule}</p>
                                <p><strong>Ubicación:</strong> {team.location}</p>
                                <p><strong>Plazas Máximas:</strong> {team.max_places}</p>
                                <p><strong>Usuarios Inscritos:</strong> {team.current_users}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Equipos;
