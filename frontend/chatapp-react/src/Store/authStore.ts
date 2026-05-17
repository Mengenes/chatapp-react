import { create } from "zustand";
import axiosBaseurl from "../configs/axios/AxiosBaseurl";
import {socket} from '../../src/socket'
export type User = {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isOnline: boolean;
};

type AuthStore = {
  user: User | null;
  users: User[];
  isRestored: boolean;
  hasLoggedOut: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  updateUserStatus: (userId: string, username: string, isOnline: boolean) => void;
  setUsers: (usersList: User[]) => void;
  restoreUser: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  users: [],
  isRestored: false,
  hasLoggedOut: false,

  setUser: (userData) => set({ user: userData }),

  logout: async () => {
    try {
      await axiosBaseurl.post("/auth/logout");
      socket.removeAllListeners();
socket.disconnect();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("user");
      set({ user: null, hasLoggedOut: true, });
    }
  },

  setUsers: (usersList) => set({ users: usersList }),

  updateUserStatus: (userId, username, isOnline) =>
    set((state) => {
      const exists = state.users.some((u) => u.id === userId);
      if (exists) {
        return {
          users: state.users.map((u) =>
            u.id === userId ? { ...u, username, isOnline } : u
          ),
        };
      }
      return {
        users: [
          ...state.users,
          { id: userId, username, email: "", role: "user", isOnline },
        ],
      };
    }),

  restoreUser: async () => {
    try {
      const res = await axiosBaseurl.get("/user/me");
      set({ user: res.data ?? null, isRestored: true, hasLoggedOut: false });
    } catch {
      localStorage.removeItem("user");
      set({ user: null, isRestored: true });
    }
  },
}));