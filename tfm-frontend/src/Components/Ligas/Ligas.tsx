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
        handleJoinTeam
    } = useLeagues();

    const { user } = useAuth();

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
                                <h3>{group.name}</h3>
                                {group.teams?.map((team, teamIndex) => {
                                    const isInTeam = user?.teams?.some(userTeam => userTeam.id === team.id);
                                    const noPlacesLeft = team.current_users >= team.max_places;

                                    return (
                                        <div key={teamIndex} className="team-card">
                                            <h4 className="team-name">{team.name}</h4>
                                            <div className="team-details">
                                                <p><strong>Horario:</strong> {team.schedule}</p>
                                                <p><strong>Lugar:</strong> {team.location}</p>
                                                <p><strong>Plazas máximas:</strong> {team.max_places}</p>
                                                <p><strong>Usuarios inscritos:</strong> {team.current_users}</p>
                                            </div>
                                            {user && (
                                                <button
                                                    className="join-team-button"
                                                    onClick={() => handleJoinTeam(team.id)}
                                                    disabled={isInTeam || noPlacesLeft}
                                                >
                                                    {isInTeam ? 'Ya estás en este equipo' : noPlacesLeft ? 'No quedan plazas' : 'Unirse al Equipo'}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                {user && user.rol === 'ADMIN' && (
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
