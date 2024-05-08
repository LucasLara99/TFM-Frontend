import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../Models/User';

const API_URL = 'http://localhost:8080/register';

const useRegister = () => {
    const queryClient = useQueryClient();

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
                throw new Error('Network response was not ok');
            }

            return response.json();
        },
        onSuccess: (data) => {
            console.log('Registration successful', data);
        },
        onError: (error, newUser) => {
            if (error.message.includes('409')) {
                console.error('Registration error: User already exists', newUser);
            } else {
                console.error('Registration error:', error);
            }
        }
    })

    return mutation;
}

export default useRegister;