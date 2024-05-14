import './Main.css';
import Header from '../Header/Header';

const Main = () => {
    return (
        <div className="main-page">
            <Header />
            <div className='title-subtitle-container'>
                <h1 className='main-title'>Bienvenido a UDC Leagues</h1>
                <h3 className='main-subtitle'>Uniendo a la comunidad universitaria a través del deporte</h3>
            </div>
        </div>
    );
};

export default Main;