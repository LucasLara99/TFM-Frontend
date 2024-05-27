import './Perfil.css';
import { useAuth } from '../../Hooks/useAuth';
import Header from '../Header/Header';
import qrImg from '../../assets/qr-code.svg';

const Perfil = () => {
    const { user, userTeams } = useAuth();

    return (
        <div className="profile-page">
            <Header />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-content">
                        <div className="profile-qr">
                            <img src={qrImg} alt="QR Code" className="qr-code" />
                        </div>
                        <div className="profile-details">
                            <h2 className="profile-name">{user?.name || 'Nombre no disponible'}</h2>
                            <p className="profile-detail"><strong>Email:</strong> {user?.email}</p>
                            <p className="profile-detail"><strong>Facultad:</strong> {user?.facultad || 'No especificado'}</p>
                            {userTeams && userTeams.length > 0 && (
                                <div className="profile-teams">
                                    <strong>Equipos:</strong>
                                    <ul className="team-list">
                                        {userTeams.map(team => (
                                            <li key={team.id} className="team-item">{team.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
