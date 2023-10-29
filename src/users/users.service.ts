import HttpException from "../application/exceptions/http-exceptions";
import HttpStatusCode from "../application/exceptions/statusCode";
import { UserCreateSchema, User } from "../auth/types/auth.interfaces";
import pool from "../db";

export async function getUsers(queryParameters?: any): Promise<User[]> {
  const client = await pool.connect();

  try {
    const { name } = queryParameters;

    let query = "SELECT * FROM users";
    const values = [];

    if (name) {
      query += " WHERE name = $1";
      values.push(name);
    }

    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getUserById(id: string): Promise<User> {
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM users WHERE id = $1";
    const values = [];
    values.push(id);
    const result = await client.query(query, values);
    if (result.rows.length <= 0) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, `user with id:${id} not found`)
    }
    let queryArmy = "SELECT * FROM armies WHERE user_id = $1"
    const army = await client.query(queryArmy, [id])
    return {...result.rows[0], army: army.rows[0]};
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}


export async function updateUser(id: string, updateData: Partial<UserCreateSchema>): Promise<User> {
  const client = await pool.connect();
  const {name, password, email} = updateData;
  const values = [id];

  let arrayWithChanges = [];
  if (name) {
    arrayWithChanges.push(`name=$${values.push(name)}`);
  }
  if (email) {
    arrayWithChanges.push(`email=$${values.push(email)}`);
  }
  if (password) {
    arrayWithChanges.push(`password=$${values.push(password)}`);
  }

  const changes = arrayWithChanges.join(', ');

  const queryUpd = `UPDATE users SET ${changes} WHERE id=$1 RETURNING *;`;

  try {
    if (arrayWithChanges.length === 0) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, "No valid fields provided for update");
    }

    const result = await client.query(queryUpd, values);
    if (result.rowCount == 0) throw new HttpException(HttpStatusCode.NOT_FOUND, "user not found");

    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteUser(id: string): Promise<User> {
  const client = await pool.connect();

  try {
    let query = "DELETE FROM users WHERE id=$1;";
    const values = [];
    values.push(id);
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    client.release();
  }
}