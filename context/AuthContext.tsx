import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

// Mock users with different roles
const mockUsers: { [key: string]: User } = {
  'diretoria@email.com': { name: 'Diretor', role: 'Diretor', avatar: 'D' },
  'admin@email.com': { name: 'Admin RH', role: 'RH', avatar: 'RH' },
  'lider@email.com': { name: 'Líder de Loja', role: 'Líder de Loja', avatar: 'L' },
};

// A safe storage wrapper that checks for localStorage availability once.
const createSafeStorage = (): Storage => {
  // In-memory storage fallback
  const inMemoryStore: { [key: string]: string } = {};
  const inMemoryStorage: Storage = {
    getItem: (key: string) => inMemoryStore[key] ?? null,
    setItem: (key: string, value: string) => {
      inMemoryStore[key] = value;
    },
    removeItem: (key: string) => {
      delete inMemoryStore[key];
    },
    clear: () => {
      for (const key in inMemoryStore) {
        delete inMemoryStore[key];
      }
    },
    key: (index: number) => Object.keys(inMemoryStore)[index] ?? null,
    get length() {
      return Object.keys(inMemoryStore).length;
    },
  };

  try {
    // We need to check for existence and then perform a test operation.
    // The entire block is in a try-catch to handle SecurityError.
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__test_storage_';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (e) {
    console.warn("localStorage is not available, falling back to in-memory storage. User session will not be persisted across page loads.", e);
  }
  
  // If the try block failed or localStorage is not available, return the in-memory fallback.
  return inMemoryStorage;
};


const safeStorage = createSafeStorage();

// Helper function to get user from safe storage
const getStoredUser = (): User | null => {
  const storedUser = safeStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as User;
    } catch (e) {
      // Data is corrupted, remove it.
      safeStorage.removeItem('user');
      return null;
    }
  }
  return null;
};

// Helper function to set user in safe storage
const setStoredUser = (user: User): void => {
  safeStorage.setItem('user', JSON.stringify(user));
};

// Helper function to remove user from safe storage
const removeStoredUser = (): void => {
  safeStorage.removeItem('user');
};

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in storage on initial load
    const userFromStorage = getStoredUser();
    if (userFromStorage) {
      // FIX: Corrected typo from userFromstorage to userFromStorage.
      setUser(userFromStorage);
    }
    setLoading(false); // Stop loading once user is checked
  }, []);

  const login = async (email: string, pass: string) => {
    // Simple password check for mock purposes
    const validPassword = (email === 'lider@email.com' && pass === 'senha123') || pass === 'admin123';
    const foundUser = mockUsers[email];

    if (foundUser && validPassword) {
      setUser(foundUser);
      setStoredUser(foundUser);
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = () => {
    setUser(null);
    removeStoredUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};