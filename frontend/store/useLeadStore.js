import { create } from 'zustand';

export const useLeadStore = create((set) => ({
  selectedLead: null,
  setSelectedLead: (selectedLead) => set({ selectedLead })
}));
