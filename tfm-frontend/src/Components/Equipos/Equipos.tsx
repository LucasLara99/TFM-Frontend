import { useState, useEffect } from 'react';
import './Equipos.css';
import { Team } from '../../Models/Team';
import Header from '../Header/Header';
import { useAuth } from '../../Hooks/useAuth';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Equipos = () => {
    const { user } = useAuth(); // Asegúrate de tener acceso al usuario
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [view, setView] = useState<'list' | 'clasificacion' | 'estadisticas' | 'partidos' | 'plantilla'>('list');
    const [matches, setMatches] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [editMatch, setEditMatch] = useState<any | null>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                if (user!.rol === 'ADMIN') {
                    const response = await axios.get(`${apiUrl}/teams/getall`);
                    setTeams(response.data);
                } else {
                    const response = await axios.get(`${apiUrl}/users/${user!.id}/teams`);
                    setTeams(response.data);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, [user]);

    useEffect(() => {
        if (selectedTeam && view === 'partidos') {
            axios.get(`${apiUrl}/matches/team/${selectedTeam.id}`)
                .then(response => {
                    setMatches(response.data);
                })
                .catch(error => {
                    console.error('Error fetching matches:', error);
                });
        }
    }, [selectedTeam, view]);

    useEffect(() => {
        if (selectedTeam && view === 'plantilla') {
            axios.get(`${apiUrl}/teams/${selectedTeam.id}/members`)
                .then(response => {
                    setMembers(response.data);
                })
                .catch(error => {
                    console.error('Error fetching team members:', error);
                });
        }
    }, [selectedTeam, view]);

    const handleTeamClick = (team: Team) => {
        setSelectedTeam(team);
        setView('clasificacion');
    };

    const handleBackToList = () => {
        setSelectedTeam(null);
        setView('list');
    };

    const handleViewChange = (newView: 'list' | 'clasificacion' | 'estadisticas' | 'partidos' | 'plantilla') => {
        setView(newView);
    };

    const handleEditMatch = (match: any) => {
        setEditMatch(match);
    };

    const handleUpdateMatch = (e: any) => {
        e.preventDefault();
        axios.put(`${apiUrl}/matches/${editMatch.id}`, editMatch)
            .then(response => {
                console.log(editMatch)
                setEditMatch(null);
                setMatches(matches.map(m => m.id === response.data.id ? response.data : m));
            })
            .catch(error => {
                console.error('Error updating match:', error);
            });
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setEditMatch({
            ...editMatch,
            [name]: value
        });
    };

    return (
        <div className='equipos-main-page'>
            <Header />
            {view === 'list' && (
                <div className="equipos-container">
                    <div className="equipos-list">
                        {teams.map((team: Team) => (
                            <div key={team.id} className="equipo-card" onClick={() => handleTeamClick(team)}>
                                <h3 className="equipo-name">{team.name}</h3>
                                <div className="equipo-details">
                                    <p><strong>Horario:</strong> {team.schedule}</p>
                                    <p><strong>Ubicación:</strong> {team.location}</p>
                                    <p><strong>Plazas Máximas:</strong> {team.maxPlaces}</p>
                                    <p><strong>Usuarios Inscritos:</strong> {team.currentUsers}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {view !== 'list' && selectedTeam && (
                <div className="team-details-container">
                    <div className='team-details-header'>
                        <button className="back-button" onClick={handleBackToList}>Volver a la Lista</button>
                        <h2 className="selected-team-name">{selectedTeam.name}</h2>
                    </div>
                    <div className="team-options">
                        <button className="team-option" onClick={() => handleViewChange('clasificacion')}>Clasificación</button>
                        <button className="team-option" onClick={() => handleViewChange('estadisticas')}>Estadísticas</button>
                        <button className="team-option" onClick={() => handleViewChange('partidos')}>Partidos</button>
                        <button className="team-option" onClick={() => handleViewChange('plantilla')}>Plantilla</button>
                    </div>
                    {view === 'partidos' && (
                        <div className="matches-container">
                            <ul className="matches-list">
                                {matches.map((match: any, index: number) => (
                                    <li
                                        key={`${match.id}-${match.homeTeam.id}-${match.awayTeam.id}-${index}`}
                                        className={`match-item ${user!.rol === 'ADMIN' ? 'ADMIN' : ''}`}
                                        onClick={user!.rol === 'ADMIN' ? () => handleEditMatch(match) : undefined}
                                        style={user!.rol === 'ADMIN' ? { cursor: 'pointer' } : undefined}
                                    >
                                        <div className="match-info">
                                            <div className="team team-home">
                                                <span className={`team-name ${match.homeTeam.name === selectedTeam.name ? 'bold' : ''}`}>
                                                    {match.homeTeam.name}
                                                </span>
                                                <p className='match-score'>{match.homeTeamResult}</p>
                                            </div>
                                            <div className="match-details">
                                                <p>{match.date}</p>
                                                <p>{match.time}</p>
                                                <p>{match.campus.name}</p>
                                            </div>
                                            <div className="team team-away">
                                                <p className='match-score'>{match.awayTeamResult}</p>
                                                <span className={`team-name ${match.awayTeam.name === selectedTeam.name ? 'bold' : ''}`}>
                                                    {match.awayTeam.name}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {view === 'plantilla' && (
                        <div className="members-container">
                            {members.length > 0 ? (
                                <div className="members-list">
                                    {members.map((member: any) => (
                                        <div key={member.id} className="member-card">
                                            <h3>{member.name}</h3>
                                            <p>Facultad: {member.facultad}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-members">No se encontraron miembros.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
            {editMatch && (
                <div className="edit-match-modal">
                    <h2>Editar Partido</h2>
                    <form onSubmit={handleUpdateMatch}>
                        <label>
                            Fecha:
                            <input type="date" name="date" value={editMatch.date} onChange={handleChange} />
                        </label>
                        <label>
                            Hora:
                            <input type="time" name="time" value={editMatch.time} onChange={handleChange} />
                        </label>
                        <label>
                            Ubicación:
                            <input type="text" name="location" value={editMatch.campus.name} onChange={handleChange} />
                        </label>
                        <label>
                            Resultado Local:
                            <input type="number" name="homeTeamResult" value={editMatch.homeTeamResult} onChange={handleChange} />
                        </label>
                        <label>
                            Resultado Visitante:
                            <input type="number" name="awayTeamResult" value={editMatch.awayTeamResult} onChange={handleChange} />
                        </label>
                        <button type="submit">Guardar Cambios</button>
                        <button type="button" onClick={() => setEditMatch(null)}>Cancelar</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Equipos;
