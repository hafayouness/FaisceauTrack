export const ROLES = {
  ADMIN: "ADMIN",
  LOGISTIC_MANAGER: "LOGISTIC_MANAGER",
  RECEPTION: "RECEPTION",
  VIEWER: "VIEWER",
};

export const ROLE_LABELS = {
  ADMIN: "Administrateur",
  LOGISTIC_MANAGER: "Responsable logistique",
  RECEPTION: "Réception",
  VIEWER: "Consultation",
};

export const DELIVERY_STATUS_META = {
  PREPARATION: { label: "Préparation", color: "default" },
  LOADING: { label: "Chargement", color: "info" },
  READY: { label: "Prêt", color: "info" },
  IN_TRANSIT: { label: "En transit", color: "warning" },
  ARRIVED: { label: "Arrivé", color: "primary" },
  PARTIAL_RECEPTION: { label: "Réception partielle", color: "warning" },
  RECEIVED: { label: "Reçu", color: "success" },
  CANCELLED: { label: "Annulé", color: "danger" },
};

export const RECEPTION_STATUS_META = {
  PENDING: { label: "En attente", color: "default" },
  PARTIAL: { label: "Partielle", color: "warning" },
  COMPLETED: { label: "Complète", color: "success" },
  WITH_ISSUE: { label: "Avec anomalie", color: "danger" },
};

export const HISTORY_ACTION_META = {
  CREATE: { label: "Création", color: "success" },
  UPDATE: { label: "Modification", color: "info" },
  DELETE: { label: "Suppression", color: "danger" },
  STATUS_CHANGE: { label: "Changement de statut", color: "warning" },
  RECEPTION: { label: "Réception", color: "primary" },
  EXPORT: { label: "Export", color: "default" },
  LOGIN: { label: "Connexion", color: "default" },
};

export const HISTORY_ENTITIES = {
  User: "Utilisateur",
  Reference: "Référence",
  Trailer: "Remorque",
  Transporter: "Transporteur",
  Destination: "Destination",
  Delivery: "Livraison",
  DeliveryItem: "Ligne de livraison",
  Reception: "Réception",
};

export const DEFAULT_UNIT = "PCS";
export const PAGE_SIZE = 10;
