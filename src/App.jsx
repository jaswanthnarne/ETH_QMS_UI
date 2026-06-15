import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useStudentAuthStore from './store/studentAuthStore';
import StudentDashboard from './pages/student/StudentDashboard';

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
import UsersPage from './pages/admin/Users';
import CollegeContextWrapper from './components/CollegeContextWrapper';
import CollegeDetail from './pages/admin/CollegeDetail';
import BatchDetail from './pages/admin/BatchDetail';
import NotFound from './pages/NotFound';

// Attendance Pages
import TrainerAttendance from './pages/trainer/TrainerAttendance';
import MarkAttendance from './pages/trainer/MarkAttendance';
import AttendanceHistory from './pages/trainer/AttendanceHistory';
import AdminAttendance from './pages/admin/AdminAttendance';



const ALL_ADMINS = ['super_admin', 'ops_admin', 'ast_ops_admin', 'regional_manager', 'asst_rm', 'college_admin'];

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore();
    
    if (!isAuthenticated) return <Navigate to="/console/admin" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
    
    return children;
};

const StudentProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useStudentAuthStore();
    if (!isAuthenticated) return <Navigate to="/portal" replace />;
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
                <Route path="/exam/:key" element={
                    <StudentProtectedRoute>
                        <StudentExam />
                    </StudentProtectedRoute>
                } />
                <Route path="/resume" element={
                    <StudentProtectedRoute>
                        <ResumeExam />
                    </StudentProtectedRoute>
                } />
                
                {/* Student Dashboard */}
                <Route path="/student/dashboard" element={
                    <StudentProtectedRoute>
                        <MainLayout>
                            <StudentDashboard />
                        </MainLayout>
                    </StudentProtectedRoute>
                } />
                
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
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><Colleges /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/colleges/:collegeId" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><CollegeDetail /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/batches/:batchId" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><BatchDetail /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/courses" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><Courses /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/trainers" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><Trainers /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/exams" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><Exams /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/exams/create" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><CreateExam /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/exams/edit/:id" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><CreateExam /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute allowedRoles={[...ALL_ADMINS, 'trainer']}>
                        <MainLayout><Analytics /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/reports" element={
                    <ProtectedRoute allowedRoles={[...ALL_ADMINS, 'trainer']}>
                        <MainLayout><Reports /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/allotments" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><Allotments /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/analytics" element={<Navigate to="/analytics" replace />} />
                <Route path="/admin/audit" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><AuditLogs /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/leaderboard" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><Leaderboard /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/question-bank" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><QuestionBank /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/logs" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><AdminTrainingLogs /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/attendance" element={
                    <ProtectedRoute allowedRoles={ALL_ADMINS}>
                        <MainLayout><AdminAttendance /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'ops_admin']}>
                        <MainLayout><UsersPage /></MainLayout>
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
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><Courses /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/batches" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><Batches /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/batches/:batchId" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><BatchDetail /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/trainers" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><Trainers /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/exams" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><Exams /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/exams/create" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><CreateExam /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/exams/edit/:id" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><CreateExam /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="analytics" element={
                        <ProtectedRoute allowedRoles={[...ALL_ADMINS, 'trainer']}>
                            <MainLayout><Analytics /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="reports" element={
                        <ProtectedRoute allowedRoles={[...ALL_ADMINS, 'trainer']}>
                            <MainLayout><Reports /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/allotments" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><Allotments /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/audit" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><AuditLogs /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/leaderboard" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><Leaderboard /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/question-bank" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><QuestionBank /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/logs" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><AdminTrainingLogs /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="admin/attendance" element={
                        <ProtectedRoute allowedRoles={ALL_ADMINS}>
                            <MainLayout><AdminAttendance /></MainLayout>
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
                <Route path="/trainer/batches/:batchId" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><BatchDetail /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/trainer/attendance" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><TrainerAttendance /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/trainer/attendance/mark/:batchId" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><MarkAttendance /></MainLayout>
                    </ProtectedRoute>
                } />
                <Route path="/trainer/attendance/history/:batchId" element={
                    <ProtectedRoute allowedRoles={['trainer']}>
                        <MainLayout><AttendanceHistory /></MainLayout>
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
