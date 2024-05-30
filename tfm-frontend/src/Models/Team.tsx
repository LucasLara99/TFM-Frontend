import { User } from "./User";

export interface Team {
    id: number;
    name: string;
    schedule: string;
    location: string;
    maxPlaces: number;
    currentUsers: number;
    groupId?: number;
    captain?: User;
}
