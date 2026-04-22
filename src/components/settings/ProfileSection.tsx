"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileSectionProps {
  user: {
    email: string | null;
    name: string | null;
    image: string | null;
  };
  onProfileUpdate: (name: string) => void;
  onAvatarUpdate: (url: string) => void;
}

export function ProfileSection({ user, onProfileUpdate, onAvatarUpdate }: ProfileSectionProps) {
  const [name, setName] = useState(user.name ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function compressImage(file: File, maxSizeMB = 2): Promise<File> {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size <= maxBytes) return file;

    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Reducir dimensiones si son muy grandes
        const MAX_DIM = 1200;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);

        // Reducir calidad hasta que quepa en maxSizeMB
        let quality = 0.85;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("No se pudo comprimir la imagen"));
              if (blob.size <= maxBytes || quality <= 0.1) {
                resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
              } else {
                quality -= 0.1;
                tryCompress();
              }
            },
            "image/jpeg",
            quality
          );
        };
        tryCompress();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo leer la imagen"));
      };
      img.src = url;
    });
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setAvatarMsg(null);
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);

      const res = await fetch("/api/user/avatar", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Error desconocido");

      setImage(data.url);
      onAvatarUpdate(data.url);
      setAvatarMsg({ type: "success", text: "Foto actualizada correctamente." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al subir la imagen.";
      setAvatarMsg({ type: "error", text: msg });
    } finally {
      setAvatarUploading(false);
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
      onProfileUpdate(name);
      setProfileMsg({ type: "success", text: "Perfil actualizado correctamente." });
    } catch {
      setProfileMsg({ type: "error", text: "Error al guardar. Inténtalo de nuevo." });
    } finally {
      setProfileSaving(false);
    }
  }

  return (
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
  );
}
