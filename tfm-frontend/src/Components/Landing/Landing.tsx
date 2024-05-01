import React from 'react';
import { Button, Grid } from '@mui/material';
import img from '../../assets/landing.png';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing">
            <Grid container style={{ height: '100%' }}>
                <Grid className='left-part' item xs={6} style={{ height: '100%' }}>
                    <div className='container'>
                        <div>
                            <h1>Bienvenidx a UDC Leagues</h1>
                        </div>
                        <div>
                            <h3>Tu plataforma para ligas deportivas</h3>
                        </div>
                        <div className='buttons-container'>
                            <div>
                                <Button className="button" variant="contained">Registrarse</Button>
                            </div>
                            <div>
                                <span> o </span>
                            </div>
                            <div>
                                <Button className="button" variant="contained">Iniciar Sesión</Button>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} style={{ height: '100%' }}>
                    <img className="background-img" alt="imagen fondo" src={img} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Landing;