import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { League } from '../../Models/League';

const apiUrl = import.meta.env.VITE_APP_API_URL;

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

const leagueEndpoints = {
    'Fútbol': 1,
    'Fútbol sala': 2,
    'Tenis': 3,
    'Voleibol': 4,
    'Rugby': 5,
    'Baloncesto': 6,
    'Balonmano': 7,
    'Atletismo': 8,
    'Pádel': 9
};

const Ligas = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const leagueIds = Object.values(leagueEndpoints);
                const leagueDataPromises = leagueIds.map(id =>
                    fetch(`${apiUrl}/leagues/${id}`).then(response => response.json())
                );

                const leagueData = await Promise.all(leagueDataPromises);
                setLeagues(leagueData);
            } catch (error) {
                console.error('Error fetching leagues:', error);
            }
        };

        fetchLeagues();
    }, []);

    const [rotateInfo, setRotateInfo] = useState(false);
    const [rotateImage, setRotateImage] = useState(false);
    const [direction, setDirection] = useState('right');

    const nextLeague = () => {
        setRotateInfo(true);
        setRotateImage(true);
        setDirection('right');
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % leagues.length);
            setRotateInfo(false);
            setRotateImage(false);
        }, 500);
    };

    const prevLeague = () => {
        setRotateInfo(true);
        setRotateImage(true);
        setDirection('left');
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + leagues.length) % leagues.length);
            setRotateInfo(false);
            setRotateImage(false);
        }, 500);
    };

    const handleLeagueClick = (league: League) => {
        if (user && user.rol === 'ADMIN') {
            navigate('/equipos', { state: { liga: league.name } });
        }
    };

    const currentLeague = leagues[currentIndex] || {
        name: '',
        id: 0,
        season: '',
        campus: '',
        status: '',
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
                        <p>Temporada - {currentLeague.season}</p>
                        <p>Campus - {currentLeague.campus}</p>
                        <p>Estado - {currentLeague.status}</p>
                        <h2>Periodos de realización</h2>
                        {currentLeague.periods?.map((period, index) => (
                            <p key={index}>{period.startDate} - {period.endDate} {period.name}</p>
                        ))}
                        <h2>Plazos de inscripción</h2>
                        {currentLeague.registrations?.map((registrations, index) => (
                            <p key={index}>{registrations.type} {registrations.period} {registrations.startDate} - {registrations.endDate}</p>
                        ))}
                        <h2>Grupos</h2>
                        {currentLeague.groups?.map((group, index) => (
                            <div key={index} className="group-container">
                                <p><b>{group.name}</b></p>
                                <p>Horario - {group.schedule}</p>
                                <p>Lugar - {group.location}</p>
                                <p>Máx. plazas - {group.maxPlaces}</p>
                                <p>Plazas actuales - {group.currentUsers}</p>
                                <p>Estado - {group.status}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`image-container ${rotateImage ? `rotate-out-${direction}` : `rotate-in-${direction}`}`}>
                    <img
                        className="sport-image"
                        src={leagueImages[currentLeague.name] || ''}
                        alt={currentLeague.name}
                        onClick={() => handleLeagueClick(currentLeague)}
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
