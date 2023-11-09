import { Plane } from "./planes.interfaces";


export const planesForTest: Plane[] = [
    {
        id: 1,
        name: "plane1",
        army_id: 1,
        air_strength: 300,
        surface_strength: 100,
        fuel_req: 100,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 2,
        name: "plane2",
        army_id: 2,
        air_strength: 400,
        surface_strength: 50,
        fuel_req: 200,
        created_at: new Date(),
        updated_at: new Date()
    }
]