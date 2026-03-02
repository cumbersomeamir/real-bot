import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  push: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, isRead: true }))
    }))
}));
