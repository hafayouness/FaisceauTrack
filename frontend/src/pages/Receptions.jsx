import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  PackageCheck,
  AlertTriangle,
  Calendar,
} from "lucide-react";

import { receptionsApi } from "../api/receptionsApi";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import ReceptionForm from "../components/forms/ReceptionForm";

import { usePermissions } from "../hooks/usePermissions";
import { RECEPTION_STATUS_META } from "../utils/constants";
import { formatDateTime, formatNumber } from "../utils/formatters";

export default function Receptions() {
  const { canReceive } = usePermissions();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["receptions", { status }],
    queryFn: () =>
      receptionsApi.list({
        status: status || undefined,
      }),
  });

  const receptions = Array.isArray(data) ? data : [];

  const filtered = receptions.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.delivery?.deliveryNumber?.toLowerCase().includes(s) ||
      r.reference?.code?.toLowerCase().includes(s) ||
      r.receiver?.name?.toLowerCase().includes(s)
    );
  });

  const handleSaved = () => {
    setShowForm(false);
    refetch();
  };

  return (
    <>
      <PageHeader
        title="Réceptions"
        subtitle="Enregistrement des quantités reçues"
        actions={
          canReceive ? (
            <Button icon={Plus} onClick={() => setShowForm(true)}>
              Nouvelle réception
            </Button>
          ) : null
        }
      />

      {/* Barre d'outils */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Rechercher par livraison, référence ou récepteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            {Object.entries(RECEPTION_STATUS_META).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <Spinner text="Chargement des réceptions..." />
      ) : !filtered.length ? (
        <EmptyState
          icon={PackageCheck}
          title="Aucune réception"
          description={
            search || status
              ? "Aucun résultat pour ces filtres."
              : "Enregistrez la première réception de livraison."
          }
          action={
            canReceive && !search && !status ? (
              <Button icon={Plus} onClick={() => setShowForm(true)}>
                Enregistrer une réception
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Livraison</th>
                <th>Référence</th>
                <th style={{ textAlign: "right" }}>Quantité reçue</th>
                <th>Statut</th>
                <th>Récepteur</th>
                <th>Date de réception</th>
                <th>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const meta = RECEPTION_STATUS_META[r.status] || {
                  label: r.status,
                  color: "default",
                };
                return (
                  <tr key={r.id}>
                    {/* Livraison */}
                    <td>
                      {r.delivery ? (
                        <Link
                          to={`/deliveries/${r.deliveryId}`}
                          style={{
                            color: "var(--color-primary-600)",
                            fontWeight: 600,
                          }}
                        >
                          {r.delivery.deliveryNumber}
                        </Link>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Référence */}
                    <td style={{ fontWeight: 600 }}>
                      {r.reference?.code || "—"}
                    </td>

                    {/* Quantité */}
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {formatNumber(r.quantityReceived)}{" "}
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          fontWeight: 400,
                        }}
                      >
                        {r.unit || "PCS"}
                      </span>
                    </td>

                    {/* Statut */}
                    <td>
                      <Badge variant={meta.color}>{meta.label}</Badge>
                    </td>

                    {/* Récepteur */}
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                        }}
                      >
                        {r.receiver?.name || "—"}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="text-muted">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12.5,
                        }}
                      >
                        <Calendar size={12} />
                        {formatDateTime(r.receivedAt)}
                      </div>
                    </td>

                    {/* Commentaire */}
                    <td className="text-muted text-sm">
                      {r.comment ? (
                        r.comment.length > 40 ? (
                          <span title={r.comment}>
                            {r.comment.slice(0, 40)}…
                          </span>
                        ) : (
                          r.comment
                        )
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal création */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Nouvelle réception"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
            <Button type="submit" form="reception-form">
              Valider la réception
            </Button>
          </>
        }
      >
        <ReceptionForm
          onSuccess={handleSaved}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </>
  );
}
