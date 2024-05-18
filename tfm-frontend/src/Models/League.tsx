export interface League {
    name: string;
    id: number;
    season: string;
    campus: string;
    status: string;
    periods: Array<{ id: number, startDate: string, endDate: string, name: string }>;
    registrations: Array<{ id: number, type: string, period: string, startDate: string, endDate: string }>;
    groups: Array<{
        id: number,
        name: string,
        schedule: string,
        location: string,
        maxPlaces: number,
        currentUsers: number,
        status: string
    }>;
}