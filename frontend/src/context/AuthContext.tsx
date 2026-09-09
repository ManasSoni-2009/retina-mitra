'use client';

import React, { createContext, useContext, useState } from 'react';

// Static AppUser type since we removed firebase auth dependency for the prototype
export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'operator' | 'reviewer' | 'admin';
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hardcoded prototype user
  const [user, setUser] = useState<AppUser | null>({
    uid: 'prototype-operator-uid',
    email: 'operator@retinamitra.prototype',
    displayName: 'Prototype Operator',
    role: 'operator',
  });
  
  const loading = false;

  const handleLogin = async (email: string, pass: string) => {
    // Mock login
    setUser({
      uid: 'prototype-operator-uid',
      email: email,
      displayName: 'Prototype Operator',
      role: 'operator',
    });
  };

  const handleLogout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
