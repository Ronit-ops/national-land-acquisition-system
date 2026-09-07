import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getRoleAccessPolicy,
  type RoleAccessPolicy,
} from "./roleAccess";

export type GovernmentRole =
  | "DISTRICT_LAND_OFFICER"
  | "ACQUISITION_OFFICER"
  | "PROJECT_AUTHORITY"
  | "REVENUE_OFFICER"
  | "FIELD_VERIFICATION_OFFICER"
  | "STATE_ADMINISTRATOR";

export type GovernmentUser = {
  id: string;
  name: string;
  designation: string;
  department: string;
  organization: string;
  role: GovernmentRole;
  jurisdiction: string;
  jurisdictionType: "DISTRICT" | "STATE" | "PROJECT";
};

type AuthContextValue = {
  user: GovernmentUser | null;
  accessPolicy: RoleAccessPolicy | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: GovernmentUser) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "nlas-government-session";

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<GovernmentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(
        AUTH_STORAGE_KEY,
      );

      if (storedSession) {
        const parsedUser = JSON.parse(
          storedSession,
        ) as GovernmentUser;

        setUser(parsedUser);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (authenticatedUser: GovernmentUser) => {
    setUser(authenticatedUser);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(authenticatedUser),
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const accessPolicy = useMemo(() => {
    if (!user) {
      return null;
    }

    return getRoleAccessPolicy(user.role);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessPolicy,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, accessPolicy, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider",
    );
  }

  return context;
}