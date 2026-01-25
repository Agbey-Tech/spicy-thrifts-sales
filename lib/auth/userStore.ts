import { create } from "zustand";

export type UserProfile = {
  id: string;
  full_name: string;
  role: "ADMIN" | "SALES";
  email: string;
};

type UserStore = {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
