import { useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Hooks/useAuth';
import './CreateTeamForm.css';
import { AuthContext } from '../../Hooks/useAuth';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CreateTeamForm = ({ leagueId, groupId, onClose }: { leagueId: number; groupId: number; onClose: () => void }) => {
    const [teamName, setTeamName] = useState('');
    const [schedule, setSchedule] = useState('');
    const [location, setLocation] = useState('');
    const [maxPlaces, setMaxPlaces] = useState('');
    const { user, userTeams } = useAuth();

    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('Auth context is undefined');
    }
    const { setUserTeams } = authContext;

    const handleCreateTeam = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (!user) {
            alert("Debes estar logueado para crear un equipo.");
            return;
        }

        const maxPlacesValue = parseInt(maxPlaces);

        if (isNaN(maxPlacesValue) || maxPlacesValue < 0) {
            alert("El número máximo de plazas no puede ser negativo.");
            return;
        }

        const newTeam = {
            team: {
                name: teamName,
                schedule,
                location,
                maxPlaces: maxPlacesValue,
            },
            userId: user.id,
        };

        try {
            const response = await axios.post(`${apiUrl}/leagues/${leagueId}/groups/${groupId}/teams`, newTeam, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const createdTeam = response.data;
            const newTeams = [...userTeams, createdTeam];
            setUserTeams(newTeams);
            onClose();
            window.location.reload();
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
                <button type="submit">Crear</button>
                <button type="button" onClick={onClose}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CreateTeamForm;
