import { getConnection } from './db.js';
import * as memoryDb from './memory-db.js';

let useMemoryDb = false;
let dbInitialized = false;

async function initializeDb() {
  if (dbInitialized) return;
  
  try {
    await getConnection();
    console.log('Database connection successful');
    useMemoryDb = false;
  } catch (error) {
    console.log('Database connection failed, using in-memory storage:', error.message);
    useMemoryDb = true;
  }
  dbInitialized = true;
}

export async function createSchool(schoolData) {
  await initializeDb();
  
  if (useMemoryDb) {
    return memoryDb.createSchool(schoolData);
  }
  
  try {
    const conn = await getConnection();
    const { name, address, city, state, contact, image, email_id } = schoolData;
    
    const [result] = await conn.query(
      'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, image || null, email_id]
    );
    
    return result.insertId;
  } catch (error) {
    console.log('Falling back to memory database');
    useMemoryDb = true;
    return memoryDb.createSchool(schoolData);
  }
}

export async function getAllSchools() {
  await initializeDb();
  
  if (useMemoryDb) {
    return memoryDb.getAllSchools();
  }
  
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM schools ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.log('Falling back to memory database');
    useMemoryDb = true;
    return memoryDb.getAllSchools();
  }
}

export async function getSchoolById(id) {
  await initializeDb();
  
  if (useMemoryDb) {
    return memoryDb.getSchoolById(id);
  }
  
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM schools WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.log('Falling back to memory database');
    useMemoryDb = true;
    return memoryDb.getSchoolById(id);
  }
}
