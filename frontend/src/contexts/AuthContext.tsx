import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/client';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@AtendeSaude:user');
    const storagedToken = localStorage.getItem('@AtendeSaude:token');

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
      setToken(storagedToken);
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    const response = await api.post('/login', { email, password });
    const { access_token, user: userData } = response.data;

    setUser(userData);
    setToken(access_token);

    localStorage.setItem('@AtendeSaude:user', JSON.stringify(userData));
    localStorage.setItem('@AtendeSaude:token', access_token);
  }

  function signOut() {
    localStorage.removeItem('@AtendeSaude:user');
    localStorage.removeItem('@AtendeSaude:token');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}