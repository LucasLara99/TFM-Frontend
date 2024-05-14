import { createContext, useContext, useState, ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { User } from '../Models/User';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_APP_API_URL;

interface AuthContextData {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async (newUser: User) => {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Server response:', text);
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        },
        onSuccess: (data) => {
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
            navigate('/home');
        },
        onError: (error) => {
            console.error('Login error:', error);
        }
    });

    const login = (email: string, password: string) => {
        loginMutation.mutate({ email, password });
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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