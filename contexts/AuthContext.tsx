import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, Role } from '../types';
import { MOCK_EMPLOYEES } from '../constants';

interface AuthContextType {
  user: Employee | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Employee | null>(null);

  useEffect(() => {
    // Check local storage for persisted session (simulated)
    const savedUser = localStorage.getItem('grx10_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_EMPLOYEES.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('grx10_user', JSON.stringify(foundUser));
    } else {
      throw new Error("User not found");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('grx10_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};