import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCollegeStore = create(
    persist(
        (set) => ({
            selectedCollegeId: null,
            selectedCollegeName: '',
            
            setSelectedCollege: (id, name) => set({ 
                selectedCollegeId: id, 
                selectedCollegeName: name 
            }),
            
            clearSelectedCollege: () => set({ 
                selectedCollegeId: null, 
                selectedCollegeName: '' 
            }),
        }),
        {
            name: 'college-context',
        }
    )
);

export default useCollegeStore;
