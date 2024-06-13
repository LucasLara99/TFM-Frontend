
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from './Landing';

// Mock de la imagen
jest.mock('../../assets/landing.png', () => 'mocked-image.png');

describe('Landing component', () => {
    test('renders landing page with title, subtitle, buttons, and image', () => {
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        // Verificar que el título se renderiza
        expect(screen.getByText('Bienvenidx a UDC Leagues')).toBeInTheDocument();
        // Verificar que el subtítulo se renderiza
        expect(screen.getByText('Tu plataforma para ligas deportivas')).toBeInTheDocument();
        // Verificar que el botón de registrarse se renderiza
        expect(screen.getByText('Registrarse')).toBeInTheDocument();
        // Verificar que el botón de iniciar sesión se renderiza
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
        // Verificar que la imagen se renderiza
        expect(screen.getByAltText('imagen fondo')).toHaveAttribute('src', 'mocked-image.png');
    });
});
