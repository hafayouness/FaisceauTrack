import { ROLES } from "../utils/constants";
import { useAuth } from "./useAuth";

export const usePermissions = () => {
  const { hasRole, user } = useAuth();

  return {
    /* Un booléen par permission métier */

    // Admin uniquement
    isAdmin: hasRole(ROLES.ADMIN),
    canManageUsers: hasRole(ROLES.ADMIN),

    // Gestion des livraisons (créer/modifier/supprimer)
    canManageDeliveries: hasRole(ROLES.ADMIN, ROLES.LOGISTIC_MANAGER),

    // Gestion du catalogue (références, remorques, transporteurs, destinations)
    canManageReferences: hasRole(ROLES.ADMIN, ROLES.LOGISTIC_MANAGER),
    canManageCatalog: hasRole(ROLES.ADMIN, ROLES.LOGISTIC_MANAGER),

    // Enregistrer une réception
    canReceive: hasRole(ROLES.ADMIN, ROLES.LOGISTIC_MANAGER, ROLES.RECEPTION),

    // Exporter / imprimer
    canExport: hasRole(ROLES.ADMIN, ROLES.LOGISTIC_MANAGER, ROLES.RECEPTION),

    // Tous les utilisateurs connectés peuvent consulter
    canView: !!user,
  };
};
