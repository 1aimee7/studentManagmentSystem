/**
 * Defines the shape of a user's profile, containing all possible fields for
 * both students and admins.
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  phone?: string;
  profilePicture?: string;
  
  // Student-specific optional fields
  course?: string;
  enrollmentYear?: number;

  /** The date the user's account was created. */
  joinedAt?: string; // <-- THIS LINE IS ADDED
}

/**
 * Defines the shape of a student record as managed by an admin.
 * This may be slightly different from a user's own profile view.
 */
export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  enrollmentYear: number;
  status: 'Active' | 'Graduated' | 'Dropped';
}

/**
 * Defines the expected response from the backend's successful login endpoint.
 * It must include the user's core profile data and a JWT.
 */
export interface AuthResponse {
  user: UserProfile;
  token: string;
}