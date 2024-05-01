import React, { useState } from 'react';
import { useQueryClient, useMutation} from '@tanstack/react-query';
import './Login.css'; 
import { useLogin } from '../../Hooks/useLogin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useLogin();

    const handleLogin = () => {
        loginMutation.mutate({ email, password });
    }

    return (
        <div className="login">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;