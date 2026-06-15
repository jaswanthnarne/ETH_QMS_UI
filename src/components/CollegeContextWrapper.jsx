import { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import useCollegeStore from '../store/collegeStore';
import { Loader2 } from 'lucide-react';

const CollegeContextWrapper = () => {
    const { collegeId } = useParams();
    const { token } = useAuthStore();
    const { selectedCollegeId, selectedCollegeName, selectedCollegeCode, setSelectedCollege } = useCollegeStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedCollegeId === collegeId && selectedCollegeCode) {
            document.title = `${selectedCollegeCode} X ETH`;
        }
        return () => {
            document.title = 'Ethnotech Assessment';
        };
    }, [collegeId, selectedCollegeId, selectedCollegeCode]);

    useEffect(() => {
        const loadCollege = async () => {
            if (!collegeId) {
                setLoading(false);
                return;
            }
            const currentStore = useCollegeStore.getState();
            if (currentStore.selectedCollegeId === collegeId && currentStore.selectedCollegeCode) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/colleges`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    const matched = res.data.data.find(c => c._id === collegeId);
                    if (matched) {
                        setSelectedCollege(matched._id, matched.name, matched.code);
                    }
                }
            } catch (e) {
                console.error('Failed to load college context', e);
            } finally {
                setLoading(false);
            }
        };

        if (token && collegeId) {
            loadCollege();
        } else {
            setLoading(false);
        }
    }, [collegeId, token, setSelectedCollege]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-[#004AAD]" size={36} />
            </div>
        );
    }

    return <Outlet />;
};

export default CollegeContextWrapper;
