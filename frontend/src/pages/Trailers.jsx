import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, Truck } from "lucide-react";

import { trailersApi } from "../api/trailersApi";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import TrailerForm from "../components/forms/TrailerForm";

import { useDebounce } from "../hooks/useDebounce";
import { usePermissions } from "../hooks/usePermissions";
import { PAGE_SIZE } from "../utils/constants";

export default function Trailers() {
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
    queryKey: ["trailers", params],
    queryFn: () => trailersApi.list(params),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: trailersApi.remove,
    onSuccess: () => {
      toast.success("Remorque supprimée");
      qc.invalidateQueries({ queryKey: ["trailers"] });
      setDeleteTarget(null);
    },
  });

  const handleSaved = () => {
    setShowForm(false);
    setEditItem(null);
    qc.invalidateQueries({ queryKey: ["trailers"] });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <>
      <PageHeader
        title="Remorques"
        subtitle="Gestion du parc de remorques"
        actions={
          canManage ? (
            <Button icon={Plus} onClick={() => setShowForm(true)}>
              Nouvelle remorque
            </Button>
          ) : null
        }
      />

      {/* Barre d'outils */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Rechercher par immatriculation ou type..."
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
        <Spinner text="Chargement des remorques..." />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Truck}
          title="Aucune remorque"
          description={
            search
              ? "Aucun résultat pour cette recherche."
              : "Commencez par créer une remorque."
          }
          action={
            canManage ? (
              <Button icon={Plus} onClick={() => setShowForm(true)}>
                Créer une remorque
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
                  <th>Immatriculation</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((t) => (
                  <tr key={t.id}>
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
                            background: "var(--color-primary-100)",
                            color: "var(--color-primary-700)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Truck size={18} />
                        </div>
                        <span style={{ fontWeight: 600 }}>
                          {t.registrationNumber}
                        </span>
                      </div>
                    </td>
                    <td>
                      {t.type ? (
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {t.type
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <Badge variant={t.isActive ? "success" : "default"}>
                        {t.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <div className="table-actions">
                        {canManage ? (
                          <>
                            <button
                              className="btn-icon"
                              onClick={() => setEditItem(t)}
                              title="Modifier"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn-icon"
                              style={{ color: "var(--color-danger)" }}
                              onClick={() => setDeleteTarget(t)}
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

      {/* Modal création / édition */}
      <Modal
        open={showForm || !!editItem}
        onClose={handleCancel}
        title={editItem ? "Modifier la remorque" : "Nouvelle remorque"}
        footer={
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" form="trailer-form">
              {editItem ? "Enregistrer" : "Créer"}
            </Button>
          </>
        }
      >
        <TrailerForm
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
        title="Supprimer la remorque"
        message={`Voulez-vous vraiment supprimer la remorque "${deleteTarget?.registrationNumber}" ? Cette action est irréversible.`}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
