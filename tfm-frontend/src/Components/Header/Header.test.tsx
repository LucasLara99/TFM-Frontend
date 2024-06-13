import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../Hooks/useAuth';

// Mock del hook useAuth
jest.mock('../../Hooks/useAuth');

// Mock de constantes
jest.mock('../../constants', () => ({
    VITE_APP_API_URL: 'http://mocked-api-url.com',
}));

const mockLogout = jest.fn();

describe('Header component', () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            logout: mockLogout
        });
    });

    test('renders navigation links', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const homeLink = screen.getByText(/Inicio/i);
        const leaguesLink = screen.getByText(/Ligas/i);
        const teamsLink = screen.getByText(/Equipos/i);
        const profileLink = screen.getByText(/Perfil/i);
        const logoutLink = screen.getByText(/Salir/i);

        expect(homeLink).toBeInTheDocument();
        expect(leaguesLink).toBeInTheDocument();
        expect(teamsLink).toBeInTheDocument();
        expect(profileLink).toBeInTheDocument();
        expect(logoutLink).toBeInTheDocument();
    });

    test('logout link calls logout function', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const logoutLink = screen.getByText(/Salir/i);
        fireEvent.click(logoutLink);

        expect(mockLogout).toHaveBeenCalled();
    });
});
