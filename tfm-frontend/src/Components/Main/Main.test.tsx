import { render, screen } from '@testing-library/react';
import Main from './Main';

// Mock del componente Header
jest.mock('../Header/Header', () => () => <div>Mocked Header</div>);

describe('Main component', () => {
    test('renders Main page with Header, title, and subtitle', () => {
        render(<Main />);

        // Verificar que el componente Header se renderiza
        expect(screen.getByText('Mocked Header')).toBeInTheDocument();
        // Verificar que el título se renderiza
        expect(screen.getByText('Bienvenido a UDC Leagues')).toBeInTheDocument();
        // Verificar que el subtítulo se renderiza
        expect(screen.getByText('Uniendo a la comunidad universitaria a través del deporte')).toBeInTheDocument();
    });
});
