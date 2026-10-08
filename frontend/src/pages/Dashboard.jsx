import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import { dashboardApi } from "../api/dashboardApi";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import { formatDate, formatNumber } from "../utils/formatters";
import { DELIVERY_STATUS_META } from "../utils/constants";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.get,
    refetchInterval: 30_000, // rafraîchit toutes les 30s
  });

  if (isLoading) {
    return <Spinner size="lg" text="Chargement du tableau de bord..." />;
  }

  if (error) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "var(--color-danger)",
        }}
      >
        Erreur : {error.message}
      </div>
    );
  }

  /* -------- Cartes statistiques -------- */
  const stats = [
    {
      label: "Références actives",
      value: data?.references ?? 0,
      icon: Package,
      color: "primary",
    },
    {
      label: "Livraisons totales",
      value: data?.deliveries ?? 0,
      icon: Truck,
      color: "info",
    },
    {
      label: "En préparation",
      value: data?.preparation ?? 0,
      icon: Clock,
      color: "warning",
    },
    {
      label: "En transit",
      value: data?.transit ?? 0,
      icon: TrendingUp,
      color: "warning",
    },
    {
      label: "Arrivées",
      value: data?.arrived ?? 0,
      icon: MapPin,
      color: "primary",
    },
    {
      label: "Reçues",
      value: data?.received ?? 0,
      icon: CheckCircle2,
      color: "success",
    },
    {
      label: "Réceptions partielles",
      value: data?.partialReception ?? 0,
      icon: AlertTriangle,
      color: "warning",
    },
    {
      label: "Anomalies",
      value: data?.anomalies ?? 0,
      icon: AlertTriangle,
      color: "danger",
    },
  ];

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'activité logistique"
      />

      {/* Grille de stats */}
      <div className="stats-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div className="stat-card" key={s.label}>
              <div className={`stat-icon ${s.color}`}>
                <Icon size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{formatNumber(s.value)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Livraisons récentes */}
      <Card
        title="Livraisons récentes"
        action={
          <Link to="/deliveries" className="btn btn-secondary btn-sm">
            Tout voir
          </Link>
        }
      >
        {!data?.recentDeliveries?.length ? (
          <p className="text-muted">Aucune livraison récente.</p>
        ) : (
          <div className="table-wrapper" style={{ border: "none" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>N° livraison</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentDeliveries.map((d) => {
                  const meta = DELIVERY_STATUS_META[d.status] || {
                    label: d.status,
                    color: "default",
                  };
                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link
                          to={`/deliveries/${d.id}`}
                          style={{ color: "var(--color-primary-600)" }}
                        >
                          {d.deliveryNumber}
                        </Link>
                      </td>
                      <td>
                        <Badge variant={meta.color}>{meta.label}</Badge>
                      </td>
                      <td>{formatDate(d.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
