import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  Truck,
} from "lucide-react";

import { deliveriesApi } from "../api/deliveriesApi";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DeliveryForm from "../components/forms/DeliveryForm";

import { useDebounce } from "../hooks/useDebounce";
import { usePermissions } from "../hooks/usePermissions";
import { DELIVERY_STATUS_META, PAGE_SIZE } from "../utils/constants";
import { formatDate } from "../utils/formatters";

export default function Deliveries() {
  const qc = useQueryClient();
  const { canManageDeliveries } = usePermissions();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search);

  const params = {
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: status || undefined,
  };

  /* ---------- Liste ---------- */
  const { data, isLoading } = useQuery({
    queryKey: ["deliveries", params],
    queryFn: () => deliveriesApi.list(params),
    keepPreviousData: true,
  });

  /* ---------- Suppression ---------- */
  const deleteMutation = useMutation({
    mutationFn: deliveriesApi.remove,
    onSuccess: () => {
      toast.success("Livraison supprimée");
      qc.invalidateQueries({ queryKey: ["deliveries"] });
      setDeleteTarget(null);
    },
  });

  /* ---------- Export Excel ---------- */
  const handleExport = async () => {
    try {
      const res = await deliveriesApi.exportExcel(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `faisceautrack-livraisons-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export Excel généré");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Erreur lors de l'export");
    }
  };

  /* ---------- Handlers modal ---------- */
  const handleSaved = () => {
    setShowForm(false);
    setEditItem(null);
    qc.invalidateQueries({ queryKey: ["deliveries"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditItem(null);
  };

  /* ---------- Statut de verrouillage ---------- */
  const canEdit = (delivery) =>
    ![
      "IN_TRANSIT",
      "ARRIVED",
      "PARTIAL_RECEPTION",
      "RECEIVED",
      "CANCELLED",
    ].includes(delivery.status);

  const canDelete = (delivery) =>
    ["PREPARATION", "CANCELLED"].includes(delivery.status);

  return (
    <>
      <PageHeader
        title="Livraisons"
        subtitle="Gestion et suivi des livraisons de faisceaux"
        actions={
          <>
            <Button variant="secondary" icon={Download} onClick={handleExport}>
              Exporter Excel
            </Button>
            {canManageDeliveries ? (
              <Button icon={Plus} onClick={() => setShowForm(true)}>
                Nouvelle livraison
              </Button>
            ) : null}
          </>
        }
      />

      {/* Barre d'outils */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Rechercher par n° de livraison..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="filters">
          <select
            className="filter-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tous les statuts</option>
            {Object.entries(DELIVERY_STATUS_META).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <Spinner text="Chargement des livraisons..." />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Truck}
          title="Aucune livraison"
          description={
            search || status
              ? "Aucun résultat pour ces filtres."
              : "Aucune livraison enregistrée pour le moment."
          }
          action={
            canManageDeliveries && !search && !status ? (
              <Button icon={Plus} onClick={() => setShowForm(true)}>
                Créer une livraison
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>N° livraison</th>
                  <th>Destination</th>
                  <th>Transporteur</th>
                  <th>Remorque</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((d) => {
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
                      <td>{d.destination?.name || "—"}</td>
                      <td>{d.transporter?.name || "—"}</td>
                      <td>{d.trailer?.registrationNumber || "—"}</td>
                      <td>
                        <Badge variant={meta.color}>{meta.label}</Badge>
                      </td>
                      <td>{formatDate(d.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          {/* Voir */}
                          <Link
                            to={`/deliveries/${d.id}`}
                            className="btn-icon"
                            title="Voir le détail"
                          >
                            <Eye size={16} />
                          </Link>

                          {/* Modifier */}
                          {canManageDeliveries && canEdit(d) ? (
                            <button
                              className="btn-icon"
                              onClick={() => setEditItem(d)}
                              title="Modifier"
                            >
                              <Pencil size={16} />
                            </button>
                          ) : null}

                          {/* Supprimer */}
                          {canManageDeliveries && canDelete(d) ? (
                            <button
                              className="btn-icon"
                              style={{ color: "var(--color-danger)" }}
                              onClick={() => setDeleteTarget(d)}
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </>
      )}

      {/* Modal création / édition */}
      <Modal
        open={showForm || !!editItem}
        onClose={handleCancel}
        title={editItem ? "Modifier la livraison" : "Nouvelle livraison"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" form="delivery-form">
              {editItem ? "Enregistrer" : "Créer la livraison"}
            </Button>
          </>
        }
      >
        <DeliveryForm
          initial={editItem}
          onSuccess={handleSaved}
          onCancel={handleCancel}
        />
      </Modal>

      {/* Confirmation suppression */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        title="Supprimer la livraison"
        message={`Voulez-vous vraiment supprimer la livraison "${deleteTarget?.deliveryNumber}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        loading={deleteMutation.isPending}
      />
    </>
  );
}
