// context/AuthContext.tsx
import {
  useGetUserDetailQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/services/user";
import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | undefined;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [handleLogin] = useLoginMutation();
  const [handleRegister] = useRegisterMutation();

  const router = useRouter();

  const [user, setUser] = useState<User | undefined>(undefined);

  const { data: userDetail } = useGetUserDetailQuery(undefined, {
    skip:
      (typeof window !== "undefined" && !localStorage.getItem("token")) ||
      !!user,
  });

  useEffect(() => {
    setUser(userDetail);
  }, [userDetail]);

  const signUp = async (name: string, email: string, password: string) => {
    toast.promise(signUpHandler(name, email, password), {
      loading: "Loading...",
      success: <b>Success</b>,
      error: (err) => <b>{err.message}</b>,
    });
  };

  const signUpHandler = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await handleRegister({ name, email, password });

    if ("error" in response && response.error) {
      console.error("Failed to register: ", response.error);

      if ("data" in response.error) {
        throw new Error(String(response.error.data));
      }

      throw new Error("Failed to register.");
    }

    setUser(response.data.user);
    localStorage.setItem("token", response.data.token);

    router.push("/dashboard");
  };

  const signIn = async (email: string, password: string) => {
    toast.promise(signInHandler(email, password), {
      loading: "Loading...",
      success: <b>Success</b>,
      error: (err) => <b>{err.message}</b>,
    });
  };

  const signInHandler = async (email: string, password: string) => {
    const response = await handleLogin({ email, password });

    if ("error" in response) {
      console.error("Failed to login: ", response.error);

      throw new Error("Failed to login");
    }

    setUser(response.data.user);
    localStorage.setItem("token", response.data.token);

    router.push("/dashboard");
  };

  const logout = () => {
    setUser(undefined);
    localStorage.removeItem("token");
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
