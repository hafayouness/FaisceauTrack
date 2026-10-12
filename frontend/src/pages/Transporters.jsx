import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Building2,
  Phone,
  Mail,
} from "lucide-react";

import { transportersApi } from "../api/transportersApi";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import TransporterForm from "../components/forms/TransporterForm";

import { useDebounce } from "../hooks/useDebounce";
import { usePermissions } from "../hooks/usePermissions";
import { PAGE_SIZE } from "../utils/constants";

export default function Transporters() {
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
    queryKey: ["transporters", params],
    queryFn: () => transportersApi.list(params),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: transportersApi.remove,
    onSuccess: () => {
      toast.success("Transporteur supprimé");
      qc.invalidateQueries({ queryKey: ["transporters"] });
      setDeleteTarget(null);
    },
  });

  const handleSaved = () => {
    setShowForm(false);
    setEditItem(null);
    qc.invalidateQueries({ queryKey: ["transporters"] });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <>
      <PageHeader
        title="Transporteurs"
        subtitle="Gestion des sociétés de transport partenaires"
        actions={
          canManage ? (
            <Button icon={Plus} onClick={() => setShowForm(true)}>
              Nouveau transporteur
            </Button>
          ) : null
        }
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Rechercher par nom, société, téléphone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner text="Chargement des transporteurs..." />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Building2}
          title="Aucun transporteur"
          description={
            search
              ? "Aucun résultat pour cette recherche."
              : "Commencez par créer un transporteur."
          }
          action={
            canManage ? (
              <Button icon={Plus} onClick={() => setShowForm(true)}>
                Créer un transporteur
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
                  <th>Nom</th>
                  <th>Société</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td>{t.company || "—"}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        {t.phone ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 13,
                              color: "var(--text-secondary)",
                            }}
                          >
                            <Phone size={12} /> {t.phone}
                          </span>
                        ) : null}
                        {t.email ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12.5,
                              color: "var(--text-muted)",
                            }}
                          >
                            <Mail size={12} /> {t.email}
                          </span>
                        ) : null}
                        {!t.phone && !t.email ? (
                          <span className="text-muted">—</span>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <Badge variant={t.isActive ? "success" : "default"}>
                        {t.isActive ? "Actif" : "Inactif"}
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

      <Modal
        open={showForm || !!editItem}
        onClose={handleCancel}
        title={editItem ? "Modifier le transporteur" : "Nouveau transporteur"}
        footer={
          <>
            <Button variant="secondary" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" form="transporter-form">
              {editItem ? "Enregistrer" : "Créer"}
            </Button>
          </>
        }
      >
        <TransporterForm
          initial={editItem}
          onSuccess={handleSaved}
          onCancel={handleCancel}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        title="Supprimer le transporteur"
        message={`Voulez-vous vraiment supprimer le transporteur "${deleteTarget?.name}" ? Cette action est irréversible.`}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
