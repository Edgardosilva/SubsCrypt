"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/store/useUserStore";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { SessionSection } from "@/components/settings/SessionSection";

export default function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const updateUser = useUserStore((state) => state.updateUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
        onProfileUpdate={(name) => updateUser({ name })}
        onAvatarUpdate={(image) => updateUser({ image })}
      />

      <PreferencesSection
        initialCurrency={user.currency}
        onPreferencesUpdate={(currency) => updateUser({ currency })}
      />

      <SessionSection />
    </div>
  );
}
