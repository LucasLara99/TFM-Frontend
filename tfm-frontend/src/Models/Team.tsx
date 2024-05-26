import { User } from "./User";

export interface Team {
    id: number;
    name: string;
    schedule: string;
    location: string;
    max_places: number;
    current_users: number;
    captain?: User;
}
