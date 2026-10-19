import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { receptionsApi } from "../../api/receptionsApi";
import { deliveriesApi } from "../../api/deliveriesApi";

import Input from "../ui/Input";
import Select from "../ui/Select";
import { RECEPTION_STATUS_META } from "../../utils/constants";

/* 🛡️ Helper robuste : extrait un tableau de n'importe quelle structure */
const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.rows)) return value.rows;
  return [];
};

export default function ReceptionForm({ onSuccess, onCancel }) {
  const qc = useQueryClient();

  const [form, setForm] = useState({
    deliveryId: "",
    referenceId: "",
    quantityReceived: "",
    status: "COMPLETED",
    comment: "",
  });
  const [errors, setErrors] = useState({});

  /* ---------- Fetch livraisons ---------- */
  const { data: deliveriesData, isLoading } = useQuery({
    queryKey: ["deliveries-for-reception"],
    queryFn: () => deliveriesApi.list({ limit: 500 }),
  });

  /* 🔍 DEBUG — à retirer après */
  console.log("🔍 deliveriesData:", deliveriesData);
  console.log("🔍 typeof deliveriesData?.data:", typeof deliveriesData?.data);
  console.log(
    "🔍 Array.isArray(deliveriesData?.data):",
    Array.isArray(deliveriesData?.data),
  );

  /* ---------- Extraction robuste ---------- */
  const allDeliveries = toArray(deliveriesData);

  /* Livraisons éligibles */
  const eligibleDeliveries = allDeliveries.filter((d) =>
    ["IN_TRANSIT", "ARRIVED", "PARTIAL_RECEPTION", "READY"].includes(d.status),
  );

  const selectedDelivery = eligibleDeliveries.find(
    (d) => String(d.id) === String(form.deliveryId),
  );

  const referenceOptions = toArray(selectedDelivery?.items).map((item) => {
    const reception = toArray(selectedDelivery?.receptions).find(
      (r) => r.referenceId === item.referenceId,
    );
    const already = reception ? Number(reception.quantityReceived) : 0;

    return {
      value: item.referenceId,
      label: `${item.reference?.code || "?"} — Envoyé: ${item.quantity} ${
        item.unit || "PCS"
      }${already ? ` / Reçu: ${already}` : ""}`,
    };
  });

  const mutation = useMutation({
    mutationFn: receptionsApi.create,
    onSuccess: () => {
      toast.success("Réception enregistrée");
      qc.invalidateQueries({ queryKey: ["receptions"] });
      qc.invalidateQueries({ queryKey: ["deliveries"] });
      onSuccess?.();
    },
    onError: (err) => {
      const details = err.response?.data?.errors;
      if (Array.isArray(details)) {
        const map = {};
        details.forEach((e) => (map[e.field || e.param] = e.message));
        setErrors(map);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!form.deliveryId) {
      toast.error("Sélectionnez une livraison");
      return;
    }
    if (!form.referenceId) {
      toast.error("Sélectionnez une référence");
      return;
    }
    if (form.quantityReceived === "" || Number(form.quantityReceived) < 0) {
      toast.error("Renseignez une quantité valide");
      return;
    }

    mutation.mutate({
      deliveryId: form.deliveryId,
      referenceId: form.referenceId,
      quantityReceived: Number(form.quantityReceived),
      status: form.status,
      comment: form.comment || null,
    });
  };

  if (isLoading) {
    return <div style={{ padding: 20 }}>Chargement des livraisons...</div>;
  }

  return (
    <form onSubmit={handleSubmit} id="reception-form">
      <Select
        label="Livraison"
        required
        placeholder="Sélectionner une livraison..."
        value={form.deliveryId}
        error={errors.deliveryId}
        onChange={(e) =>
          setForm({
            ...form,
            deliveryId: e.target.value,
            referenceId: "",
          })
        }
        options={eligibleDeliveries.map((d) => ({
          value: d.id,
          label: `${d.deliveryNumber} — ${d.destination?.name || "?"}`,
        }))}
      />

      {eligibleDeliveries.length === 0 ? (
        <div
          style={{
            padding: 10,
            background: "var(--color-warning-bg)",
            color: "#92400e",
            borderRadius: 8,
            fontSize: 12.5,
            marginBottom: 16,
          }}
        >
          ⚠️ Aucune livraison en transit / arrivée actuellement.
          <br />
          <span style={{ fontSize: 11 }}>
            (Total livraisons chargées : {allDeliveries.length})
          </span>
        </div>
      ) : null}

      <Select
        label="Référence"
        required
        placeholder={
          form.deliveryId
            ? "Sélectionner une référence..."
            : "Choisissez d'abord une livraison"
        }
        value={form.referenceId}
        error={errors.referenceId}
        disabled={!form.deliveryId}
        onChange={(e) => setForm({ ...form, referenceId: e.target.value })}
        options={referenceOptions}
      />

      <div className="form-row">
        <Input
          label="Quantité reçue"
          type="number"
          step="1"
          min="0"
          required
          placeholder="0"
          value={form.quantityReceived}
          error={errors.quantityReceived}
          onChange={(e) =>
            setForm({ ...form, quantityReceived: e.target.value })
          }
        />
        <Select
          label="Statut"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={Object.entries(RECEPTION_STATUS_META).map(
            ([value, meta]) => ({ value, label: meta.label }),
          )}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Commentaire</label>
        <textarea
          className="form-textarea"
          rows={3}
          placeholder="Remarques éventuelles, anomalies..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
      </div>
    </form>
  );
}
