import { render, act } from '@testing-library/react';
import useRegister from './useRegister';
import { useMutation } from '@tanstack/react-query';

// Mock de constantes
jest.mock('../constants', () => ({
    VITE_APP_API_URL: 'http://mocked-api-url.com',
}));

// Mocks necesarios para las pruebas
jest.mock('@tanstack/react-query', () => ({
    useMutation: jest.fn(),
}));

const mockMutate = jest.fn();
const mockUseMutation = useMutation as jest.Mock;
mockUseMutation.mockReturnValue({ mutate: mockMutate });

const TestComponent = () => {
    const mutation = useRegister();
    return (
        <div>
            <button onClick={() => mutation.mutate({ email: 'test@example.com', password: 'password' })}>Register</button>
        </div>
    );
};

describe('useRegister hook', () => {
    beforeEach(() => {
        mockMutate.mockReset();
    });

    it('should call mutate function on registration attempt', () => {
        render(<TestComponent />);
        act(() => {
            document.querySelector('button')!.click();
        });
        expect(mockMutate).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    });
});