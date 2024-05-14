import { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { Link } from "react-router-dom";
import img from '../../assets/register_login.png';
import './Login.css';
import { useAuth } from '../../Hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleLogin = () => {
        if (!email || !password) {
            setError('Los campos no pueden estar vacíos');
        } else if (!email.includes('@')) {
            setError('El formato del email no es válido');
        } else {
            setError('');
            login(email, password);
        }
    }

    return (
        <div className="login-page">
            <Grid container style={{ height: '100%' }}>
                <Grid className='login-left-part' item xs={6} style={{ height: '100%' }}>
                    <div className='login-container'>
                        <div>
                            <h1>Inicia sesión</h1>
                        </div>
                        <div>
                            <h4>¡Bienvenido de nuevo!</h4>
                        </div>
                        <div className='login-buttons-container'>
                            <div>
                                <TextField
                                    className="login-input"
                                    id="email"
                                    label="Email"
                                    variant="filled"
                                    fullWidth
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <TextField
                                    className="login-input"
                                    id="password"
                                    label="Contraseña"
                                    variant="filled"
                                    fullWidth
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p>{error}</p>}
                            <div>
                                <Button className="login-button" variant="contained" onClick={handleLogin}>Iniciar Sesión</Button>
                            </div>
                            <div>
                                <span> ¿No tienes una cuenta? </span>
                            </div>
                            <div>
                                <Link to="/register">
                                    <Button className="login-button" variant="contained">Registrarse</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} style={{ height: '100%' }}>
                    <img className="login-img" alt="imagen fondo" src={img} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Login;