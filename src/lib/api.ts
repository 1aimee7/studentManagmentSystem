import { AuthResponse, StudentRecord, UserProfile } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * A centralized helper function for making all API requests.
 * It handles adding the auth token and parsing JSON responses and errors.
 */
async function apiFetch(url: string, token?: string, options: RequestInit = {}) {
  // --- THIS IS THE FIX ---
  // 1. Create a new, mutable headers object that we can safely modify.
  // We explicitly type it as a dictionary of strings.
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };

  // 2. If a token is provided, add the Authorization header to our new object.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // --- END OF FIX ---

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    // 3. Use our fully constructed headers object, merging any additional headers from options.
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ 
      message: `${response.status}: ${response.statusText}` 
    }));
    throw new Error(errorData.message || 'An unknown API error occurred');
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

// ==============================
// === API FUNCTION DEFINITIONS ===
// ==============================

// --- Authentication ---
export const loginUser = (email: string, password: string): Promise<AuthResponse> => {
  return apiFetch('/auth/login', undefined, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = (userData: Partial<UserProfile>): Promise<UserProfile> => {
  return apiFetch('/auth/register', undefined, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// --- Student Management (Admin) ---
interface GetAllStudentsOptions {
  page?: number;
  limit?: number;
  statusFilter?: 'All' | 'Active' | 'Graduated' | 'Dropped';
}
export const getAllStudents = (token: string, options: GetAllStudentsOptions = {}): Promise<{ students: StudentRecord[]; total: number }> => {
  const queryParams = new URLSearchParams({
    page: String(options.page || 1),
    limit: String(options.limit || 5),
    statusFilter: options.statusFilter || 'All',
  });
  return apiFetch(`/students?${queryParams.toString()}`, token);
};

export const createStudent = (studentData: Omit<StudentRecord, 'id'>, token: string): Promise<UserProfile> => {
  return apiFetch('/students', token, { method: 'POST', body: JSON.stringify(studentData) });
};

export const updateStudent = (id: string, studentData: Partial<StudentRecord>, token: string): Promise<UserProfile> => {
  return apiFetch(`/students/${id}`, token, { method: 'PUT', body: JSON.stringify(studentData) });
};

export const deleteStudent = (id: string, token: string): Promise<void> => {
  return apiFetch(`/students/${id}`, token, { method: 'DELETE' });
};

// --- User Profile ---
export const getMyProfile = (token: string): Promise<UserProfile> => {
  return apiFetch('/users/me', token);
};

export const updateMyProfile = (profileData: Partial<UserProfile>, token: string): Promise<UserProfile> => {
  return apiFetch('/users/me', token, { method: 'PUT', body: JSON.stringify(profileData) });
};

// --- Bonus Features (Placeholder) ---
export const changeUserRole = (userId: string, newRole: 'admin' | 'student', token: string): Promise<UserProfile> => {
  console.warn("changeUserRole endpoint is not implemented on the backend.");
  return apiFetch(`/users/${userId}/role`, token, { method: 'PUT', body: JSON.stringify({ role: newRole }) });
};

export const getAdminDashboardStats = async (token: string): Promise<{total: number, active: number, graduated: number}> => {
  console.warn("getAdminDashboardStats is not implemented on the backend yet.");
  return Promise.resolve({ total: 0, active: 0, graduated: 0 });
};