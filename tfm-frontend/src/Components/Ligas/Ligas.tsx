import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography } from '@mui/material';
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

interface League {
    id: number;
    name: string;
}

interface LeagueImages {
    [key: string]: string;
}

const leagueImages: LeagueImages = {
    'futbol': futbolImg,
    'futsal': futsalImg,
    'voleibol': volleyballImg,
    'baloncesto': basketballImg,
    'rugby': rugbyImg,
    'balonmano': handballImg,
    'tenis': tennisImg,
    'padel': padelImg,
    'atletismo': atletismoImg
};

const Ligas = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLeagueClick = (league: League) => {
        if (user && user.rol === 'ADMIN') {
            navigate(`/equipos/${league.name}`);
        }
    }

    useEffect(() => {
        fetch('http://localhost:8080/leagues/all')
            .then(response => response.json())
            .then(data => setLeagues(data));
    }, []);

    return (
        <div className="ligas-main-page">
            <header className="main-header">
                <Link to="/home"><b>Inicio</b></Link>
                <Link to="/ligas"><b>Ligas</b></Link>
                <Link to="/equipos"><b>Equipos</b></Link>
                <Link to="/perfil"><b>Perfil</b></Link>
                <Link to="/"><b>Salir</b></Link>
            </header>
            <Grid container spacing={3}>
                {leagues.map((league) => (
                    <Grid item xs={4} key={league.id}>
                        <Card className="league-card" onClick={() => handleLeagueClick(league)}>
                            <CardMedia
                                component="img"
                                alt={league.name}
                                height="100"
                                image={leagueImages[league.name]}
                            />
                            <Typography variant="h5" component="div" className="league-title">
                                {league.name}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Ligas;