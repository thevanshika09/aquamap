// store/authStore.js
import { create } from "zustand";
import axios from "axios";

// Configure API URL for local development
const API_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api/auth" 
  : "/api/auth";

axios.defaults.withCredentials = true;


export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  message: null,
  emailForReset: null,

  // Signup function
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, name });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
      return false;
    }
  },

  // Login function
 login: async (email, password) => {
  set({ isLoading: true, error: null });
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    set({
      isAuthenticated: true,
      user: {
        ...response.data.user,
        profilePic: response.data.user.profilePic // Ensure profilePic is included
      },
      isLoading: false,
    });
    return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      return false;
    }
  },

  // Logout function
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  // Email verification
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
      throw error;
    }
  },

  // Check authentication status
  checkAuth: async () => {
  set({ isCheckingAuth: true, error: null });
  try {
    const response = await axios.get(`${API_URL}/check-auth`);
    set({ 
      user: {
        ...response.data.user,
        profilePic: response.data.user.profilePic // Ensure profilePic is included
      },
      isAuthenticated: true, 
      isCheckingAuth: false 
    });
  } catch (error) {
    set({ error: null, isCheckingAuth: false, isAuthenticated: false });
  }
},

  // Forgot password - sends reset email
 forgotPassword: async (email) => {
  set({ isLoading: true, error: null, message: null });
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    set({ 
      message: response.data.message,
      emailForReset: email, // Store email for reset flow
      isLoading: false 
    });
    return { success: true, email }; // Return email for redirection
  } catch (error) {
    set({
      isLoading: false,
      error: error.response?.data?.message || "Error sending reset password email",
    });
    return { success: false };
  }
},

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { 
        password: newPassword 
      });
      set({ 
        message: response.data.message,
        emailForReset: null,
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      return false;
    }
  },
  

  // Update user profile
 updateProfile: async (updates) => {
  set({ isUpdatingProfile: true });
  try {
    const response = await axios.patch(`${API_URL}/update-profile`, updates);
    set({ 
      user: {
        ...response.data.user,
        profilePic: response.data.user.profilePic // Ensure profilePic is included
      }, 
      isUpdatingProfile: false 
    });
    return true;
  } catch (error) {
    set({ 
      error: error.response?.data?.message || "Error updating profile",
      isUpdatingProfile: false 
    });
    throw error;
  }
},

  // Set email for password reset flow
  setEmailForReset: (email) => set({ emailForReset: email }),

  // Clear error messages
  clearError: () => set({ error: null }),

  // Clear success messages
  clearMessage: () => set({ message: null }),
}));