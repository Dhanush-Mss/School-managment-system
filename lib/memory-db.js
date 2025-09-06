// In-memory database for demo purposes when no real database is available
let schools = [];
let nextId = 1;

export function createSchool(schoolData) {
  const school = {
    id: nextId++,
    ...schoolData,
    created_at: new Date().toISOString()
  };
  schools.push(school);
  return school.id;
}

export function getAllSchools() {
  return schools.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function getSchoolById(id) {
  return schools.find(school => school.id === parseInt(id));
}

export function deleteSchool(id) {
  const index = schools.findIndex(school => school.id === parseInt(id));
  if (index > -1) {
    schools.splice(index, 1);
    return true;
  }
  return false;
}
