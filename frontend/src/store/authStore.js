import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /**
       * Enregistre la session après login/register
       * @param {{ user: object, token: string }} payload
       */
      setSession: ({ user, token }) =>
        set({
          user,
          token,
          isAuthenticated: !!token,
        }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      /**
       * Vérifie si l'utilisateur possède au moins un des rôles passés
       * @param  {...string} roles
       */
      hasRole: (...roles) => {
        const user = get().user;
        return user ? roles.includes(user.role) : false;
      },
    }),
    {
      name: "faisceautrack-auth",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
