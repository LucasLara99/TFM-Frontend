import './Ligas.css';
import futbolImg from '../../assets/futbol.jpg';
import futsalImg from '../../assets/futsal.jpg';
import volleyballImg from '../../assets/voleyball.jpg';
import basketballImg from '../../assets/basketball.jpg';
import rugbyImg from '../../assets/rugby.jpeg';
import handballImg from '../../assets/handball.jpg';
import tennisImg from '../../assets/tennis.jpeg';
import padelImg from '../../assets/padel.jpg';
import atletismoImg from '../../assets/atletismo.jpg';
import { useAuth } from '../../Hooks/useAuth';
import Header from '../Header/Header';
import CreateTeamForm from '../CreateGroupForm/CreateTeamForm';
import { useLeagues } from '../../Hooks/useLeagues';
import JoinRequests from '../JoinRequests/JoinRequests';
import { Team } from '../../Models/Team';

interface LeagueImages {
    [key: string]: string;
}

const leagueImages: LeagueImages = {
    'Fútbol': futbolImg,
    'Fútbol sala': futsalImg,
    'Voleibol': volleyballImg,
    'Baloncesto': basketballImg,
    'Rugby': rugbyImg,
    'Balonmano': handballImg,
    'Tenis': tennisImg,
    'Pádel': padelImg,
    'Atletismo': atletismoImg
};

const Ligas = () => {
    const {
        leagues,
        currentIndex,
        showCreateTeamForm,
        hideCreateButton,
        rotateInfo,
        rotateImage,
        direction,
        toggleCreateTeamForm,
        nextLeague,
        prevLeague,
        handleJoinTeam,
        handleGenerateMatches
    } = useLeagues();

    const { user, userTeams } = useAuth();
    const isAdmin = user?.rol === 'ADMIN';
    const userHasTeamInGroup: boolean = userTeams.some(team => team.groupId === leagues[currentIndex]?.groups[0]?.id);

    const currentLeague = leagues[currentIndex] || {
        name: '',
        id: 0,
        season: '',
        campus: '',
        periods: [],
        registration: [],
        groups: []
    };


    return (
        <div className="ligas-main-page">
            <Header />
            <div className="content-container">
                <div className={`info-container ${rotateInfo ? `rotate-out-${direction}` : `rotate-in-${direction}`}`}>
                    <div className="info-content">
                        <h1>{currentLeague.name}</h1>
                        <p>Campus - {currentLeague.campus.name}</p>
                        <p>Estado - {currentLeague.status}</p>
                        <h2>Periodos de realización</h2>
                        {currentLeague.seasons?.map((period, index) => (
                            <p key={index}>{period.startDate} - {period.endDate} {period.name}</p>
                        ))}
                        <h2>Plazos de inscripción</h2>
                        {currentLeague.registrationPeriods?.map((registrations, index) => (
                            <p key={index}>{registrations.type} {registrations.period} {registrations.startDate} - {registrations.endDate}</p>
                        ))}
                        <h2>Grupos</h2>
                        {currentLeague.groups?.map((group, index) => (
                            <div key={index} className="group-container">
                                <div className='group-header'>
                                    <h3>{group.name}</h3>
                                    {isAdmin && <button className="generate-button" onClick={() => handleGenerateMatches(group.id)}>Generar partidos</button>}
                                </div>
                                <div>
                                    <h2>Tu equipo</h2>
                                    {group.teams?.filter(team => userTeams.some(userTeam => userTeam.id === team.id)).map((team: Team, teamIndex) => {
                                        const isInTeam = userTeams.some(userTeam => userTeam.id === team.id);
                                        const isCaptain = team.captain?.id === user?.id;
                                        const noPlacesLeft = team.currentUsers >= team.maxPlaces;
                                        return (
                                            <div key={teamIndex} className="team-card">
                                                <h4 className="team-name">{team.name}</h4>
                                                <div className="team-details">
                                                    <p><strong>Horario:</strong> {team.schedule}</p>
                                                    <p><strong>Lugar:</strong> {team.location}</p>
                                                    <p><strong>Plazas máximas:</strong> {team.maxPlaces}</p>
                                                    <p><strong>Usuarios inscritos:</strong> {team.currentUsers}</p>
                                                </div>
                                                {user && !isInTeam && !noPlacesLeft && !isAdmin && userTeams.length === 0 &&(
                                                    <button
                                                        className="join-team-button"
                                                        onClick={() => handleJoinTeam(team.id)}
                                                        disabled={isInTeam || noPlacesLeft}
                                                    >
                                                        {isInTeam ? 'Ya estás en este equipo' : noPlacesLeft ? 'No quedan plazas' : 'Solicitar inscripción'}
                                                    </button>
                                                )}
                                                {isCaptain && <JoinRequests teamId={team.id} />}
                                            </div>
                                        );
                                    })}
                                    {!userHasTeamInGroup && user && !isAdmin && (
                                        <>
                                            {!hideCreateButton && (
                                                <button
                                                    className="create-team-button"
                                                    onClick={() => toggleCreateTeamForm(group.id)}
                                                >
                                                    Crear Equipo
                                                </button>
                                            )}
                                            {showCreateTeamForm[group.id] && (
                                                <CreateTeamForm
                                                    leagueId={currentLeague.id}
                                                    groupId={group.id}
                                                    onClose={() => toggleCreateTeamForm(group.id)}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>

                                <div>
                                    <h2>Resto de equipos</h2>
                                    {group.teams?.filter(team => !userTeams.some(userTeam => userTeam.id === team.id)).map((team: Team, teamIndex) => {
                                        const isInTeam = userTeams.some(userTeam => userTeam.id === team.id);
                                        const isCaptain = team.captain?.id === user?.id;
                                        const noPlacesLeft = team.currentUsers >= team.maxPlaces;
                                        return (
                                            <div key={teamIndex} className="team-card">
                                                <h4 className="team-name">{team.name}</h4>
                                                <div className="team-details">
                                                    <p><strong>Horario:</strong> {team.schedule}</p>
                                                    <p><strong>Lugar:</strong> {team.location}</p>
                                                    <p><strong>Plazas máximas:</strong> {team.maxPlaces}</p>
                                                    <p><strong>Usuarios inscritos:</strong> {team.currentUsers}</p>
                                                </div>
                                                {user && !isInTeam && !noPlacesLeft && !isAdmin && (
                                                    <button
                                                        className="join-team-button"
                                                        onClick={() => handleJoinTeam(team.id)}
                                                        disabled={isInTeam || noPlacesLeft}
                                                    >
                                                        {isInTeam ? 'Ya estás en este equipo' : noPlacesLeft ? 'No quedan plazas' : 'Solicitar inscripción'}
                                                    </button>
                                                )}
                                                {isCaptain && <JoinRequests teamId={team.id} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`image-container ${rotateImage ? `rotate-out-${direction}` : `rotate-in-${direction}`}`}>
                    <img
                        className="sport-image"
                        src={leagueImages[currentLeague.name] || ''}
                        alt={currentLeague.name}
                    />
                </div>
            </div>
            <div className="arrows-container">
                <div className="arrow-left" onClick={prevLeague}></div>
                <div className="arrow-right" onClick={nextLeague}></div>
            </div>
        </div>
    );
};

export default Ligas;
