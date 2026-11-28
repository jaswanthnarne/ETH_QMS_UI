import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

export default useCollegeStore;
