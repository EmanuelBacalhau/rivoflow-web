import { createContext } from "react";

interface AuthContextType {
  signedIn: boolean;
  signInWithCode: (code: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextType);
