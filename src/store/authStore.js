import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { triggerSessionReplacedEvent } from '../components/common/SessionEnforcementGuard';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && error?.response?.data?.code === 'SESSION_REPLACED') {
            const authHeader = error?.config?.headers?.Authorization || error?.config?.headers?.authorization || '';
            const failedToken = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
                ? authHeader.slice(7).trim()
                : null;
            triggerSessionReplacedEvent('staff', failedToken);
        }
        return Promise.reject(error);
    }
);

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
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('ethnotech:session-fresh-login', { detail: { role: 'staff', token } }));
                    }
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
