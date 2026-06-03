import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setAuthenticated: (status) => set({ isAuthenticated: status }),
}));