import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, Package, Eye } from "lucide-react";

import { referencesApi } from "../api/referencesApi";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ReferenceForm from "../components/forms/ReferenceForm";

import { useDebounce } from "../hooks/useDebounce";
import { usePermissions } from "../hooks/usePermissions";
import { PAGE_SIZE } from "../utils/constants";

export default function References() {
  const qc = useQueryClient();
  const { canManageReferences } = usePermissions();

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
    queryKey: ["references", params],
    queryFn: () => referencesApi.list(params),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: referencesApi.remove,
    onSuccess: () => {
      toast.success("Référence supprimée");
      qc.invalidateQueries({ queryKey: ["references"] });
      setDeleteTarget(null);
    },
  });

  const handleSaved = () => {
    setShowForm(false);
    setEditItem(null);
    qc.invalidateQueries({ queryKey: ["references"] });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <>
      <PageHeader
        title="Références de faisceaux"
        subtitle="Catalogue des références disponibles"
        actions={
          canManageReferences ? (
            <Button icon={Plus} onClick={() => setShowForm(true)}>
              Nouvelle référence
            </Button>
          ) : null
        }
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Rechercher par code ou description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner text="Chargement des références..." />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Package}
          title="Aucune référence"
          description={
            search
              ? "Aucun résultat pour cette recherche."
              : "Commencez par créer une référence de faisceau."
          }
          action={
            canManageReferences ? (
              <Button onClick={() => setShowForm(true)} icon={Plus}>
                Créer une référence
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
                  <th>Code</th>
                  <th>Description</th>
                  <th>Unité</th>
                  <th>Statut</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link
                        to={`/references/${r.id}`}
                        style={{ color: "var(--color-primary-600)" }}
                      >
                        {r.code}
                      </Link>
                    </td>
                    <td>{r.description || "—"}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          background: "var(--color-gray-100)",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--color-gray-700)",
                        }}
                      >
                        {r.unit || "PCS"}
                      </span>
                    </td>
                    <td>
                      <Badge variant={r.isActive ? "success" : "default"}>
                        {r.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/references/${r.id}`}
                          className="btn-icon"
                          title="Traçabilité"
                        >
                          <Eye size={16} />
                        </Link>

                        {canManageReferences ? (
                          <>
                            <button
                              className="btn-icon"
                              onClick={() => setEditItem(r)}
                              title="Modifier"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn-icon"
                              style={{ color: "var(--color-danger)" }}
                              onClick={() => setDeleteTarget(r)}
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
        title={editItem ? "Modifier la référence" : "Nouvelle référence"}
        footer={
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" form="reference-form">
              {editItem ? "Enregistrer" : "Créer"}
            </Button>
          </>
        }
      >
        <ReferenceForm
          initial={editItem}
          onSuccess={handleSaved}
          onCancel={handleCancel}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        title="Supprimer la référence"
        message={`Voulez-vous vraiment supprimer la référence "${deleteTarget?.code}" ? Cette action est irréversible.`}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
