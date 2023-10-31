import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const connectionConfig = {
  host: process.env.DATABASE_HOST as any,
  port: process.env.DATABASE_PORT as any,
  user: process.env.DATABASE_USERNAME as any,
  password: process.env.DATABASE_PASSWORD as any,
  database: "postgres",
};

const client = new Client(connectionConfig);

const newDatabaseName = process.env.DATABASE_NAME;

const createDatabaseQuery = `CREATE DATABASE "${newDatabaseName}"`;

export async function createDatabase() {
  try {
    await client.connect();

    const databaseExistsQuery = `
      SELECT datname FROM pg_database WHERE datname = $1
    `;
    const result = await client.query(databaseExistsQuery, [newDatabaseName]);

    if (result.rows.length === 0) {
      await client.query(createDatabaseQuery);
      console.log(`Database '${newDatabaseName}' created successfully.`);
    } else {
      console.log(`Database '${newDatabaseName}' already exists.`);
    }

    await client.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

export default createDatabase;
