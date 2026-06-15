import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCollegeStore = create(
    persist(
        (set) => ({
            selectedCollegeId: null,
            selectedCollegeName: '',
            selectedCollegeCode: '',
            
            setSelectedCollege: (id, name, code = '') => set({ 
                selectedCollegeId: id, 
                selectedCollegeName: name,
                selectedCollegeCode: code
            }),
            
            clearSelectedCollege: () => set({ 
                selectedCollegeId: null, 
                selectedCollegeName: '',
                selectedCollegeCode: ''
            }),
        }),
        {
            name: 'college-context',
        }
    )
);

export default useCollegeStore;
