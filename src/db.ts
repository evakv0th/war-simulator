import { Pool } from "pg";
import createDatabase from "./create-db";

export const pool = new Pool({
  host: "db",
  port: 5432,
  user: "test",
  password: "test",
  database: "test",
});

createDatabase().then(() => {
  const createEnumUsersType = `
    CREATE TYPE user_type AS ENUM ('admin', 'user');
`;

  const createEnumArmyAdv = `
    CREATE TYPE army_advantage AS ENUM ('air', 'heavy_tech', 'minefield', 'patriotic');
`;

  const createUsersQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        type user_type,
        email VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`;

  const createArmiesQuery = `
    CREATE TABLE IF NOT EXISTS armies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        advantage army_advantage,
        user_id INT UNIQUE REFERENCES users(id),
        fuel_amount INTEGER CHECK (fuel_amount <= 1000),
        bullets_amount INTEGER CHECK (bullets_amount <= 1000),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`;

  const createTanksQuery = `
    CREATE TABLE IF NOT EXISTS tanks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        strength INTEGER CHECK (strength <= 300),
        fuel_req INTEGER CHECK (fuel_req <= 400),
        army_id INT REFERENCES armies(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`;

  const createPlanesQuery = `
    CREATE TABLE IF NOT EXISTS planes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        air_strength INTEGER CHECK (air_strength <= 400),
        surface_strength INTEGER CHECK (surface_strength <= 100),
        fuel_req INTEGER CHECK (fuel_req <= 400),
        army_id INT REFERENCES armies(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

`;
  const createSquadsQuery = `
    CREATE TABLE IF NOT EXISTS squads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        army_id INT REFERENCES armies(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`;

  const createWeaponsQuery = `
    CREATE TABLE IF NOT EXISTS weapons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        strength INTEGER CHECK (strength <= 200),
        bullets_req INTEGER CHECK (bullets_req <= 300),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`;

  const createSquadsWeaponsQuery = `
    CREATE TABLE IF NOT EXISTS squads_weapons (
        squad_id INT REFERENCES squads(id),
        weapon_id INT REFERENCES weapons(id),
        PRIMARY KEY (squad_id, weapon_id)
    );
`;

  const checkUserEnumExistsQuery = `
    SELECT 1
    FROM pg_type
    WHERE typname = 'user_type' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
`;

  const checkArmyEnumExistsQuery = `
    SELECT 1
    FROM pg_type
    WHERE typname = 'army_advantage' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
`;

  (async () => {
    try {
      const client = await pool.connect();

      try {
        const result = await client.query(checkUserEnumExistsQuery);
        const enumExists = result.rows.length > 0;

        if (!enumExists) {
          await client.query(createEnumUsersType);
          console.log("ENUM created successfully");
        } else {
          console.log("ENUM already exists");
        }

        const resultArmyEnum = await client.query(checkArmyEnumExistsQuery);
        const armyEnumExists = resultArmyEnum.rows.length > 0;

        if (!armyEnumExists) {
          await client.query(createEnumArmyAdv);
          console.log("ENUM army created successfully");
        } else {
          console.log("ENUM army already exists");
        }

        await client.query(createUsersQuery);
        console.log("Table users is up");
        await client.query(createArmiesQuery);
        console.log("Table army is up");
        await client.query(createTanksQuery);
        console.log("Table tanks is up");
        await client.query(createPlanesQuery);
        console.log("Table planes is up");
        await client.query(createSquadsQuery);
        console.log("Table squads is up");
        await client.query(createWeaponsQuery);
        console.log("Table weapons is up");
        await client.query(createSquadsWeaponsQuery);
        console.log("Table squads_weapons is up");
      } finally {
        client.release();
      }
    } catch (err) {
      console.error("Error:", err);
    }
  })();
});
export default pool;
