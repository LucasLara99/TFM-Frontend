import { render, screen } from '@testing-library/react';
import Perfil from './Perfil';
import { useAuth } from '../../Hooks/useAuth';

// Mock del componente Header
jest.mock('../Header/Header', () => () => <div>Mocked Header</div>);

// Mock del hook useAuth
jest.mock('../../Hooks/useAuth');

// Mock de constantes
jest.mock('../../constants', () => ({
    VITE_APP_API_URL: 'http://mocked-api-url.com',
}));

describe('Perfil component', () => {
    const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        facultad: 'Ingeniería',
        token: 'mockToken',
    };

    const mockUserTeams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
    ];

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
            userTeams: mockUserTeams,
        });
    });

    test('renders profile with user details and teams', () => {
        render(<Perfil />);

        expect(screen.getByText('Mocked Header')).toBeInTheDocument();

        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
        expect(screen.getByText((_, node) => {
            if (!node) return false;
            const hasText = (node.textContent || '').includes(`Email: ${mockUser.email}`);
            const nodeHasText = hasText;
            const childrenDontHaveText = Array.from(node.children).every(
                (child) => !hasText || !child.textContent?.includes(`Email: ${mockUser.email}`)
            );

            return nodeHasText && childrenDontHaveText;
        })).toBeInTheDocument();

        expect(screen.getByText((_, node) => {
            if (!node) return false;
            const hasText = (node.textContent || '').includes(`Facultad: ${mockUser.facultad}`);
            const nodeHasText = hasText;
            const childrenDontHaveText = Array.from(node.children).every(
                (child) => !hasText || !child.textContent?.includes(`Facultad: ${mockUser.facultad}`)
            );

            return nodeHasText && childrenDontHaveText;
        })).toBeInTheDocument();

        mockUserTeams.forEach(team => {
            expect(screen.getByText(team.name)).toBeInTheDocument();
        });
    });

    test('renders profile with missing user details', () => {
        const mockUserWithMissingDetails = {
            ...mockUser,
            name: null,
            facultad: null,
        };

        (useAuth as jest.Mock).mockReturnValue({
            user: mockUserWithMissingDetails,
            userTeams: mockUserTeams,
        });

        render(<Perfil />);

        expect(screen.getByText('Nombre no disponible')).toBeInTheDocument();

        expect(screen.getByText((_, node) => {
            if (!node) return false;
            const hasText = (node.textContent || '').includes('Facultad: No especificado');
            const nodeHasText = hasText;
            const childrenDontHaveText = Array.from(node.children).every(
                (child) => !hasText || !child.textContent?.includes('Facultad: No especificado')
            );

            return nodeHasText && childrenDontHaveText;
        })).toBeInTheDocument();
    });
});
