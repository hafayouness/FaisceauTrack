import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { trailersApi } from "../../api/trailersApi";
import Input from "../ui/Input";
import Select from "../ui/Select";

const TRAILER_TYPES = [
  { value: "SEMI_REMORQUE", label: "Semi-remorque" },
  { value: "PORTE_CONTENEUR", label: "Porte-conteneur" },
  { value: "PLATEAU", label: "Plateau" },
  { value: "FRIGORIFIQUE", label: "Frigorifique" },
  { value: "CITERNE", label: "Citerne" },
  { value: "BENNE", label: "Benne" },
  { value: "TAUTLINER", label: "Tautliner" },
  { value: "AUTRE", label: "Autre" },
];

export default function TrailerForm({ initial, onSuccess, onCancel }) {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    registrationNumber: initial?.registrationNumber || "",
    type: initial?.type || "",
    isActive: initial?.isActive ?? true,
  });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? trailersApi.update({ id: initial.id, ...data })
        : trailersApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? "Remorque modifiée" : "Remorque créée");
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
    mutation.mutate(form);
  };

  return (
    <form onSubmit={handleSubmit} id="trailer-form">
      <Input
        label="Immatriculation"
        required
        placeholder="REM-025"
        value={form.registrationNumber}
        error={errors.registrationNumber}
        onChange={(e) =>
          setForm({ ...form, registrationNumber: e.target.value })
        }
      />

      <Select
        label="Type"
        placeholder="Sélectionner un type..."
        value={form.type}
        error={errors.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        options={TRAILER_TYPES}
      />

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Remorque active</span>
        </label>
      </div>
    </form>
  );
}
