import { User } from "./auth.interfaces";

export const usersForTest: User[] = [
    {
        id: 1,
        name: "user1",
        password: 'user',
        email: "user@gmail.com",
        type: "admin",
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 2,
        name: "user2",
        password: 'user2',
        email: "user2@gmail.com",
        type: "user",
        created_at: new Date(),
        updated_at: new Date()
    }
]