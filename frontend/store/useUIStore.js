import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen })
}));
