import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import CreateTeamForm from './CreateTeamForm';
import { AuthContext, useAuth } from '../../Hooks/useAuth';

// Mock de Axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de useAuth
jest.mock('../../Hooks/useAuth', () => ({
    useAuth: jest.fn(),
    AuthContext: React.createContext(null),
}));

// Mock de constantes
jest.mock('../../constants', () => ({
    VITE_APP_API_URL: 'http://mocked-api-url.com',
}));

const mockUseAuth = useAuth as jest.Mock;

describe('CreateTeamForm', () => {
    const mockSetUserTeams = jest.fn();
    const mockOnClose = jest.fn();
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockUserTeams: any[] = [];

    beforeEach(() => {
        mockUseAuth.mockReturnValue({ user: mockUser, userTeams: mockUserTeams });
        jest.spyOn(window, 'alert').mockImplementation(() => { });

        // Mock window.location.reload directly without deleting window.location
        Object.defineProperty(window, 'location', {
            value: {
                reload: jest.fn(),
            },
            writable: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <AuthContext.Provider value={{ user: mockUser, userTeams: mockUserTeams, setUserTeams: mockSetUserTeams, login: jest.fn(), logout: jest.fn(), loading: false }}>
                <CreateTeamForm leagueId={1} groupId={1} onClose={mockOnClose} />
            </AuthContext.Provider>
        );
    };

    test('renders form fields correctly', () => {
        renderComponent();

        expect(screen.getByLabelText(/Nombre del Equipo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Horario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ubicación/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Máximo de Plazas/i)).toBeInTheDocument();
    });

    test('handles form submission with valid data', async () => {
        mockedAxios.post.mockResolvedValue({ data: { id: 1, name: 'Test Team' } });

        renderComponent();

        fireEvent.change(screen.getByLabelText(/Nombre del Equipo/i), { target: { value: 'Test Team' } });
        fireEvent.change(screen.getByLabelText(/Horario/i), { target: { value: 'Weekdays' } });
        fireEvent.change(screen.getByLabelText(/Ubicación/i), { target: { value: 'Test Location' } });
        fireEvent.change(screen.getByLabelText(/Máximo de Plazas/i), { target: { value: '10' } });

        fireEvent.click(screen.getByText(/^Crear$/i));

        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://mocked-api-url.com/leagues/1/groups/1/teams',
            expect.objectContaining({
                team: {
                    name: 'Test Team',
                    schedule: 'Weekdays',
                    location: 'Test Location',
                    maxPlaces: 10,
                },
                userId: mockUser.id,
            }),
            expect.any(Object)
        );
        expect(mockSetUserTeams).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('handles form submission with valid data', async () => {
        mockedAxios.post.mockResolvedValue({ data: { id: 1, name: 'Test Team' } });

        renderComponent();

        fireEvent.change(screen.getByLabelText(/Nombre del Equipo/i), { target: { value: 'Test Team' } });
        fireEvent.change(screen.getByLabelText(/Horario/i), { target: { value: 'Weekdays' } });
        fireEvent.change(screen.getByLabelText(/Ubicación/i), { target: { value: 'Test Location' } });
        fireEvent.change(screen.getByLabelText(/Máximo de Plazas/i), { target: { value: '10' } });

        fireEvent.click(screen.getByText(/^Crear$/i));

        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://mocked-api-url.com/leagues/1/groups/1/teams',
            expect.objectContaining({
                team: {
                    name: 'Test Team',
                    schedule: 'Weekdays',
                    location: 'Test Location',
                    maxPlaces: 10,
                },
                userId: mockUser.id,
            }),
            expect.any(Object)
        );
        expect(mockSetUserTeams).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});
