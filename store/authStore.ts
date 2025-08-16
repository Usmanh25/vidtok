import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { IUser } from '../types';

axios.defaults.withCredentials = true;

interface AuthStore {
  userProfile: IUser | null;
  allUsers: IUser[];
  addUser: (user: IUser) => void;
  removeUser: () => void;
  fetchAllUsers: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUserProfile: (user: IUser) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      userProfile: null,
      allUsers: [],

      addUser: (user) =>
        set({
          userProfile: {
            ...user,
            image: user.image || '/default-image.jpg',
          },
        }),

      removeUser: () => set({ userProfile: null }),

      fetchAllUsers: async () => {
        try {
          const res = await axios.get('/api/users');
          set({ allUsers: res.data });
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      },

      login: async (username, password) => {
        try {
          const res = await axios.post('/api/auth/login', {
            identifier: username,
            password,
          });
          set({
            userProfile: {
              ...res.data.user,
              image: res.data.user.image || '/default-image.jpg',
            },
          });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      logout: async () => {
        try {
          await axios.delete('/api/auth/logout');
        } catch {
          // silent failure
        } finally {
          set({ userProfile: null });
        }
      },

      checkAuth: async () => {
        try {
          const res = await axios.get('/api/auth/me');
          console.log('checkAuth response user:', res.data.user);

          set({
            userProfile: {
              ...res.data.user,
              image: res.data.user.image || '/default-image.jpg',
            },
          });
        } catch (error) {
          console.warn('checkAuth failed: user not logged in or token invalid');
          set({ userProfile: null });
        }
      },

      setUserProfile: (user) =>
        set({
          userProfile: {
            ...user,
            image: user.image || '/default-image.jpg',
          },
        }),
    }),
    {
      name: 'auth',
    }
  )
);

export default useAuthStore;
