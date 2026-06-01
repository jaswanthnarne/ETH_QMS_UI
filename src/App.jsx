import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';

// Public Pages
import Login from './pages/Login';
import StudentEntry from './pages/StudentEntry';
import StudentExam from './pages/StudentExam';
import ResumeExam from './pages/student/ResumeExam';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerExams from './pages/trainer/TrainerExams';
import WaitingRoom from './pages/trainer/WaitingRoom';
import TrainingLogs from './pages/trainer/TrainingLogs';
import Batches from './pages/trainer/Batches';
import Colleges from './pages/admin/Colleges';
import Courses from './pages/admin/Courses';
import Trainers from './pages/admin/Trainers';
import Exams from './pages/admin/Exams';
import CreateExam from './pages/admin/CreateExam';
import Analytics from './pages/admin/Analytics';
import Reports from './pages/admin/Reports';
import Allotments from './pages/admin/Allotments';
import AuditLogs from './pages/admin/AuditLogs';
import Leaderboard from './pages/admin/Leaderboard';
import QuestionBank from './pages/admin/QuestionBank';
import AdminTrainingLogs from './pages/admin/AdminTrainingLogs';
import CollegeContextWrapper from './components/CollegeContextWrapper';
import NotFound from './pages/NotFound';


const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore();
    
    if (!isAuthenticated) return <Navigate to="/console/admin" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
    
    return children;
};

function App() {
    const { user } = useAuthStore();

    return (
        <Router>
            <Routes>
                {/* Root Route directs to Student Portal */}
                <Route path="/" element={<StudentEntry />} />

                {/* Student Entry Nodes */}
                <Route path="/portal" element={<StudentEntry />} />
                <Route path="/assessment" element={<StudentEntry />} />
                <Route path="/exam/:key" element={<StudentExam />} />
                <Route path="/resume" element={<ResumeExam />} />
                
                {/* Admin/Trainer Login */}
                <Route path="/console/admin" element={<Login />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <MainLayout>
                            {!user ? (
                                <div className="flex h-64 items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : user.role === 'trainer' ? <TrainerDashboard /> : <Dashboard />}
                        </MainLayout>
                    </ProtectedRoute>
                } />

                {/* Admin Only Routes */}
                <Route path="/admin/colleges" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><Colleges /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/courses" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><Courses /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/trainers" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><Trainers /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/exams" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><Exams /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/exams/create" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><CreateExam /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/exams/edit/:id" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><CreateExam /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin', 'trainer']}>
                        <MainLayout><Analytics /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/reports" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin', 'trainer']}>
                        <MainLayout><Reports /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/allotments" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><Allotments /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={<Navigate to="/analytics" replace />} />
                <Route path="/admin/audit" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><AuditLogs /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/leaderboard" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><Leaderboard /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/question-bank" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><QuestionBank /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/logs" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                        <MainLayout><AdminTrainingLogs /></MainLayout>
                    </ProtectedRoute>
                } />

                {/* College-specific Unique Routes */}
                <Route path="/college/:collegeId" element={<CollegeContextWrapper />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={
                        <ProtectedRoute>
                            <MainLayout><Dashboard /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/courses" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><Courses /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/batches" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><Batches /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/trainers" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><Trainers /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/exams" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><Exams /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/exams/create" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><CreateExam /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/exams/edit/:id" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><CreateExam /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="analytics" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin', 'trainer']}>
                            <MainLayout><Analytics /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="reports" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin', 'trainer']}>
                            <MainLayout><Reports /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/allotments" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><Allotments /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/audit" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><AuditLogs /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/leaderboard" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><Leaderboard /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/question-bank" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><QuestionBank /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/logs" element={
                        <ProtectedRoute allowedRoles={['super_admin', 'college_admin']}>
                            <MainLayout><AdminTrainingLogs /></MainLayout>
                        </ProtectedRoute>
                    } />
                </Route>

                {/* Trainer Only Routes */}
                <Route path="/trainer/exams" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><TrainerExams /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/trainer/exams/create" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><CreateExam /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/trainer/exams/edit/:id" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><CreateExam /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/trainer/logs" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><TrainingLogs /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/trainer/courses" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><Courses /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/trainer/batches" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><Batches /></MainLayout>
                    </ProtectedRoute>
                } />

                <Route path="/trainer/monitor/:key" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><WaitingRoom /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/trainer/room/:key" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><WaitingRoom /></MainLayout>
                    </ProtectedRoute>
                } />
                
                {/* Sarcastic 404 Fallback Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
