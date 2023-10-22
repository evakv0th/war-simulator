import { Pool } from "pg";
export const pool = new Pool({
  host: "db",
  port: 5432,
  user: "test",
  password: "test",
  database: "test",
});

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
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    );
`;

const createArmiesQuery = `
    CREATE TABLE IF NOT EXISTS armies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        advantage army_advantage,
        user_id INT REFERENCES users(id),
        fuel_amount INTEGER,
        bullets_amount INTEGER,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
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
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    pool.end();
  }
})();
