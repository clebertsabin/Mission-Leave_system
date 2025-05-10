import { ApprovalRole } from './requests';
export type { ApprovalRole };

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  school?: string;
  role: 'staff' | 'hod' | 'dean' | 'admin';
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  department: string;
  school: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 