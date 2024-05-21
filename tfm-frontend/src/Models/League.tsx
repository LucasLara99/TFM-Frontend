export interface League {
    name: string;
    id: number;
    campus: { id: number, name: string };
    status: string;
    seasons?: Array<{ id: number, startDate: string, endDate: string, name: string }>;
    registrationPeriods?: Array<{ id: number, type: string, period: string, startDate: string, endDate: string }>;
    groups: Array<{
        id: number,
        name: string,
        teams: Array<{
            id: number,
            name: string,
            schedule: string,
            location: string,
            max_places: number,
            current_users: number,
            status: string
        }>
    }>;
}
