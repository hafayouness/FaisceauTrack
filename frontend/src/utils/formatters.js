import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (value) => {
  if (!value) return "—";
  try {
    const date = typeof value === "string" ? parseISO(value) : value;
    return format(date, "dd MMM yyyy", { locale: fr });
  } catch {
    return "—";
  }
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  try {
    const date = typeof value === "string" ? parseISO(value) : value;
    return format(date, "dd MMM yyyy à HH:mm", { locale: fr });
  } catch {
    return "—";
  }
};

export const formatNumber = (value) => {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("fr-FR").format(value);
};

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "?";
