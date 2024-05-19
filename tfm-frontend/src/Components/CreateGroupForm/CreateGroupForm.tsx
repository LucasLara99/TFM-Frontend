import { useState } from 'react';
import axios from 'axios';
import './CreateGroupForm.css';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CreateGroupForm = ({ leagueId, onClose }: { leagueId: number; onClose: () => void }) => {
    const [groupName, setGroupName] = useState('');
    const [schedule, setSchedule] = useState('');
    const [location, setLocation] = useState('');
    const [maxPlaces, setMaxPlaces] = useState('');
    const [currentUsers, setCurrentUsers] = useState('');
    const [status, setStatus] = useState('');

    const handleCreateGroup = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const maxPlacesValue = parseInt(maxPlaces);
        const currentUsersValue = parseInt(currentUsers);

        if (maxPlacesValue < 0 || currentUsersValue < 0) {
            alert("Los valores de máximo de plazas y usuarios actuales no pueden ser negativos.");
            return;
        }

        const newGroup = {
            name: groupName,
            schedule,
            location,
            maxPlaces: maxPlacesValue,
            currentUsers: currentUsersValue,
            status,
        };

        try {
            await axios.post(`${apiUrl}/leagues/${leagueId}/groups`, newGroup);
            onClose();
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <div className="create-group-form-container">
            <h2>Crear Nuevo Grupo</h2>
            <form onSubmit={handleCreateGroup}>
                <div>
                    <label>Nombre del Grupo</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Horario</label>
                    <input
                        type="text"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Ubicación</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Máximo de Plazas</label>
                    <input
                        type="number"
                        value={maxPlaces}
                        onChange={(e) => setMaxPlaces(e.target.value)}
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label>Usuarios Actuales</label>
                    <input
                        type="number"
                        value={currentUsers}
                        onChange={(e) => setCurrentUsers(e.target.value)}
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label>Estado</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Crear</button>
                <button type="button" onClick={onClose}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CreateGroupForm;
