import { useState, useEffect } from 'react';
import './Equipos.css';
import { Team } from '../../Models/Team';
import Header from '../Header/Header';
import { useAuth } from '../../Hooks/useAuth';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Equipos = () => {
    const { userTeams } = useAuth();
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [view, setView] = useState<'list' | 'details'>('list');
    const [matches, setMatches] = useState<any[]>([]); // Array to hold matches

    useEffect(() => {
        if (selectedTeam) {
            axios.get(`${apiUrl}/matches/group/${selectedTeam.groupId}`)
                .then(response => {
                    setMatches(response.data);
                })
                .catch(error => {
                    console.error('Error fetching matches:', error);
                });
        }
    }, [selectedTeam]);

    const handleTeamClick = (team: Team) => {
        setSelectedTeam(team);
        setView('details');
    };

    const handleBackToList = () => {
        setSelectedTeam(null);
        setView('list');
    };

    return (
        <div className='equipos-main-page'>
            <Header />
            {view === 'list' && (
                <div className="equipos-container">
                    <div className="equipos-list">
                        {userTeams.map((team: Team) => (
                            <div key={team.id} className="equipo-card" onClick={() => handleTeamClick(team)}>
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
            )}
            {view === 'details' && selectedTeam && (
                <div className="team-details-container">
                    <button className="back-button" onClick={handleBackToList}>Volver a la Lista</button>
                    <h2 className="selected-team-name">{selectedTeam.name}</h2>
                    <div className="team-options">
                        <button className="team-option">Clasificación</button>
                        <button className="team-option">Estadísticas</button>
                        <button className="team-option">Partidos</button>
                        <button className="team-option">Plantilla</button>
                    </div>
                    <div className="matches-container">
                        {Array.isArray(matches) && matches.length > 0 ? (
                            <div className="matches-container">
                                <h3 className="matches-title">Próximos Partidos</h3>
                                <ul className="matches-list">
                                    {matches.map((match: any, index: number) => (
                                        <li key={`${match.id}-${match.homeTeam.id}-${match.awayTeam.id}-${index}`} className="match-item">
                                            <div className="match-info">
                                                <div className="team-names">
                                                    <span className="home-team">{match.homeTeam.name}</span>
                                                    <span className="vs">vs</span>
                                                    <span className="away-team">{match.awayTeam.name}</span>
                                                </div>
                                                <div className="match-details">
                                                    <p><strong>Fecha:</strong> {match.date}</p>
                                                    <p><strong>Hora:</strong> {match.time}</p>
                                                    <p><strong>Lugar:</strong> {match.location}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="no-matches">No se encontraron partidos.</p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Equipos;
