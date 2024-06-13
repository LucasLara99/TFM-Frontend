import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../../Hooks/useAuth';

jest.mock('../../Hooks/useAuth');

// Mock de constantes
jest.mock('../../constants', () => ({
    VITE_APP_API_URL: 'http://mocked-api-url.com',
}));

describe('PrivateRoute component', () => {
    const mockUser = { id: 1, username: 'testuser' };

    const MockChildComponent: React.FC = () => <div data-testid="child-component">Child Component</div>;

    test('renders loading state when user is loading', () => {
        (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });

        render(
            <MemoryRouter>
                <PrivateRoute>
                    <MockChildComponent />
                </PrivateRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();
    });

    test('renders child component when user is authenticated', () => {
        (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });

        render(
            <MemoryRouter>
                <PrivateRoute>
                    <MockChildComponent />
                </PrivateRoute>
            </MemoryRouter>
        );

        expect(screen.getByTestId('child-component')).toBeInTheDocument();
    });

    test('redirects to login page when user is not authenticated', () => {
        (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

        const { container } = render(
            <MemoryRouter initialEntries={['/private-route']}>
                <PrivateRoute>
                    <MockChildComponent />
                </PrivateRoute>
            </MemoryRouter>
        );

        expect(container.innerHTML).toMatch('Loading...');
        expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();
        expect(container.innerHTML).toMatch('/login');
    });
});
