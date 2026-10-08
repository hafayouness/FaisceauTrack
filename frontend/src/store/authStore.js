import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      /* ==============================
         État
         ============================== */
      user: null,
      token: null,
      isAuthenticated: false,

      /* ==============================
         Actions
         ============================== */

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

      /**
       * Met à jour les infos utilisateur (sans toucher au token)
       */
      setUser: (user) => set({ user }),

      /**
       * Déconnexion : vide tout
       */
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
      name: "faisceautrack-auth", // clé localStorage
      storage: createJSONStorage(() => localStorage),
      // On ne persiste que ce qui est nécessaire
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
