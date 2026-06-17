import { create } from 'zustand';

export const useToastStore = create((set) => ({
    toasts: [],
    show: (message, type = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            toasts: [...state.toasts, { id, message, type }]
        }));
        // Remove after 4 seconds
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id)
            }));
        }, 4000);
    },
    remove: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
    }))
}));

// Set up global window-level shortcut for simplicity
if (typeof window !== 'undefined') {
    window.toast = {
        success: (msg) => useToastStore.getState().show(msg, 'success'),
        error: (msg) => useToastStore.getState().show(msg, 'error'),
        info: (msg) => useToastStore.getState().show(msg, 'info'),
        warning: (msg) => useToastStore.getState().show(msg, 'warning'),
    };
}
