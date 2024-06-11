import { useState, useEffect } from 'react';
import { Team } from '../Models/Team';
import { useAuth } from './useAuth';
import axios from 'axios';
import { VITE_APP_API_URL } from '../constants';

const apiUrl = VITE_APP_API_URL;

export const useEquipos = () => {
    const { user } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [view, setView] = useState<'list' | 'clasificacion' | 'estadisticas' | 'partidos' | 'plantilla'>('list');
    const [matches, setMatches] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [editMatch, setEditMatch] = useState<any | null>(null);
    const [campuses, setCampuses] = useState<any[]>([]);
    const [classification, setClassification] = useState<any[]>([]);

    const goalsFor = selectedTeam ? matches.reduce((total, match) => {
        if (selectedTeam && match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-') {
            return total + (match.homeTeam.id === selectedTeam.id ? parseInt(match.homeTeamResult) : (match.awayTeam.id === selectedTeam.id ? parseInt(match.awayTeamResult) : 0));
        }
        return total;
    }, 0) : 0;

    const goalsAgainst = selectedTeam ? matches.reduce((total, match) => {
        if (selectedTeam && match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-') {
            return total + (match.homeTeam.id === selectedTeam.id ? parseInt(match.awayTeamResult) : (match.awayTeam.id === selectedTeam.id ? parseInt(match.homeTeamResult) : 0));
        }
        return total;
    }, 0) : 0;

    const statisticsData = [
        {
            title: "Partidos Jugados",
            value: matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-').length,
        },
        {
            title: "Partidos Ganados",
            value: matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && match.homeTeamResult > match.awayTeamResult).length,
        },
        {
            title: "Partidos Perdidos",
            value: matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && match.homeTeamResult < match.awayTeamResult).length,
        },
        {
            title: "Partidos Empatados",
            value: matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && match.homeTeamResult === match.awayTeamResult).length,
        },
        {
            title: "Porcentaje de Victorias",
            value: (
                matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-').length > 0 ?
                    (
                        matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && match.homeTeamResult > match.awayTeamResult).length /
                        matches.filter(match => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-').length * 100
                    ).toFixed(2) + "%" : "-"
            ),
        },
        {
            title: "Goles a Favor",
            value: goalsFor,
        },
        {
            title: "Goles en Contra",
            value: goalsAgainst,
        },
        {
            title: "Diferencia de Goles",
            value: goalsFor - goalsAgainst,
        },
        {
            title: "Partidos en Casa",
            value: selectedTeam ? matches.filter(match => match.homeTeam && match.homeTeam.id === selectedTeam.id).length : 0,
        },
        {
            title: "Partidos Fuera",
            value: selectedTeam ? matches.filter(match => match.awayTeam && match.awayTeam.id === selectedTeam.id).length : 0,
        },
    ];

    const formatDate = (dateString: string) => {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        fetchTeams();
    }, [user]);

    useEffect(() => {
        axios.get(`${apiUrl}/campuses`)
            .then(response => {
                setCampuses(response.data);
            })
            .catch(error => {
                console.error('Error fetching campuses:', error);
            });
    }, []);

    useEffect(() => {
        if (apiUrl && selectedTeam) {
            if (view === 'clasificacion' || view === 'estadisticas') {
                axios.get(`${apiUrl}/leagues/${selectedTeam.groupId}/teams`)
                    .then(response => {
                        setMatches(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching matches:', error);
                    });
            }

            if (view === 'estadisticas') {
                axios.get(`${apiUrl}/matches/team/${selectedTeam!.id}`)
                    .then(response => {
                        setMatches(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching matches:', error);
                    });
            }

            if (view === 'partidos' && user!.rol === 'ADMIN') {
                axios.get(`${apiUrl}/matches/group/${selectedTeam.groupId}`)
                    .then(response => {
                        setMatches(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching matches:', error);
                    });
            } else {
                axios.get(`${apiUrl}/matches/team/${selectedTeam.id}`)
                    .then(response => {
                        setMatches(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching matches:', error);
                    });
            }

            if (view === 'plantilla') {
                axios.get(`${apiUrl}/teams/${selectedTeam.id}/members`)
                    .then(response => {
                        setMembers(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching team members:', error);
                    });
            }
        }
    }, [view, apiUrl, selectedTeam]);

    useEffect(() => {
        const calculateClassification = async () => {
            const teamStats = await Promise.all(teams.map(async team => {
                const response = await axios.get(`${apiUrl}/matches/team/${team.id}`);
                const teamMatches = response.data;

                const matchesPlayed = teamMatches.filter((match: any) => match.homeTeam && match.awayTeam && match.homeTeamResult !== '-' && match.awayTeamResult !== '-' && (match.homeTeam.id === team.id || match.awayTeam.id === team.id));
                const matchesWon = matchesPlayed.filter((match: any) => (match.homeTeam && match.homeTeam.id === team.id && match.homeTeamResult > match.awayTeamResult) || (match.awayTeam && match.awayTeam.id === team.id && match.awayTeamResult > match.homeTeamResult));
                const matchesDrawn = matchesPlayed.filter((match: any) => match.homeTeamResult === match.awayTeamResult);
                const matchesLost = matchesPlayed.filter((match: any) => (match.homeTeam && match.homeTeam.id === team.id && match.homeTeamResult < match.awayTeamResult) || (match.awayTeam && match.awayTeam.id === team.id && match.awayTeamResult < match.homeTeamResult));
                const goalsFor = matchesPlayed.reduce((total: number, match: any) => total + (match.homeTeam && match.homeTeam.id === team.id ? parseInt(match.homeTeamResult) : parseInt(match.awayTeamResult)), 0);
                const goalsAgainst = matchesPlayed.reduce((total: number, match: any) => total + (match.homeTeam && match.homeTeam.id === team.id ? parseInt(match.awayTeamResult) : parseInt(match.homeTeamResult)), 0);
                const goalDifference = goalsFor - goalsAgainst;
                const points = (matchesWon.length * 3) + matchesDrawn.length;

                return {
                    team,
                    matchesPlayed: matchesPlayed.length,
                    matchesWon: matchesWon.length,
                    matchesDrawn: matchesDrawn.length,
                    matchesLost: matchesLost.length,
                    goalsFor,
                    goalsAgainst,
                    goalDifference,
                    points,
                };
            }));

            setClassification(teamStats.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference));
        };

        if (teams.length > 0) {
            calculateClassification();
        }
    }, [teams]);

    const handleTeamClick = (team: Team) => {
        setSelectedTeam(team);
        setView('clasificacion');
        axios.get(`${apiUrl}/teams/groups/${team.groupId}/teams`)
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });
    };

    const handleBackToList = () => {
        setSelectedTeam(null);
        setView('list');
        fetchTeams();
    };

    const handleViewChange = (newView: 'list' | 'clasificacion' | 'estadisticas' | 'partidos' | 'plantilla') => {
        setView(newView);
    };

    const handleEditMatch = (match: any) => {
        setEditMatch(match);
    };

    const handleUpdateMatch = (e: any) => {
        e.preventDefault();
        if (editMatch.homeTeamResult === '-' || editMatch.awayTeamResult === '-') {
            alert('Ambos equipos deben tener un resultado antes de actualizar el partido.');
            return;
        }
        axios.put(`${apiUrl}/matches/${editMatch.id}`, editMatch)
            .then(response => {
                setEditMatch(null);
                setMatches(matches.map(m => m.id === response.data.id ? response.data : m));
            })
            .catch(error => {
                console.error('Error updating match:', error);
            });
    };

    const fetchTeams = async () => {
        try {
            if (user!.rol === 'ADMIN') {
                const response = await axios.get(`${apiUrl}/teams/getall`);
                setTeams(response.data);
            } else {
                const response = await axios.get(`${apiUrl}/users/${user!.id}/teams`);
                setTeams(response.data);
            }

        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        if (name === 'date') {
            const [year, month, day] = value.split('-');
            setEditMatch({ ...editMatch, [name]: `${day}/${month}/${year}` });
        } else if (name === 'location') {
            const selectedCampus = campuses.find(campus => campus.name === value);
            setEditMatch({ ...editMatch, campus: selectedCampus });
        } else {
            setEditMatch({ ...editMatch, [name]: value });
        }
    };

    return {
        teams,
        selectedTeam,
        view,
        classification,
        statisticsData,
        matches,
        members,
        campuses,
        user,
        editMatch,
        handleTeamClick,
        handleBackToList,
        handleViewChange,
        handleEditMatch,
        handleUpdateMatch,
        handleChange,
        setEditMatch,
        formatDate
    };
}