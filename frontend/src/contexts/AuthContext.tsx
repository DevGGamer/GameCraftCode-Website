import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "@/api";

interface User {
  id: number;
  name: string;
  surname: string;
  role: "admin" | "teacher" | "student" | "parent";
  avatar: string | null;
  email: string | null;
  phone: string | null;
}

interface Stats {
  coins: number;
  balance: number;
  streak: number;
  level: number;
  achievements: number;
}

interface AuthContextType {
  user: User | null;
  stats: Stats | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/profile");
      setUser(res.data.user);
      setStats(res.data.stats);
    } catch {
      setUser(null);
      setStats(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = useCallback((token: string) => {
    localStorage.setItem("token", token);
    setLoading(true);
    fetchProfile();
  }, [fetchProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    setUser(null);
    setStats(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, stats, loading, login, logout, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
