import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, AuthResponse, User } from '../../types/auth';
import { authAPI } from '../../services/api';

const mockUser: User = {
  id: '1',
  firstName: 'Mr',
  lastName: 'Blackislife',
  email: 'mrblackislife@gmail.com',
  phone: '0782635801',
  role: 'staff',
  department: 'IT',
  school: 'Engineering'
};

const initialState: AuthState = {
  user: mockUser,
  token: 'mock-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials) => {
    // For development, return mock data
    return {
      user: mockUser,
      token: 'mock-token'
    };
  }
);

export const updateProfile = createAsyncThunk<User, FormData>(
  'auth/updateProfile',
  async (formData) => {
    const response = await authAPI.updateProfile(formData);
    return response.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer; 