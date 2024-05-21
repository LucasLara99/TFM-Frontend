import { useState } from 'react';
import axios from 'axios';
import './CreateTeamForm.css';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CreateTeamForm = ({ leagueId, groupId, onClose }: { leagueId: number; groupId: number; onClose: () => void }) => {
    const [teamName, setTeamName] = useState('');
    const [schedule, setSchedule] = useState('');
    const [location, setLocation] = useState('');
    const [maxPlaces, setMaxPlaces] = useState('');
    const [currentUsers, setCurrentUsers] = useState('');
    const [status, setStatus] = useState('');

    const handleCreateTeam = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const maxPlacesValue = parseInt(maxPlaces);
        const currentUsersValue = parseInt(currentUsers);

        if (isNaN(maxPlacesValue) || isNaN(currentUsersValue) || maxPlacesValue < 0 || currentUsersValue < 0) {
            alert("Los valores de máximo de plazas y usuarios actuales deben ser números no negativos.");
            return;
        }

        const newTeam = {
            name: teamName,
            schedule,
            location,
            maxPlaces: maxPlacesValue,
            currentUsers: currentUsersValue,
            status,
        };

        try {
            await axios.post(`${apiUrl}/leagues/${leagueId}/groups/${groupId}/teams`, newTeam);
            onClose();
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    return (
        <div className="create-team-form-container">
            <h2>Crear Nuevo Equipo</h2>
            <form onSubmit={handleCreateTeam}>
            <div>
                    <label>Nombre del Equipo</label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
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
                        type="text"
                        value={maxPlaces}
                        onChange={(e) => setMaxPlaces(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Usuarios Actuales</label>
                    <input
                        type="text"
                        value={currentUsers}
                        onChange={(e) => setCurrentUsers(e.target.value)}
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

export default CreateTeamForm;
