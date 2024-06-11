import { useMutation } from '@tanstack/react-query';
import { User } from '../Models/User';
import { VITE_APP_API_URL } from '../constants';

const apiUrl = VITE_APP_API_URL;

const useRegister = () => {

    const mutation = useMutation({
        mutationFn: async (newUser: User) => {
            const response = await fetch(`${apiUrl}/register`, {
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
        onSuccess: (data) => {
            console.log('Registration successful', data);
        },
        onError: (error) => {
            console.error('Registration error:', error);
        }
    })

    return mutation;
}

export default useRegister;