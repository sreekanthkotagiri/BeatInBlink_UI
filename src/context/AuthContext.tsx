// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

export type User = {
  id: string;
  name: string;
  institute_name: string;
  branch_name: string;
  role: 'student' | 'institute';
};

type AuthState = {
  student: User | null;
  institute: User | null;
  currentRole: 'student' | 'institute' | null;
};

type AuthContextType = {
  authState: AuthState;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    student: null,
    institute: null,
    currentRole: null,
  });
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  useEffect(() => {
    const storedRole = localStorage.getItem('role') as 'student' | 'institute' | null;
    const storedToken = localStorage.getItem('token');
    console.log('🔁 Checking localStorage for auth:', { storedRole, storedToken });
  
    if (storedRole) {
      const userData = localStorage.getItem(storedRole);
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('✅ Restored user from storage:', parsedUser);
          setAuthState({
            student: storedRole === 'student' ? parsedUser : null,
            institute: storedRole === 'institute' ? parsedUser : null,
            currentRole: storedRole,
          });
        } catch (err) {
          console.error('❌ JSON parse error in AuthContext:', err);
        }
      }
    }
  
    setIsAuthInitialized(true);
  }, []);

  const login = (userData: User, token: string) => {
    console.log('🔐 login() called with:', userData);
    localStorage.setItem('token', token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem(userData.role, JSON.stringify(userData)); // ✅ this is key
    const storedToken = localStorage.getItem('token');
    setAuthState({
      student: userData.role === 'student' ? userData : null,
      institute: userData.role === 'institute' ? userData : null,
      currentRole: userData.role,
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuthState({ student: null, institute: null, currentRole: null });
  };

  const isAuthenticated = authState.currentRole !== null;

  return (
    <AuthContext.Provider value={{ authState, login, logout, isAuthenticated, isAuthInitialized  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
