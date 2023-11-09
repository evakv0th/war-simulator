import { Weapon } from "./weapons.interfaces";

export const weaponsForTest: Weapon[] = [
    {
        id: 1,
        name: "weapon1",
        strength: 100,
        bullets_req: 100,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 2,
        name: "weapon2",
        strength: 200,
        bullets_req: 150,
        created_at: new Date(),
        updated_at: new Date()
    }
]