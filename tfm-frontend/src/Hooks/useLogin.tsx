import { useMutation } from '@tanstack/react-query';
import { User } from '../Models/User';

const API_URL = 'http://localhost:8080/login';

export const useLogin = () => {

    const mutation = useMutation({
        mutationFn: async (newUser: User) => {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Server response:', text);
                throw new Error('Network response was not ok');
            }

            return response.json();
        },
        onSuccess: () => {
            console.log('Login successful');
        },
        onError: (error) => {
            console.error('Login error:', error);
        }
    })
    return mutation
}