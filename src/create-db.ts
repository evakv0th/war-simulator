import { Client } from 'pg';

const connectionConfig = {
  host: 'db', 
  port: 5432,
  user: 'test',
  password: 'test',
  database: 'postgres',
};

const client = new Client(connectionConfig);

const newDatabaseName = 'test';

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
    console.error('Error:', error);
  }
}

export default createDatabase;