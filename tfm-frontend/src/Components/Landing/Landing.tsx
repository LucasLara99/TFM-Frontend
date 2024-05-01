import { Button, Grid } from '@mui/material';
import img from '../../assets/landing.png';
import './Landing.css';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="landing-page">
            <Grid container style={{ height: '100%' }}>
                <Grid className='landing-left-part' item xs={6} style={{ height: '100%' }}>
                    <div className='landing-container'>
                        <div>
                            <h1>Bienvenidx a UDC Leagues</h1>
                        </div>
                        <div>
                            <h3>Tu plataforma para ligas deportivas</h3>
                        </div>
                        <div className='landing-buttons-container'>
                            <div>
                                <Link to="/register">
                                    <Button className="landing-button" variant="contained">Registrarse</Button>
                                </Link>
                            </div>
                            <div>
                                <span> o </span>
                            </div>
                            <div>
                                <Link to="/login">
                                    <Button className="landing-button" variant="contained">Iniciar Sesión</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} style={{ height: '100%' }}>
                    <img className="landing-img" alt="imagen fondo" src={img} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Landing;