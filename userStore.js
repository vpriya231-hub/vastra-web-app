import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  tier: 'free',
  remainingCredits: 5,
  totalCredits: 5,
  apps: [],

  // Initialize user
  initUser: async (firebaseUser, idToken) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${API_URL}/api/user/init`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      set({
        user: response.data.user,
        tier: response.data.user.tier,
        remainingCredits: response.data.user.remainingCredits,
        totalCredits: response.data.user.totalCredits,
        loading: false,
        error: null
      });

      return response.data.user;
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Get user profile
  getProfile: async (idToken) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${API_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      set({
        user: response.data.user,
        tier: response.data.user.tier,
        remainingCredits: response.data.user.remainingCredits,
        totalCredits: response.data.user.totalCredits,
        loading: false,
        error: null
      });

      return response.data.user;
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Generate app
  generateApp: async (prompt, appName, idToken) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${API_URL}/api/app/generate`,
        { prompt, appName },
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      set({
        remainingCredits: response.data.remainingCredits,
        loading: false,
        error: null
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Get apps list
  getApps: async (idToken) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${API_URL}/api/app/list`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      set({
        apps: response.data.apps,
        loading: false,
        error: null
      });

      return response.data.apps;
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Upgrade subscription
  upgradeSubscription: async (tier, idToken) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${API_URL}/api/billing/create-subscription`,
        { tier },
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      set({
        tier: response.data.tier,
        remainingCredits: response.data.credits,
        totalCredits: response.data.credits,
        loading: false,
        error: null
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Logout
  logout: () => {
    set({
      user: null,
      tier: 'free',
      remainingCredits: 5,
      totalCredits: 5,
      apps: [],
      error: null
    });
  }
}));
