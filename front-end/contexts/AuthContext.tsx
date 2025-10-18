import { clearAuthData, setAuthData } from "@/services/authSlice";
import { RootState } from "@/services/store";
import {
  useAuthGoogleMutation,
  useGetAccessTokenQuery,
  useGetUserDetailQuery,
  useLoginMutation,
  useLogOutMutation,
  useRegisterMutation,
} from "@/services/user";
import { CodeResponse } from "@react-oauth/google";
import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface AuthContextType {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  googleAuthLoginHandler: (
    tokenResponse: Omit<CodeResponse, "error">,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data } = useGetAccessTokenQuery(undefined, {});

  const [handleLogin] = useLoginMutation();
  const [handleRegister] = useRegisterMutation();
  const [handleLogout] = useLogOutMutation();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      dispatch(setAuthData({ token: data.token }));
    }
  }, [dispatch, data]);

  const [user, setUser] = useState<User | undefined>(undefined);

  const { data: userDetail } = useGetUserDetailQuery(undefined, {
    skip: !!user || (!token && token != ""),
  });
  const [handleAuthGoogle] = useAuthGoogleMutation();

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
    password: string,
  ) => {
    const response = await handleRegister({ name, email, password });

    if (response.error && response.error) {
      console.error("Failed to register: ", response.error);

      if ("data" in response.error) {
        throw new Error(String(response.error.data));
      }

      throw new Error("Failed to register.");
    }

    setUser(response.data.user);
    dispatch(setAuthData({ token: response.data.token }));

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

    if (response.error) {
      console.error("Failed to login: ", response.error);

      throw new Error("Failed to login");
    }

    setUser(response.data.user);
    dispatch(setAuthData({ token: response.data.token }));

    router.push("/dashboard");
  };

  const googleAuthLoginHandler = async (
    tokenResponse: Omit<CodeResponse, "error">,
  ) => {
    try {
      // Send the authorization code to your backend
      const response = await handleAuthGoogle(tokenResponse.code);

      if (response.error) {
        console.error(response.error);

        if (
          "data" in response.error &&
          typeof response.error.data === "string"
        ) {
          toast.error(response.error.data);
        } else {
          toast.error("Please try again");
        }

        return;
      }

      toast.success(response.data.message);
      dispatch(setAuthData({ token: response.data.token }));
      setUser(response.data.user);

      router.push("/dashboard");
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const logout = async () => {
    await handleLogout();
    dispatch(clearAuthData());
    setUser(undefined);
    toast.success("Successfully logged out");
    router.push("/login");
  };

  const value = {
    user,
    setUser,
    signUp,
    signIn,
    googleAuthLoginHandler,
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
