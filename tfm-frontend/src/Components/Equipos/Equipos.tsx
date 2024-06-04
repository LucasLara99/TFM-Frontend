import './Equipos.css';
import { Team } from '../../Models/Team';
import Header from '../Header/Header';
import { useEquipos } from '../../Hooks/useEquipos';

const Equipos = () => {
    const {
        teams,
        selectedTeam,
        view,
        classification,
        statisticsData,
        matches,
        members,
        campuses,
        user,
        editMatch,
        handleTeamClick,
        handleBackToList,
        handleViewChange,
        handleEditMatch,
        handleUpdateMatch,
        handleChange,
        setEditMatch,
        formatDate
    } = useEquipos();

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
