import { createSchool, getAllSchools } from '../../lib/schools.js';
import { initDatabase } from '../../lib/db.js';

export default async function handler(req, res) {
  // Initialize database on first request
  await initDatabase();
  
  if (req.method === 'POST') {
    try {
      console.log('Received school data:', req.body);
      const schoolId = await createSchool(req.body);
      console.log('School created with ID:', schoolId);
      res.status(201).json({ success: true, id: schoolId });
    } catch (error) {
      console.error('Error creating school:', error);
      res.status(500).json({ success: false, error: 'Failed to create school', details: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const schools = await getAllSchools();
      res.status(200).json(schools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch schools' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
