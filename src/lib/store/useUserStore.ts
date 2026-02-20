import { create } from "zustand";

export interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  currency: string;
}

interface UserState {
  user: UserData | null;
  loading: boolean;
  
  // Actions
  setUser: (user: UserData) => void;
  updateUser: (updates: Partial<UserData>) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error();
      const data = await res.json();
      set({ user: data });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
