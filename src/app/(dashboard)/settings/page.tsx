"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/lib/utils/currency";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  currency: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Perfil
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preferencias
  const [currency, setCurrency] = useState("CLP");
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefMsg, setPrefMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Cerrar sesión
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error();
        const data: UserData = await res.json();
        setUser(data);
        setName(data.name ?? "");
        setImage(data.image ?? "");
        setCurrency(data.currency ?? "CLP");
      } catch {
        // silenciar
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setAvatarMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/user/avatar", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Error desconocido");

      setImage(data.url);
      setAvatarMsg({ type: "success", text: "Foto actualizada correctamente." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al subir la imagen.";
      setAvatarMsg({ type: "error", text: msg });
    } finally {
      setAvatarUploading(false);
      // limpiar input para permitir subir el mismo archivo de nuevo
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleProfileSave() {
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      setProfileMsg({ type: "success", text: "Perfil actualizado correctamente." });
    } catch {
      setProfileMsg({ type: "error", text: "Error al guardar. Inténtalo de nuevo." });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePreferencesSave() {
    setPrefSaving(true);
    setPrefMsg(null);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      if (!res.ok) throw new Error();
      setPrefMsg({ type: "success", text: "Preferencias guardadas correctamente." });
    } catch {
      setPrefMsg({ type: "error", text: "Error al guardar. Inténtalo de nuevo." });
    } finally {
      setPrefSaving(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
          <p className="text-sm text-white/60">Administra las preferencias de tu cuenta</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-sm text-white/60">Administra las preferencias de tu cuenta</p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Tu información personal visible en la plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-3xl font-bold text-white/60">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                (name || user?.email || "?")[0].toUpperCase()
              )}
              {avatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">{user?.email}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
              >
                {avatarUploading ? "Subiendo..." : "Cambiar foto"}
              </Button>
              <p className="text-xs text-white/30">JPG, PNG, WebP o GIF · máx. 2 MB</p>
            </div>
          </div>

          {avatarMsg && (
            <p className={`text-sm ${avatarMsg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
              {avatarMsg.text}
            </p>
          )}

          <Input
            id="name"
            label="Nombre"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {profileMsg && (
            <p className={`text-sm ${profileMsg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
              {profileMsg.text}
            </p>
          )}

          <div className="flex justify-end">
            <Button onClick={handleProfileSave} disabled={profileSaving}>
              {profileSaving ? "Guardando..." : "Guardar nombre"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <CardDescription>Moneda predeterminada usada en todas tus suscripciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            id="currency"
            label="Moneda predeterminada"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={SUPPORTED_CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
          />

          {prefMsg && (
            <p className={`text-sm ${prefMsg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
              {prefMsg.text}
            </p>
          )}

          <div className="flex justify-end">
            <Button onClick={handlePreferencesSave} disabled={prefSaving}>
              {prefSaving ? "Guardando..." : "Guardar preferencias"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sesión */}
      <Card>
        <CardHeader>
          <CardTitle>Sesión</CardTitle>
          <CardDescription>Cierra tu sesión en este dispositivo</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
