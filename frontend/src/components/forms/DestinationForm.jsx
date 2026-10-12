import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { destinationsApi } from "../../api/destinationsApi";
import Input from "../ui/Input";

export default function DestinationForm({ initial, onSuccess, onCancel }) {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    name: initial?.name || "",
    city: initial?.city || "",
    country: initial?.country || "",
    contactName: initial?.contactName || "",
    isActive: initial?.isActive ?? true,
  });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? destinationsApi.update({ id: initial.id, ...data })
        : destinationsApi.create(data),
    onSuccess: () => {
      toast.success(isEdit ? "Destination modifiée" : "Destination créée");
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
    <form onSubmit={handleSubmit} id="destination-form">
      <Input
        label="Nom du site"
        required
        placeholder="Site Production A"
        value={form.name}
        error={errors.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <div className="form-row">
        <Input
          label="Ville"
          placeholder="Casablanca"
          value={form.city}
          error={errors.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <Input
          label="Pays"
          placeholder="Maroc"
          value={form.country}
          error={errors.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
      </div>

      <Input
        label="Personne à contacter"
        placeholder="Ahmed Benali"
        value={form.contactName}
        error={errors.contactName}
        onChange={(e) => setForm({ ...form, contactName: e.target.value })}
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
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            Destination active
          </span>
        </label>
      </div>
    </form>
  );
}
