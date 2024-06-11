import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Hooks/useAuth';
import './JoinRequests.css';
import { VITE_APP_API_URL } from '../../constants';

const apiUrl = VITE_APP_API_URL;

interface Request {
    id: number;
    user: { name: string } | null;
}

interface JoinRequestsProps {
    teamId: number;
}

const JoinRequests: React.FC<JoinRequestsProps> = ({ teamId }) => {
    const { user } = useAuth();
    const [joinRequests, setJoinRequests] = useState<Request[]>([]);

    useEffect(() => {
        const fetchJoinRequests = async () => {
            try {
                const response = await fetch(`${apiUrl}/leagues/${teamId}/requests`, {
                    headers: {
                        'Authorization': `Bearer ${user!.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error fetching join requests');
                }

                const data = await response.json();
                setJoinRequests(data);
            } catch (error) {
                console.error('Error fetching join requests:', error);
            }
        };

        fetchJoinRequests();
    }, [teamId, user!.token]);

    const handleRequest = async (requestId: number, action: 'accept' | 'reject') => {
        try {
            const response = await fetch(`${apiUrl}/leagues/${teamId}/requests/${requestId}/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user!.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user!.id)
            });

            if (!response.ok) {
                throw new Error('Error handling join request');
            }

            setJoinRequests(joinRequests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error('Error handling join request:', error);
        }
    };

    return (
        <div className="join-requests-container">
            <h2 className='join-requests-title'>Solicitudes de Unión</h2>
            {joinRequests.length === 0 ? (
                <p>No hay solicitudes pendientes.</p>
            ) : (
                joinRequests.map(request => (
                    <div key={request.id} className="join-request">
                        <p>{request.user?.name}</p>
                        <div className='join-request-actions'>
                            <button onClick={() => handleRequest(request.id, 'accept')}>Aceptar</button>
                            <button onClick={() => handleRequest(request.id, 'reject')}>Rechazar</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default JoinRequests;
