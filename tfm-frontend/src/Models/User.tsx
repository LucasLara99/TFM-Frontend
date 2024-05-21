export interface User {
    id?: number;
    email: string;
    name: string;
    password?: string;
    rol?: string;
    facultad?: string;
    token?: string;
    teams?: Array<{ id: number; name: string }>;
}