import { useState, useEffect } from 'react';
import { League } from '../Models/League';
import { useAuth } from '../Hooks/useAuth';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const leagueEndpoints = {
    'Fútbol': 1,
    'Fútbol sala': 2,
    'Tenis': 3,
    'Voleibol': 4,
    'Rugby': 5,
    'Baloncesto': 6,
    'Balonmano': 7,
    'Atletismo': 8,
    'Pádel': 9
};

export const useLeagues = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCreateTeamForm, setShowCreateTeamForm] = useState<{ [key: number]: boolean }>({});
    const [hideCreateButton, setHideCreateButton] = useState(false);
    const [rotateInfo, setRotateInfo] = useState(false);
    const [rotateImage, setRotateImage] = useState(false);
    const [direction, setDirection] = useState('right');
    const { user } = useAuth();

    const toggleCreateTeamForm = (groupId: number) => {
        setShowCreateTeamForm((prevState) => {
            const isFormVisible = !prevState[groupId];
            setHideCreateButton(isFormVisible);
            return {
                ...prevState,
                [groupId]: isFormVisible,
            };
        });
    };

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const leagueIds = Object.values(leagueEndpoints);
                const leagueDataPromises = leagueIds.map(id =>
                    fetch(`${apiUrl}/leagues/${id}`).then(response => response.json())
                );

                const leagueData = await Promise.all(leagueDataPromises);
                setLeagues(leagueData);
            } catch (error) {
                console.error('Error fetching leagues:', error);
            }
        };

        fetchLeagues();
    }, []);

    const nextLeague = () => {
        setRotateInfo(true);
        setRotateImage(true);
        setDirection('right');
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % leagues.length);
            setRotateInfo(false);
            setRotateImage(false);
        }, 500);
    };

    const prevLeague = () => {
        setRotateInfo(true);
        setRotateImage(true);
        setDirection('left');
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + leagues.length) % leagues.length);
            setRotateInfo(false);
            setRotateImage(false);
        }, 500);
    };

    const handleJoinTeam = async (teamId: number) => {
        if (!user) {
            alert('Debes estar logueado para unirte a un equipo.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/teams/${teamId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user.id),
            });

            if (!response.ok) {
                throw new Error('Error al unirse al equipo');
            }

            alert('Te has unido al equipo exitosamente.');
        } catch (error) {
            console.error('Error joining team:', error);
            alert('Error al unirse al equipo. Inténtalo de nuevo más tarde.');
        }
    };

    return {
        leagues,
        currentIndex,
        showCreateTeamForm,
        hideCreateButton,
        rotateInfo,
        rotateImage,
        direction,
        toggleCreateTeamForm,
        nextLeague,
        prevLeague,
        handleJoinTeam
    };
};