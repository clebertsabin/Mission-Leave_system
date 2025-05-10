import axios from 'axios';
import { LoginCredentials, RegisterData, User } from '../types/auth';
import { CreateLeaveRequest, CreateMissionRequest, Leave, Mission, UpdateRequestStatus } from '../types/requests';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: FormData) => {
    const response = await api.put('/auth/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const missionAPI = {
  getMissions: async () => {
    const response = await api.get<Mission[]>('/missions');
    return response.data;
  },

  getMission: async (id: string) => {
    const response = await api.get<Mission>(`/missions/${id}`);
    return response.data;
  },

  createMission: async (data: CreateMissionRequest | FormData) => {
    const response = await api.post<Mission>('/missions', data, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : undefined,
    });
    return response.data;
  },

  updateMissionStatus: async ({ id, status, comment }: UpdateRequestStatus) => {
    const response = await api.patch<Mission>(`/missions/${id}/status`, { status, comment });
    return response.data;
  },
};

export const leaveAPI = {
  getLeaves: async () => {
    const response = await api.get<Leave[]>('/leaves');
    return response.data;
  },

  getLeave: async (id: string) => {
    const response = await api.get<Leave>(`/leaves/${id}`);
    return response.data;
  },

  createLeave: async (data: CreateLeaveRequest | FormData) => {
    const response = await api.post<Leave>('/leaves', data, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data',
      } : undefined,
    });
    return response.data;
  },

  updateLeaveStatus: async ({ id, status, comment }: UpdateRequestStatus) => {
    const response = await api.patch<Leave>(`/leaves/${id}/status`, { status, comment });
    return response.data;
  },
};

export default api; 