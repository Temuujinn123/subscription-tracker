// context/AuthContext.tsx
import { useLoginMutation, useRegisterMutation } from "@/services/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthContextType {
  user: any;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [handleLogin, { isLoading: loginLoading }] = useLoginMutation();
  const [handleRegister, { isLoading: registerLoading }] =
    useRegisterMutation();

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser = { email };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        resolve();
      }, 1000);
    });
  };

  const signIn = async (email: string, password: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const user = { email };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    signUp,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
