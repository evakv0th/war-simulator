import { Tank } from "./tanks.interfaces";

export const tanksForTest: Tank[] = [
    {
        id: 1,
        name: "tank1",
        strength: 150,
        fuel_req: 100,
        army_id: 1,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 2,
        name: "tank2",
        strength: 150,
        fuel_req: 100,
        army_id: 2,
        created_at: new Date(),
        updated_at: new Date()
    }
]