import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Truck,
  MapPin,
  Building2,
  Calendar,
  Package,
  User,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { deliveriesApi } from "../api/deliveriesApi";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import { DELIVERY_STATUS_META } from "../utils/constants";
import { formatDate, formatDateTime, formatNumber } from "../utils/formatters";

export default function DeliveryDetail() {
  const { id } = useParams();

  const {
    data: delivery,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["delivery", id],
    queryFn: () => deliveriesApi.get(id),
  });

  if (isLoading) return <Spinner size="lg" text="Chargement..." />;

  if (error || !delivery) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--color-danger)", marginBottom: 20 }}>
          Livraison introuvable ou erreur de chargement.
        </p>
        <Link to="/deliveries" className="btn btn-secondary">
          <ArrowLeft size={14} /> Retour à la liste
        </Link>
      </div>
    );
  }

  const meta = DELIVERY_STATUS_META[delivery.status] || {
    label: delivery.status,
    color: "default",
  };

  /* Calcul des totaux */
  const items = delivery.items || [];
  const receptions = delivery.receptions || [];

  const totalSent = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
  const totalReceived = receptions.reduce(
    (sum, r) => sum + Number(r.quantityReceived || 0),
    0,
  );
  const totalDiff = totalSent - totalReceived;

  return (
    <>
      {/* En-tête */}
      <PageHeader
        title={`Livraison ${delivery.deliveryNumber}`}
        subtitle={
          <Link
            to="/deliveries"
            style={{
              color: "var(--color-primary-600)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ArrowLeft size={14} /> Retour à la liste
          </Link>
        }
        actions={<Badge variant={meta.color}>{meta.label}</Badge>}
      />

      {/* Carte 1 : Informations générales */}
      <Card title="Informations générales" className="mb-4">
        <div className="detail-list">
          <Info
            icon={Truck}
            label="N° de livraison"
            value={delivery.deliveryNumber}
          />
          <Info
            icon={MapPin}
            label="Destination"
            value={delivery.destination?.name}
            sub={delivery.destination?.city}
          />
          <Info
            icon={Building2}
            label="Transporteur"
            value={delivery.transporter?.name}
            sub={delivery.transporter?.company}
          />
          <Info
            icon={Truck}
            label="Remorque"
            value={delivery.trailer?.registrationNumber}
            sub={delivery.trailer?.type}
          />
          <Info
            icon={Calendar}
            label="Préparation"
            value={formatDateTime(delivery.preparationDate)}
          />
          <Info
            icon={Calendar}
            label="Départ"
            value={formatDateTime(delivery.departureDate)}
          />
          <Info
            icon={Calendar}
            label="Arrivée"
            value={formatDateTime(delivery.arrivalDate)}
          />
          <Info
            icon={User}
            label="Créée par"
            value={delivery.creator?.name}
            sub={delivery.creator?.email}
          />
        </div>

        {delivery.notes && (
          <div
            style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <div className="detail-label">
              <FileText
                size={12}
                style={{ display: "inline", marginRight: 4 }}
              />
              Notes
            </div>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {delivery.notes}
            </p>
          </div>
        )}
      </Card>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <Package size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total envoyé</div>
            <div className="stat-value">{formatNumber(totalSent)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total reçu</div>
            <div className="stat-value">{formatNumber(totalReceived)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className={`stat-icon ${totalDiff === 0 ? "success" : "danger"}`}
          >
            <AlertTriangle size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Écart</div>
            <div className="stat-value">{formatNumber(totalDiff)}</div>
          </div>
        </div>
      </div>

      {/* Carte 2 : Références / Items */}
      <Card title={`Références (${items.length})`}>
        {items.length === 0 ? (
          <p className="text-muted">Aucune référence dans cette livraison.</p>
        ) : (
          <div className="table-wrapper" style={{ border: "none" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Quantité envoyée</th>
                  <th style={{ textAlign: "right" }}>Quantité reçue</th>
                  <th style={{ textAlign: "right" }}>Écart</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const reception = receptions.find(
                    (r) => r.referenceId === item.referenceId,
                  );
                  const sent = Number(item.quantity || 0);
                  const received = reception
                    ? Number(reception.quantityReceived)
                    : null;
                  const diff = received !== null ? sent - received : null;

                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link
                          to={`/references/${item.referenceId}`}
                          style={{ color: "var(--color-primary-600)" }}
                        >
                          {item.reference?.code || "—"}
                        </Link>
                      </td>
                      <td>{item.reference?.description || "—"}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {formatNumber(sent)} {item.unit}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {received !== null
                          ? `${formatNumber(received)} ${item.unit}`
                          : "—"}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: 600,
                          color:
                            diff === null
                              ? "var(--text-muted)"
                              : diff === 0
                                ? "var(--color-success)"
                                : "var(--color-danger)",
                        }}
                      >
                        {diff === null
                          ? "—"
                          : diff === 0
                            ? "✓ OK"
                            : `⚠ ${diff}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Carte 3 : Réceptions */}
      {receptions.length > 0 && (
        <Card title={`Réceptions (${receptions.length})`} className="mt-4">
          <div className="table-wrapper" style={{ border: "none" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th style={{ textAlign: "right" }}>Quantité reçue</th>
                  <th>Statut</th>
                  <th>Récepteur</th>
                  <th>Date</th>
                  <th>Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {receptions.map((r) => {
                  const rMeta = {
                    PENDING: { label: "En attente", color: "default" },
                    PARTIAL: { label: "Partielle", color: "warning" },
                    COMPLETED: { label: "Complète", color: "success" },
                    WITH_ISSUE: {
                      label: "Avec anomalie",
                      color: "danger",
                    },
                  }[r.status] || { label: r.status, color: "default" };

                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>
                        {r.reference?.code || "—"}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {formatNumber(r.quantityReceived)}
                      </td>
                      <td>
                        <Badge variant={rMeta.color}>{rMeta.label}</Badge>
                      </td>
                      <td>{r.receiver?.name || "—"}</td>
                      <td className="text-muted">
                        {formatDateTime(r.receivedAt)}
                      </td>
                      <td className="text-muted text-sm">{r.comment || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}

/* Sous-composant Info */
function Info({ icon: Icon, label, value, sub }) {
  return (
    <div className="detail-item">
      <div className="detail-label">
        {Icon && (
          <Icon size={12} style={{ display: "inline", marginRight: 4 }} />
        )}
        {label}
      </div>
      <div className="detail-value">{value || "—"}</div>
      {sub && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
