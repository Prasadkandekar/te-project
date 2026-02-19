import Cookies from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ENTREPRENEUR' | 'MENTOR' | 'ADMIN';
  bio?: string;
  skills?: string[];
  location?: string;
  avatar?: string;
  verified: boolean;
  createdAt: string;
}

export const getToken = (): string | undefined => {
  return Cookies.get('token');
};

export const setToken = (token: string): void => {
  Cookies.set('token', token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const removeToken = (): void => {
  Cookies.remove('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const setUserToStorage = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const removeUserFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

export const logout = (): void => {
  removeToken();
  removeUserFromStorage();
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};