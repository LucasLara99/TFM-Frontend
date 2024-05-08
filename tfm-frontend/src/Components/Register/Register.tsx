import { Button, Grid, TextField } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import img from '../../assets/register_login.png';
import './Register.css';
import useRegister from '../../Hooks/useRegister';
import { useState, useEffect } from 'react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const registerMutation = useRegister();
    const navigate = useNavigate();

    useEffect(() => {
        if (registerMutation.isSuccess) {
            setEmail('');
            setPassword('');
            navigate('/home');
        }
    }, [registerMutation.isSuccess, navigate]);

    const handleSubmit = () => {
        if (!email || !password) {
            setError('Los campos no pueden estar vacíos');
        } else if (!email.includes('@')) {
            setError('El formato del email no es válido');
        } else {
            setError('');
            registerMutation.mutate({ email, password });
        }
    }

    return (
        <div className="register-page">
            <Grid container style={{ height: '100%' }}>
                <Grid className='register-left-part' item xs={6} style={{ height: '100%' }}>
                    <div className='register-container'>
                        <div>
                            <h1>Crea tu cuenta</h1>
                        </div>
                        <div>
                            <h4>¡Regístrate ahora!</h4>
                        </div>
                        <div className='register-buttons-container'>
                            <div>
                                <TextField
                                    className="register-input"
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
                                    className="register-input"
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
                                <Button className="register-button" onClick={handleSubmit} variant="contained">Registrarse</Button>
                            </div>
                            <div>
                                <span> ¿Ya tienes una cuenta? </span>
                            </div>
                            <div>
                                <Link to="/login">
                                    <Button className="register-button" variant="contained" >Inicia Sesión</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} style={{ height: '100%' }}>
                    <img className="register-img" alt="imagen fondo" src={img} />
                </Grid>
            </Grid>
        </div>
    );
}

export default Register