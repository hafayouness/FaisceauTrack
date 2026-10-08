import { create } from "zustand";

export const useUiStore = create((set) => ({
  /* Sidebar desktop repliée */
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  /* Sidebar mobile ouverte */
  mobileSidebarOpen: false,
  toggleMobileSidebar: () =>
    set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
}));
