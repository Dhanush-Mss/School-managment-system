import { getConnection } from './db.js';

export async function createSchool(schoolData) {
  const conn = await getConnection();
  const { name, address, city, state, contact, image, email_id } = schoolData;
  
  const [result] = await conn.execute(
    'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, address, city, state, contact, image, email_id]
  );
  
  return result.insertId;
}

export async function getAllSchools() {
  const conn = await getConnection();
  const [rows] = await conn.execute('SELECT * FROM schools ORDER BY created_at DESC');
  return rows;
}

export async function getSchoolById(id) {
  const conn = await getConnection();
  const [rows] = await conn.execute('SELECT * FROM schools WHERE id = ?', [id]);
  return rows[0];
}
