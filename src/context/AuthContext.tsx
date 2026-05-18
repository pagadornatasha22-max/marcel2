import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (identifier: string, password: string) => { success: boolean; message: string };
  register: (userData: Omit<User, 'id' | 'role' | 'createdAt'>) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  getAllCustomers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('macels_currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (identifier: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('macels_users') || '[]');
    const user = users.find(
      (u) => (u.email === identifier || u.username === identifier) && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('macels_currentUser', JSON.stringify(user));
      return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid email/username or password.' };
  };

  const register = (userData: Omit<User, 'id' | 'role' | 'createdAt'>) => {
    const users: User[] = JSON.parse(localStorage.getItem('macels_users') || '[]');
    const emailExists = users.find((u) => u.email === userData.email);
    if (emailExists) {
      return { success: false, message: 'Email already registered.' };
    }
    const usernameExists = users.find((u) => u.username === userData.username);
    if (usernameExists) {
      return { success: false, message: 'Username already taken.' };
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('macels_users', JSON.stringify(users));
    return { success: true, message: 'Registration successful! You can now login.' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('macels_currentUser');
    localStorage.removeItem('macels_currentPage');
    localStorage.removeItem('macels_directOrderProductId');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!currentUser) return;
    const users: User[] = JSON.parse(localStorage.getItem('macels_users') || '[]');
    const index = users.findIndex((u) => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      localStorage.setItem('macels_users', JSON.stringify(users));
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('macels_currentUser', JSON.stringify(updatedUser));
    }
  };

  const getAllCustomers = () => {
    const users: User[] = JSON.parse(localStorage.getItem('macels_users') || '[]');
    return users.filter((u) => u.role === 'customer');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateProfile, getAllCustomers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
