import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertTriangle, CheckCircle2, Package } from "lucide-react";

import { referencesApi } from "../api/referencesApi";
import PageHeader from "../components/layout/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import { DELIVERY_STATUS_META } from "../utils/constants";
import { formatDate, formatNumber } from "../utils/formatters";

export default function ReferenceDetail() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reference-traceability", id],
    queryFn: () => referencesApi.traceability(id),
  });

  if (isLoading) return <Spinner size="lg" />;

  if (error || !data) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--color-danger)" }}>
          Référence introuvable ou erreur de chargement.
        </p>
        <Link
          to="/references"
          className="btn btn-secondary"
          style={{ marginTop: 20, display: "inline-flex" }}
        >
          <ArrowLeft size={14} /> Retour
        </Link>
      </div>
    );
  }

  const { reference, deliveries = [] } = data;

  const totalSent = deliveries.reduce(
    (sum, d) => sum + Number(d.quantitySent || 0),
    0,
  );
  const totalReceived = deliveries.reduce(
    (sum, d) => sum + (Number(d.quantityReceived) || 0),
    0,
  );
  const totalDiff = totalSent - totalReceived;

  return (
    <>
      <PageHeader
        title={`Référence ${reference.code}`}
        subtitle={
          <Link
            to="/references"
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
        actions={
          <Badge variant={reference.isActive ? "success" : "default"}>
            {reference.isActive ? "Active" : "Inactive"}
          </Badge>
        }
      />

      {/* Info référence */}
      <Card title="Informations" className="mb-4">
        <div className="detail-list">
          <Info label="Code" value={reference.code} />
          <Info label="Description" value={reference.description} />
          <Info
            label="Statut"
            value={reference.isActive ? "Active" : "Inactive"}
          />
        </div>
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
            <div className="stat-label">Écart total</div>
            <div className="stat-value">{formatNumber(totalDiff)}</div>
          </div>
        </div>
      </div>

      {/* Traçabilité */}
      <Card title={`Traçabilité — ${deliveries.length} livraison(s)`}>
        {deliveries.length === 0 ? (
          <p className="text-muted">
            Aucune livraison associée à cette référence.
          </p>
        ) : (
          <div className="table-wrapper" style={{ border: "none" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Livraison</th>
                  <th>Date</th>
                  <th>Remorque</th>
                  <th>Transporteur</th>
                  <th>Destination</th>
                  <th style={{ textAlign: "right" }}>Envoyé</th>
                  <th style={{ textAlign: "right" }}>Reçu</th>
                  <th>Statut</th>
                  <th>Anomalie</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d) => {
                  const meta = DELIVERY_STATUS_META[d.deliveryStatus] || {
                    label: d.deliveryStatus,
                    color: "default",
                  };
                  return (
                    <tr key={d.deliveryId}>
                      <td style={{ fontWeight: 600 }}>
                        <Link
                          to={`/deliveries/${d.deliveryId}`}
                          style={{ color: "var(--color-primary-600)" }}
                        >
                          {d.deliveryNumber}
                        </Link>
                      </td>
                      <td>{formatDate(d.date)}</td>
                      <td>{d.trailer?.registrationNumber || "—"}</td>
                      <td>{d.transporter?.name || "—"}</td>
                      <td>{d.destination?.name || "—"}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {formatNumber(d.quantitySent)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {d.quantityReceived !== null
                          ? formatNumber(d.quantityReceived)
                          : "—"}
                      </td>
                      <td>
                        <Badge variant={meta.color}>{meta.label}</Badge>
                      </td>
                      <td>
                        {d.anomaly ? (
                          <Badge variant="danger">Anomalie</Badge>
                        ) : (
                          <Badge variant="success">OK</Badge>
                        )}
                      </td>
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

function Info({ label, value }) {
  return (
    <div className="detail-item">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{value || "—"}</div>
    </div>
  );
}
