import { AuthResponse, StudentRecord, UserProfile } from "@/types";

// Simulate network delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==============================
// === MOCKED DATABASE (SOURCE OF TRUTH)
// ==============================

let mockUsersDb: UserProfile[] = [
  { id: 'admin-01', name: 'Admin User', email: 'admin@test.com', role: 'admin', phone: '123-456-7890' },
  { id: 'student-01', name: 'Student User', email: 'student@test.com', role: 'student', phone: '098-765-4321', course: 'Computer Science', enrollmentYear: 2022 },
  { id: 's1', name: 'Alice Johnson', email: 'alice@test.com', role: 'student', phone: '111-222-3333', course: 'Web Development', enrollmentYear: 2023 },
  { id: 's2', name: 'Bob Williams', email: 'bob@test.com', role: 'student', phone: '444-555-6666', course: 'Data Science', enrollmentYear: 2022 },
  { id: 's3', name: 'Charlie Brown', email: 'charlie@test.com', role: 'student', phone: '777-888-9999', course: 'UX/UI Design', enrollmentYear: 2023 },
  { id: 's4', name: 'Diana Prince', email: 'diana@test.com', role: 'student', phone: '121-232-3434', course: 'Data Science', enrollmentYear: 2024 },
];

// ==============================
// === UTILITY FUNCTION: StudentRecord Mapping
// ==============================

const getStudentRecords = (): StudentRecord[] => {
  return mockUsersDb
    .filter(user => user.role === 'student')
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      course: user.course || 'N/A',
      enrollmentYear: user.enrollmentYear || 0,
      status: (user.enrollmentYear && user.enrollmentYear < 2023) ? 'Graduated' : 'Active',
    }));
};

// ==============================
// === AUTHENTICATION
// ==============================

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  await delay(500);
  const user = mockUsersDb.find(u => u.email === email);
  if (user && ((user.role === 'admin' && password === 'admin123') || (user.role === 'student' && password === 'student123'))) {
    return { user, token: `mock-jwt-for-${user.id}` };
  }
  throw new Error('Invalid credentials. Use admin@test.com or student@test.com');
};

export const registerUser = async (userData: Partial<UserProfile>): Promise<UserProfile> => {
  await delay(500);
  if (mockUsersDb.some(user => user.email === userData.email)) {
    throw new Error('An account with this email already exists.');
  }
  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name: userData.name || 'New User',
    email: userData.email || 'new@test.com',
    role: 'student',
    phone: userData.phone,
    course: userData.course,
    enrollmentYear: userData.enrollmentYear,
  };
  mockUsersDb.push(newUser);
  return newUser;
};

// ==============================
// === STUDENT MANAGEMENT (ADMIN)
// ==============================

interface GetAllStudentsOptions {
  page?: number;
  limit?: number;
  statusFilter?: 'All' | 'Active' | 'Graduated' | 'Dropped';
}

export const getAllStudents = async (
  token: string,
  options: GetAllStudentsOptions = {}
): Promise<{ students: StudentRecord[]; total: number }> => {
  await delay(800);
  if (!token.includes('admin')) throw new Error("Unauthorized access");

  const { page = 1, limit = 5, statusFilter = 'All' } = options;
  let allStudents = getStudentRecords();

  if (statusFilter !== 'All') {
    allStudents = allStudents.filter(s => s.status === statusFilter);
  }

  const total = allStudents.length;
  const paginatedStudents = allStudents.slice((page - 1) * limit, page * limit);
  return { students: paginatedStudents, total };
};

export const createStudent = async (
  studentData: Omit<StudentRecord, 'id'>,
  token: string
): Promise<UserProfile> => {
  await delay(500);
  if (!token.includes('admin')) throw new Error("Unauthorized access");
  if (mockUsersDb.some(user => user.email === studentData.email)) {
    throw new Error('A student with this email already exists.');
  }

  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name: studentData.name,
    email: studentData.email,
    role: 'student',
    course: studentData.course,
    enrollmentYear: studentData.enrollmentYear,
  };
  mockUsersDb.push(newUser);
  return newUser;
};

export const updateStudent = async (
  id: string,
  studentData: Partial<StudentRecord>,
  token: string
): Promise<UserProfile> => {
  await delay(500);
  if (!token.includes('admin')) throw new Error("Unauthorized access");

  const userIndex = mockUsersDb.findIndex(u => u.id === id);
  if (userIndex === -1) throw new Error("User not found for update");

  Object.assign(mockUsersDb[userIndex], studentData);
  return mockUsersDb[userIndex];
};

export const deleteStudent = async (id: string, token: string): Promise<void> => {
  await delay(500);
  if (!token.includes('admin')) throw new Error("Unauthorized access");
  mockUsersDb = mockUsersDb.filter(u => u.id !== id);
};

export const changeUserRole = async (
  userId: string,
  newRole: 'admin' | 'student',
  token: string
): Promise<UserProfile> => {
  await delay(500);
  if (!token.includes('admin')) throw new Error("Unauthorized access");

  const userIndex = mockUsersDb.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error("User not found for role change");

  mockUsersDb[userIndex].role = newRole;
  return mockUsersDb[userIndex];
};

// ==============================
// === USER PROFILE & DASHBOARD
// ==============================

export const getAdminDashboardStats = async (
  token: string
): Promise<{ total: number; active: number; graduated: number }> => {
  await delay(400);
  if (!token.includes('admin')) throw new Error("Unauthorized access");

  const allStudents = getStudentRecords();
  return {
    total: allStudents.length,
    active: allStudents.filter(s => s.status === 'Active').length,
    graduated: allStudents.filter(s => s.status === 'Graduated').length,
  };
};

export const getMyProfile = async (token: string): Promise<UserProfile> => {
  await delay(300);
  const userId = token.replace('mock-jwt-for-', '');
  const user = mockUsersDb.find(u => u.id === userId);
  if (!user) throw new Error("Invalid session token.");
  return { ...user };
};

export const updateMyProfile = async (
  profileData: Partial<UserProfile>,
  token: string
): Promise<UserProfile> => {
  await delay(500);
  const userId = token.replace('mock-jwt-for-', '');
  const userIndex = mockUsersDb.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error("User not found to update profile.");
  Object.assign(mockUsersDb[userIndex], profileData);
  return { ...mockUsersDb[userIndex] };
};
