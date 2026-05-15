import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // UI State
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  // Gamification Session State
  activeMissionId: null,
  setActiveMission: (id) => set({ activeMissionId: id }),
  
  // User Preferences
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));
