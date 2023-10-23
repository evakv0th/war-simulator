import { User } from "../auth/types/auth.interfaces";
import pool from "../db";

export async function getUsers(queryParameters?: any): Promise<User[]> {
    const client = await pool.connect();
  
    try {
        const { name } = queryParameters;

        let query = 'SELECT * FROM users';
        const values = [];

        if (name) {
            query += ' WHERE name = $1';
            values.push(name);
        }

        const result = await client.query(query, values);
        return result.rows;
    } catch (err) {
      console.error('Database Error:', err);
      throw err;
    } finally {
      client.release();
    }
  }