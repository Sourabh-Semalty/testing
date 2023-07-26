import mysql from "mysql2/promise";
import config from "./config";

export async function sqlInsert(
  sql: string,
  params?: unknown[]
): Promise<number> {
  const rows = await sqlQuery(sql, params);
  return (rows as mysql.ResultSetHeader).insertId;
}
export async function sqlUpdate(
  sql: string,
  params?: unknown[]
): Promise<number> {
  const rows = await sqlQuery(sql, params);
  return (rows as mysql.ResultSetHeader).affectedRows;
}
export async function sqlSelect(
  sql: string,
  params?: unknown[]
): Promise<mysql.RowDataPacket> {
  const rows = await sqlQuery(sql, params);
  return rows as mysql.RowDataPacket;
}

export async function sqlQuery(sql: string, params?: unknown[]) {
  const [rows] = await getPool().query(sql, params);
  return rows;
}

let pool: mysql.Pool | undefined;
function getPool() {
  if (pool) return pool;
  const connStr = config.mysqlConnStr;

  if (!connStr)
    throw new Error("Environment variable SERVICE_MYSQL is not set.");
  pool = mysql.createPool({ uri: connStr });
  return pool;
}
