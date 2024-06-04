import { useState, useEffect } from 'react';
import './Equipos.css';
import { Team } from '../../Models/Team';
import Header from '../Header/Header';
import { useAuth } from '../../Hooks/useAuth';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Equipos = () => {
    const { user } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [view, setView] = useState<'list' | 'clasificacion' | 'estadisticas' | 'partidos' | 'plantilla'>('list');
    const [matches, setMatches] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [editMatch, setEditMatch] = useState<any | null>(null);
    const [campuses, setCampuses] = useState<any[]>([]);
    const [classification, setClassification] = useState<any[]>([]);

    const goalsFor = selectedTeam ? matches.reduce((total, match) => {
        if (selectedTeam && match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-') {
            return total + (match.homeTeam.id === selectedTeam.id ? parseInt(match.homeTeamResult) : (match.awayTeam.id === selectedTeam.id ? parseInt(match.awayTeamResult) : 0));
        }
        return total;
    }, 0) : 0;

    const goalsAgainst = selectedTeam ? matches.reduce((total, match) => {
        if (selectedTeam && match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-') {
            return total + (match.homeTeam.id === selectedTeam.id ? parseInt(match.awayTeamResult) : (match.awayTeam.id === selectedTeam.id ? parseInt(match.homeTeamResult) : 0));
        }
        return total;
    }, 0) : 0;

    const statisticsData = [
        {
            title: "Partidos Jugados",
            value: matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-').length,
        },
        {
            title: "Partidos Ganados",
            value: matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && match.homeTeamResult > match.awayTeamResult).length,
        },
        {
            title: "Partidos Perdidos",
            value: matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && match.homeTeamResult < match.awayTeamResult).length,
        },
        {
            title: "Partidos Empatados",
            value: matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && match.homeTeamResult === match.awayTeamResult).length,
        },
        {
            title: "Porcentaje de Victorias",
            value: (
                matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-').length > 0 ?
                    (
                        matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && match.homeTeamResult > match.awayTeamResult).length /
                        matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-').length * 100
                    ).toFixed(2) + "%" : "-"
            ),
        },
        {
            title: "Goles a Favor",
            value: goalsFor,
        },
        {
            title: "Goles en Contra",
            value: goalsAgainst,
        },
        {
            title: "Diferencia de Goles",
            value: goalsFor - goalsAgainst,
        },
        {
            title: "Partidos en Casa",
            value: selectedTeam ? matches.filter(match => match.homeTeam && match.homeTeam.id === selectedTeam.id).length : 0,
        },
        {
            title: "Partidos Fuera",
            value: selectedTeam ? matches.filter(match => match.awayTeam && match.awayTeam.id === selectedTeam.id).length : 0,
        },
    ];

    const formatDate = (dateString: string) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        fetchTeams();
    }, [user]);

    useEffect(() => {
        axios.get(`${apiUrl}/campuses`)
            .then(response => {
                setCampuses(response.data);
            })
            .catch(error => {
                console.error('Error fetching campuses:', error);
            });
    }, []);

    useEffect(() => {
        if (apiUrl && selectedTeam) {
            if (view === 'clasificacion' || view === 'estadisticas') {
                axios.get(`${apiUrl}/leagues/${selectedTeam.groupId}/teams`)
                    .then(response => {
                        setMatches(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching matches:', error);
                    });
            }

            if (view === 'estadisticas') {
                axios.get(`${apiUrl}/matches/team/${selectedTeam!.id}`)
                    .then(response => {
                        setMatches(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching matches:', error);
                    });
            }

            if (view === 'partidos' && user!.rol === 'ADMIN') {
                axios.get(`${apiUrl}/matches/group/${selectedTeam.groupId}`)
                    .then(response => {
                        setMatches(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching matches:', error);
                    });
            } else {
                axios.get(`${apiUrl}/matches/team/${selectedTeam.id}`)
                    .then(response => {
                        setMatches(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching matches:', error);
                    });
            }

            if (view === 'plantilla') {
                axios.get(`${apiUrl}/teams/${selectedTeam.id}/members`)
                    .then(response => {
                        setMembers(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching team members:', error);
                    });
            }
        }
    }, [view, apiUrl, selectedTeam]);

    useEffect(() => {
        const calculateClassification = async () => {
            const teamStats = await Promise.all(teams.map(async team => {
                const response = await axios.get(`${apiUrl}/matches/team/${team.id}`);
                const teamMatches = response.data;

                const matchesPlayed = teamMatches.filter((match: any) => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && (match.homeTeam.id === team.id || match.awayTeam.id === team.id));
                const matchesWon = matchesPlayed.filter((match: any) => (match.homeTeam && match.homeTeam.id === team.id && match.homeTeamResult > match.awayTeamResult) || (match.awayTeam && match.awayTeam.id === team.id && match.awayTeamResult > match.homeTeamResult));
                const matchesDrawn = matchesPlayed.filter((match: any) => match.homeTeamResult === match.awayTeamResult);
                const matchesLost = matchesPlayed.filter((match: any) => (match.homeTeam && match.homeTeam.id === team.id && match.homeTeamResult < match.awayTeamResult) || (match.awayTeam && match.awayTeam.id === team.id && match.awayTeamResult < match.homeTeamResult));
                const goalsFor = matchesPlayed.reduce((total: number, match: any) => total + (match.homeTeam && match.homeTeam.id === team.id ? parseInt(match.homeTeamResult) : parseInt(match.awayTeamResult)), 0);
                const goalsAgainst = matchesPlayed.reduce((total: number, match: any) => total + (match.homeTeam && match.homeTeam.id === team.id ? parseInt(match.awayTeamResult) : parseInt(match.homeTeamResult)), 0);
                const goalDifference = goalsFor - goalsAgainst;
                const points = (matchesWon.length * 3) + matchesDrawn.length;

                return {
                    team,
                    matchesPlayed: matchesPlayed.length,
                    matchesWon: matchesWon.length,
                    matchesDrawn: matchesDrawn.length,
                    matchesLost: matchesLost.length,
                    goalsFor,
                    goalsAgainst,
                    goalDifference,
                    points,
                };
            }));

            setClassification(teamStats.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference));
        };

        if (teams.length > 0) {
            calculateClassification();
        }
    }, [teams]);

    const handleTeamClick = (team: Team) => {
        setSelectedTeam(team);
        setView('clasificacion');
        axios.get(`${apiUrl}/teams/groups/${team.groupId}/teams`)
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });
    };

    const handleBackToList = () => {
        setSelectedTeam(null);
        setView('list');
        fetchTeams();
    };

    const handleViewChange = (newView: 'list' | 'clasificacion' | 'estadisticas' | 'partidos' | 'plantilla') => {
        setView(newView);
    };

    const handleEditMatch = (match: any) => {
        setEditMatch(match);
    };

    const handleUpdateMatch = (e: any) => {
        e.preventDefault();
        if (editMatch.homeTeamResult === '-' || editMatch.awayTeamResult === '-') {
            alert('Ambos equipos deben tener un resultado antes de actualizar el partido.');
            return;
        }
        axios.put(`${apiUrl}/matches/${editMatch.id}`, editMatch)
            .then(response => {
                setEditMatch(null);
                setMatches(matches.map(m => m.id === response.data.id ? response.data : m));
            })
            .catch(error => {
                console.error('Error updating match:', error);
            });
    };

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        if (name === 'date') {
            const [year, month, day] = value.split('-');
            setEditMatch({ ...editMatch, [name]: `${day}/${month}/${year}` });
        } else if (name === 'location') {
            const selectedCampus = campuses.find(campus => campus.name === value);
            setEditMatch({ ...editMatch, campus: selectedCampus });
        } else {
            setEditMatch({ ...editMatch, [name]: value });
        }
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
                    {view === 'clasificacion' && (
                        <div className="classification-container">
                            <table className="classification-table">
                                <thead>
                                    <tr>
                                        <th>Equipo</th>
                                        <th>J</th>
                                        <th>G</th>
                                        <th>E</th>
                                        <th>P</th>
                                        <th>GF</th>
                                        <th>GC</th>
                                        <th>DG</th>
                                        <th>Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classification.map((teamStat, index) => (
                                        <tr key={index} className={teamStat.team.id === selectedTeam?.id ? 'selected-team' : ''}>
                                            <td className={`team-name ${teamStat.team.id === selectedTeam?.id ? 'bold' : ''}`}>{teamStat.team.name}</td>
                                            <td>{teamStat.matchesPlayed}</td>
                                            <td>{teamStat.matchesWon}</td>
                                            <td>{teamStat.matchesDrawn}</td>
                                            <td>{teamStat.matchesLost}</td>
                                            <td>{teamStat.goalsFor}</td>
                                            <td>{teamStat.goalsAgainst}</td>
                                            <td>{teamStat.goalDifference}</td>
                                            <td>{teamStat.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {view === 'estadisticas' && (
                        <div className="statistics-container">
                            {statisticsData.map((stat, index) => (
                                <div key={index} className="statistic">
                                    <h4>{stat.title}</h4>
                                    <p>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {view === 'partidos' && (
                        <div className="matches-container">
                            <ul className="matches-list">
                                {matches.map((match: any, index: number) => (
                                    match.homeTeam && match.awayTeam && match.campus ? (
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
                                    ) : null
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
                            <input type="date" name="date" value={formatDate(editMatch.date)} onChange={handleChange} />
                        </label>
                        <label>
                            Hora:
                            <input type="time" name="time" value={editMatch.time} onChange={handleChange} />
                        </label>
                        <label>
                            Ubicación:
                            <select name="location" value={editMatch.campus.name} onChange={handleChange}>
                                {campuses.map(campus => (
                                    <option key={campus.id} value={campus.name}>{campus.name}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Resultado Local:
                            <input type="number" name="homeTeamResult" min="0" value={editMatch.homeTeamResult} onChange={handleChange} />
                        </label>
                        <label>
                            Resultado Visitante:
                            <input type="number" name="awayTeamResult" min="0" value={editMatch.awayTeamResult} onChange={handleChange} />
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
