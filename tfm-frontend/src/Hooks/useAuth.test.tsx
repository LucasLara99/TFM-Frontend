import { render, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './useAuth';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

// Mock de constantes
jest.mock('../constants', () => ({
    VITE_APP_API_URL: 'http://mocked-api-url.com',
}));

// Mocks necesarios para las pruebas
jest.mock('axios');
jest.mock('@tanstack/react-query', () => ({
    useMutation: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

const mockMutate = jest.fn();
const mockUseMutation = useMutation as jest.Mock;
mockUseMutation.mockReturnValue({ mutate: mockMutate });

const TestComponent = () => {
    const { user, login, logout, loading } = useAuth();
    return (
        <div>
            {loading ? (
                <span>Loading...</span>
            ) : (
                <>
                    <span>{user ? user.email : 'No user'}</span>
                    <button onClick={() => login('test@example.com', 'password')}>Login</button>
                    <button onClick={() => logout()}>Logout</button>
                </>
            )}
        </div>
    );
};

describe('useAuth hook', () => {
    beforeEach(() => {
        localStorage.clear();
        mockMutate.mockReset();
    });

    it('should handle user login and logout', async () => {
        // Mock de la respuesta del login
        mockMutate.mockImplementationOnce(({ email, password }) => {
            expect(email).toBe('test@example.com');
            expect(password).toBe('password');
            act(() => {
                // Simulamos el éxito de la mutación
                mockUseMutation.mock.calls[0][0].onSuccess({
                    id: '1',
                    email: 'test@example.com',
                    name: 'Test User',
                    facultad: 'Test Facultad',
                    rol: 'user',
                    teams: [],
                    token: 'test-token',
                });
            });
        });

        // Mock de la respuesta de axios para user teams
        (axios.get as jest.Mock).mockResolvedValueOnce({
            data: [], 
        });

        const { getByText } = render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        // Verificar estado inicial
        expect(getByText('No user')).toBeInTheDocument();

        // Simular inicio de sesión
        act(() => {
            getByText('Login').click();
        });

        // Esperar a que el estado cambie después del inicio de sesión
        await waitFor(() => {
            expect(getByText('test@example.com')).toBeInTheDocument();
        });

        // Simular cierre de sesión
        act(() => {
            getByText('Logout').click();
        });

        // Verificar estado después del cierre de sesión
        await waitFor(() => {
            expect(getByText('No user')).toBeInTheDocument();
        });
    });
});
