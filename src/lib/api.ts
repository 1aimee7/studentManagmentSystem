import { AuthResponse, StudentRecord, UserProfile } from "@/types";

// This variable points to your live backend server, defined in .env.local.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * A helper function for making authenticated API requests to the real backend.
 */
async function fetchWithAuth(url: string, token: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An API error occurred' }));
    throw new Error(errorData.message);
  }
  if (response.status === 204) return; // Handle successful DELETE requests
  return response.json();
}

// ==============================
// === REAL API FUNCTIONS ===
// ==============================

// --- Authentication ---
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Invalid credentials');
  }
  return response.json();
};

export const registerUser = async (userData: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }
  return response.json();
};

// --- Student Management (Admin) ---

// Define the options interface for type safety
interface GetAllStudentsOptions {
  page?: number;
  limit?: number;
  statusFilter?: 'All' | 'Active' | 'Graduated' | 'Dropped';
}

/**
 * Fetches students from the backend, passing pagination and filtering options as URL query parameters.
 */
export const getAllStudents = async (
  token: string,
  options: GetAllStudentsOptions = {}
): Promise<{ students: StudentRecord[]; total: number }> => {
  const { page = 1, limit = 5, statusFilter = 'All' } = options;
  
  // Construct the URL with query parameters for the backend to read
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    statusFilter: statusFilter,
  });

  // The final URL will look like: /api/students?page=1&limit=5&statusFilter=Active
  return fetchWithAuth(`/students?${queryParams.toString()}`, token);
};

export const createStudent = (studentData: Omit<StudentRecord, 'id'>, token: string): Promise<UserProfile> => {
  return fetchWithAuth('/students', token, { method: 'POST', body: JSON.stringify(studentData) });
};

export const updateStudent = (id: string, studentData: Partial<StudentRecord>, token: string): Promise<UserProfile> => {
  return fetchWithAuth(`/students/${id}`, token, { method: 'PUT', body: JSON.stringify(studentData) });
};

export const deleteStudent = (id: string, token: string): Promise<void> => {
  return fetchWithAuth(`/students/${id}`, token, { method: 'DELETE' });
};

export const changeUserRole = (userId: string, newRole: 'admin' | 'student', token: string): Promise<UserProfile> => {
  // NOTE: We haven't built this specific endpoint in the backend yet.
  // This is how you WOULD call it. It will currently return a 404 Not Found error.
  return fetchWithAuth(`/users/${userId}/role`, token, { method: 'PUT', body: JSON.stringify({ role: newRole }) });
};

// --- User Profile (Student & Admin) ---
export const getMyProfile = (token: string): Promise<UserProfile> => {
  return fetchWithAuth('/users/me', token);
};

export const updateMyProfile = (profileData: Partial<UserProfile>, token: string): Promise<UserProfile> => {
  return fetchWithAuth('/users/me', token, { method: 'PUT', body: JSON.stringify(profileData) });
};

// This function needs a dedicated backend endpoint to be fully implemented.
export const getAdminDashboardStats = async (token: string): Promise<{total: number, active: number, graduated: number}> => {
  console.warn("getAdminDashboardStats is not implemented on the backend yet. Returning mock data.");
  // For now, we can make a simple call to get all students and calculate stats on the frontend
  // to avoid breaking the UI. This is a temporary solution.
  const allStudents = await fetchWithAuth('/students', token);
  const active = allStudents.filter((s: StudentRecord) => s.status === 'Active').length;
  const graduated = allStudents.filter((s: StudentRecord) => s.status === 'Graduated').length;
  return { total: allStudents.length, active, graduated };
};