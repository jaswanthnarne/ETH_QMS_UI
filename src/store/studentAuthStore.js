import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
});

const useStudentAuthStore = create(
    persist(
        (set, get) => ({
            student: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            todos: [],

            loginStudent: async (usernameOrMobile, password) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.post('/student/login', { 
                        usernameOrMobile, 
                        password 
                    });
                    const { token, ...studentData } = response.data;
                    set({ 
                        student: studentData, 
                        token, 
                        isAuthenticated: true, 
                        loading: false 
                    });
                    return { success: true };
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Login failed';
                    set({ 
                        error: errMsg, 
                        loading: false 
                    });
                    return { success: false, error: errMsg };
                }
            },

            setupPassword: async (usn, identifier, newPassword) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.post('/student/setup-password', {
                        usn,
                        identifier,
                        newPassword
                    });
                    set({ loading: false });
                    return { success: true, message: response.data.message };
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Password setup failed';
                    set({ error: errMsg, loading: false });
                    return { success: false, error: errMsg };
                }
            },

            logoutStudent: () => {
                set({ 
                    student: null, 
                    token: null, 
                    isAuthenticated: false, 
                    error: null 
                });
                localStorage.removeItem('student-auth-storage');
            },

            updateProfile: async (profileData) => {
                const { token, student } = get();
                set({ loading: true, error: null });
                try {
                    const res = await api.put('/student/profile', profileData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        set({
                            student: { ...student, ...res.data.data },
                            loading: false
                        });
                        return { success: true };
                    }
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Failed to update profile';
                    set({ loading: false, error: errMsg });
                    return { success: false, error: errMsg };
                }
            },

            updateExternalHandles: async (handlesData) => {
                const { token, student } = get();
                set({ loading: true, error: null });
                try {
                    const res = await api.put('/student/profile/handles', handlesData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        set({
                            student: { ...student, externalHandles: res.data.data },
                            loading: false
                        });
                        return { success: true };
                    }
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Failed to update external handles';
                    set({ loading: false, error: errMsg });
                    return { success: false, error: errMsg };
                }
            },

            uploadResume: async (file) => {
                const { token, student } = get();
                set({ loading: true, error: null });
                try {
                    const formData = new FormData();
                    formData.append('resume', file);
                    const res = await api.post('/student/resume', formData, {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    if (res.data.success) {
                        set({
                            student: { ...student, resumeUrl: res.data.resumeUrl },
                            loading: false
                        });
                        return { success: true, resumeUrl: res.data.resumeUrl };
                    }
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Failed to upload resume';
                    set({ loading: false, error: errMsg });
                    return { success: false, error: errMsg };
                }
            },

            changePassword: async (currentPassword, newPassword) => {
                const { token } = get();
                set({ loading: true, error: null });
                try {
                    const res = await api.put('/student/change-password', {
                        currentPassword,
                        newPassword
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    set({ loading: false });
                    return { success: true, message: res.data.message };
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Failed to change password';
                    set({ loading: false, error: errMsg });
                    return { success: false, error: errMsg };
                }
            },

            refreshStudentProfile: async () => {
                const { token, student } = get();
                if (!token) return;
                try {
                    const res = await api.get('/student/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        set({ student: { ...student, ...res.data.data, attendance: res.data.attendance } });
                    }
                } catch (error) {
                    console.error('Failed to refresh profile:', error.message);
                }
            },

            getTodos: async () => {
                const { token } = get();
                if (!token) return { success: false, error: 'No token' };
                set({ loading: true, error: null });
                try {
                    const res = await api.get('/student/todos', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        set({ todos: res.data.data, loading: false });
                        return { success: true, data: res.data.data };
                    }
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Failed to fetch tasks';
                    set({ loading: false, error: errMsg });
                    return { success: false, error: errMsg };
                }
            },

            addTodo: async (todoData) => {
                const { token, todos } = get();
                if (!token) return { success: false, error: 'No token' };
                set({ loading: true, error: null });
                try {
                    const res = await api.post('/student/todos', todoData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        set({ todos: [res.data.data, ...todos], loading: false });
                        return { success: true, data: res.data.data };
                    }
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Failed to add task';
                    set({ loading: false, error: errMsg });
                    return { success: false, error: errMsg };
                }
            },

            updateTodo: async (id, updatedFields) => {
                const { token, todos } = get();
                if (!token) return { success: false, error: 'No token' };
                try {
                    const res = await api.put(`/student/todos/${id}`, updatedFields, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        const updatedTodos = todos.map(todo => 
                            todo._id === id ? res.data.data : todo
                        );
                        set({ todos: updatedTodos });
                        return { success: true, data: res.data.data };
                    }
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Failed to update task';
                    return { success: false, error: errMsg };
                }
            },

            deleteTodo: async (id) => {
                const { token, todos } = get();
                if (!token) return { success: false, error: 'No token' };
                try {
                    const res = await api.delete(`/student/todos/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        set({ todos: todos.filter(todo => todo._id !== id) });
                        return { success: true };
                    }
                } catch (error) {
                    const errMsg = error.response?.data?.error || 'Failed to delete task';
                    return { success: false, error: errMsg };
                }
            }
        }),
        {
            name: 'student-auth-storage',
        }
    )
);

export default useStudentAuthStore;
