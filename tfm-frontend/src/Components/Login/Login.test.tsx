import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../../Hooks/useAuth';

jest.mock('../../Hooks/useAuth');

// Mock de constantes
jest.mock('../../constants', () => ({
  VITE_APP_API_URL: 'http://mocked-api-url.com',
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form elements', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText(/Inicia sesión/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
  });

  test('shows error message when fields are empty', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Iniciar Sesión/i));

    expect(screen.getByText(/Los campos no pueden estar vacíos/i)).toBeInTheDocument();
  });

  test('shows error message for invalid email format', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/Iniciar Sesión/i));

    expect(screen.getByText(/El formato del email no es válido/i)).toBeInTheDocument();
  });

  test('calls login function with correct credentials', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/Iniciar Sesión/i));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
    expect(screen.queryByText(/Los campos no pueden estar vacíos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/El formato del email no es válido/i)).not.toBeInTheDocument();
  });
});
