import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { User } from '../Models/User';
import { useNavigate } from 'react-router-dom';
import { Team } from '../Models/Team';
import axios from 'axios';
import { VITE_APP_API_URL } from '../constants';

const apiUrl = VITE_APP_API_URL;

interface AuthContextData {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    loading: boolean;
    userTeams: Team[];
    setUserTeams: (teams: Team[]) => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [userTeams, setUserTeams] = useState<Team[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const fetchUserTeams = async () => {
            if (!user || !user.id) {
                console.log('userId is undefined');
                return;
            }
        
            try {
                const response = await axios.get(`${apiUrl}/users/${user.id}/teams`);
                setUserTeams(response.data);
            } catch (error) {
                console.error('Error fetching user teams:', error);
            }
        };
    
        if (user && user.id) {
            fetchUserTeams();
        }
    }, [user]);

    const loginMutation = useMutation({
        mutationFn: async (loginRequest: { email: string, password: string }) => {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginRequest),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            return {
                id: data.id,
                email: data.email,
                name: data.name,
                facultad: data.facultad,
                rol: data.rol,
                teams: data.teams,
                token: data.token,
            };
        },
        onSuccess: (data) => {
            setUser(data);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/home');
        },
        onError: (error) => {
            console.error('Error logging in:', error);
        },
    });

    const login = (email: string, password: string) => {
        loginMutation.mutate({ email, password });
    }

    const logout = () => {
        setUser(null);
        localStorage.clear();
        navigate('/');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, userTeams, setUserTeams }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
