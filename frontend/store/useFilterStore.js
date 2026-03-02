import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: {} })
}));
