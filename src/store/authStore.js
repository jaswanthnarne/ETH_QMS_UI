import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
});

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            login: async (loginValue, password) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.post('/auth/login', { 
                        email: loginValue, // Backend checks both email and username using this field
                        password 
                    });
                    const { token, ...userData } = response.data;
                    set({ 
                        user: userData, 
                        token, 
                        isAuthenticated: true, 
                        loading: false 
                    });
                    return { success: true };
                } catch (error) {
                    set({ 
                        error: error.response?.data?.error || 'Login failed', 
                        loading: false 
                    });
                    return { success: false, error: error.response?.data?.error };
                }
            },

            logout: () => {
                set({ 
                    user: null, 
                    token: null, 
                    isAuthenticated: false, 
                    error: null 
                });
                localStorage.removeItem('auth-storage');
            },

            setToken: (token) => {
                set({ token });
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;
