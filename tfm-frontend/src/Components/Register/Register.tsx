import { Button, Grid, TextField } from '@mui/material';
import { Link } from "react-router-dom";
import img from '../../assets/register_login.png';
import './Register.css';

const Register = () => {
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
                                <TextField className="register-input" id="filled-basic" label="Email" variant="filled" fullWidth />
                            </div>
                            <div>
                                <Link to="/register">
                                    <Button className="register-button" variant="contained">Registrarse</Button>
                                </Link>
                            </div>
                            <div>
                                <span> ¿Ya tienes una cuenta? </span>
                            </div>
                            <div>
                                <Link to="/login">
                                    <Button className="register-button" variant="contained">Inicia Sesión</Button>
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