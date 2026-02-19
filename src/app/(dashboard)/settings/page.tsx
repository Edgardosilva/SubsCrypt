"use client";

import { useState, useEffect } from "react";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { SessionSection } from "@/components/settings/SessionSection";

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

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error();
        const data: UserData = await res.json();
        setUser(data);
      } catch {
        // silenciar
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleProfileUpdate = (name: string) => {
    if (user) setUser({ ...user, name });
  };

  const handleAvatarUpdate = (image: string) => {
    if (user) setUser({ ...user, image });
  };

  const handlePreferencesUpdate = (currency: string) => {
    if (user) setUser({ ...user, currency });
  };

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

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-sm text-white/60">Administra las preferencias de tu cuenta</p>
      </div>

      <ProfileSection
        user={user}
        onProfileUpdate={handleProfileUpdate}
        onAvatarUpdate={handleAvatarUpdate}
      />

      <PreferencesSection
        initialCurrency={user.currency}
        onPreferencesUpdate={handlePreferencesUpdate}
      />

      <SessionSection />
    </div>
  );
}
