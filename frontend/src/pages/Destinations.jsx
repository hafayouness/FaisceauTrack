import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Building2,
  Globe,
  User,
} from "lucide-react";

import { destinationsApi } from "../api/destinationsApi";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DestinationForm from "../components/forms/DestinationForm";

import { useDebounce } from "../hooks/useDebounce";
import { usePermissions } from "../hooks/usePermissions";
import { PAGE_SIZE } from "../utils/constants";

export default function Destinations() {
  const qc = useQueryClient();
  const { canManageReferences: canManage } = usePermissions();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const params = {
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["destinations", params],
    queryFn: () => destinationsApi.list(params),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: destinationsApi.remove,
    onSuccess: () => {
      toast.success("Destination supprimée");
      qc.invalidateQueries({ queryKey: ["destinations"] });
      setDeleteTarget(null);
    },
  });

  const handleSaved = () => {
    setShowForm(false);
    setEditItem(null);
    qc.invalidateQueries({ queryKey: ["destinations"] });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <>
      <PageHeader
        title="Destinations"
        subtitle="Sites et lieux de livraison"
        actions={
          canManage ? (
            <Button icon={Plus} onClick={() => setShowForm(true)}>
              Nouvelle destination
            </Button>
          ) : null
        }
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Rechercher par nom, ville, pays..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <Spinner text="Chargement des destinations..." />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={MapPin}
          title="Aucune destination"
          description={
            search
              ? "Aucun résultat pour cette recherche."
              : "Commencez par créer une destination."
          }
          action={
            canManage ? (
              <Button icon={Plus} onClick={() => setShowForm(true)}>
                Créer une destination
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
                  <th>Nom du site</th>
                  <th>Localisation</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((d) => (
                  <tr key={d.id}>
                    {/* Nom + icône */}
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "var(--color-info-bg)",
                            color: "var(--color-info)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <MapPin size={18} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{d.name}</span>
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        {d.city ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 13,
                              color: "var(--text-secondary)",
                            }}
                          >
                            <Building2 size={12} /> {d.city}
                          </span>
                        ) : null}
                        {d.country ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12.5,
                              color: "var(--text-muted)",
                            }}
                          >
                            <Globe size={12} /> {d.country}
                          </span>
                        ) : null}
                        {!d.city && !d.country ? (
                          <span className="text-muted">—</span>
                        ) : null}
                      </div>
                    </td>

                    <td>
                      {d.contactName ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            color: "var(--text-secondary)",
                          }}
                        >
                          <User size={13} /> {d.contactName}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    <td>
                      <Badge variant={d.isActive ? "success" : "default"}>
                        {d.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="table-actions">
                        {canManage ? (
                          <>
                            <button
                              className="btn-icon"
                              onClick={() => setEditItem(d)}
                              title="Modifier"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn-icon"
                              style={{ color: "var(--color-danger)" }}
                              onClick={() => setDeleteTarget(d)}
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={showForm || !!editItem}
        onClose={handleCancel}
        title={editItem ? "Modifier la destination" : "Nouvelle destination"}
        footer={
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" form="destination-form">
              {editItem ? "Enregistrer" : "Créer"}
            </Button>
          </>
        }
      >
        <DestinationForm
          initial={editItem}
          onSuccess={handleSaved}
          onCancel={handleCancel}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        title="Supprimer la destination"
        message={`Voulez-vous vraiment supprimer la destination "${deleteTarget?.name}" ? Cette action est irréversible.`}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
