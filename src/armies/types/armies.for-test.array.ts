import { Army, ArmyAdvantage } from "./armies.interfaces";

export const armiesForTest: Army[] = [
    {
        id: 1,
        name: "army1",
        advantage: ArmyAdvantage.AIR,
        user_id: 1,
        fuel_amount: 1000,
        bullets_amount: 1000,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: 2,
        name: "army2",
        advantage: ArmyAdvantage.HEAVY_TECH,
        user_id: 2,
        fuel_amount: 500,
        bullets_amount: 500,
        created_at: new Date(),
        updated_at: new Date()
    }
]