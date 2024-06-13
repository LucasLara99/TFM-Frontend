import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import JoinRequests from './JoinRequests';
import { useAuth } from '../../Hooks/useAuth';

// Mock del hook useAuth
jest.mock('../../Hooks/useAuth');

// Mock de constantes
jest.mock('../../constants', () => ({
    VITE_APP_API_URL: 'http://mocked-api-url.com',
}));

const mockUser = {
    token: 'mocked-token',
    id: 1
};

describe('JoinRequests component', () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders "No hay solicitudes pendientes" when there are no requests', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(<JoinRequests teamId={1} />);

        await waitFor(() => {
            expect(screen.getByText('No hay solicitudes pendientes.')).toBeInTheDocument();
        });
    });

    test('renders join requests and handles accept and reject actions', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, user: { name: 'User 1' } },
                { id: 2, user: { name: 'User 2' } }
            ],
        });

        render(<JoinRequests teamId={1} />);

        await waitFor(() => {
            expect(screen.getByText('User 1')).toBeInTheDocument();
            expect(screen.getByText('User 2')).toBeInTheDocument();
        });

        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

        fireEvent.click(screen.getAllByText('Aceptar')[0]);
        await waitFor(() => {
            expect(screen.queryByText('User 1')).not.toBeInTheDocument();
        });
        
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

        fireEvent.click(screen.getAllByText('Rechazar')[0]);
        await waitFor(() => {
            expect(screen.queryByText('User 2')).not.toBeInTheDocument();
        });
    });

    test('handles fetch errors gracefully', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        render(<JoinRequests teamId={1} />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching join requests:', new Error('Error fetching join requests'));
        });

        consoleSpy.mockRestore();
    });
});
