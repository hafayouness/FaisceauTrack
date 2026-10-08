import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock } from "lucide-react";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);

  const [form, setForm] = useState({ email: "", password: "" });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setSession(response.data);
      console.log("✅ Login successful:", response.data);
      toast.success(`Bienvenue ${response.data.user?.name || ""} !`);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    loginMutation.mutate(form);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">FT</div>
        <h1 className="login-title">FaisceauTrack</h1>
        <p className="login-subtitle">
          Connectez-vous pour gérer les livraisons de faisceaux
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              Adresse email <span className="required">*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="vous@faisceautrack.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Mot de passe <span className="required">*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          {/* Bouton */}
          <Button
            type="submit"
            size="lg"
            loading={loginMutation.isPending}
            icon={LogIn}
            style={{ width: "100%", marginTop: 8 }}
          >
            Se connecter
          </Button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          Pas encore de compte ?{" "}
          <a
            href="/register"
            style={{ color: "var(--color-primary-600)", fontWeight: 600 }}
          >
            S'inscrire
          </a>
        </p>

        <p
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Contactez un administrateur pour obtenir un accès
        </p>
      </div>
    </div>
  );
}
