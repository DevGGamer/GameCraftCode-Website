import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CourseDetail from "./pages/CourseDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import MyCourses from "./pages/dashboard/MyCourses";
import CurrentCourse from "./pages/dashboard/CurrentCourse";
import Schedule from "./pages/dashboard/Schedule";
import MyProjects from "./pages/dashboard/MyProjects";
import Community from "./pages/dashboard/Community";
import Profile from "./pages/dashboard/Profile";
import EducationPage from './pages/EducationPage/EducationPage';
import StudentsPage from './pages/StudentsPage/StudentsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import VideoLesson from "./pages/dashboard/VideoLesson";
import AssignmentView from "./pages/dashboard/AssignmentView";
import AssignmentSubmit from "./pages/dashboard/AssignmentSubmit";
import AssignmentFeedback from "./pages/dashboard/AssignmentFeedback";
import Achievements from "./pages/dashboard/Achievements";
import AdminPanel from "./pages/dashboard/AdminPanel";
import MethodologistPanel from "./pages/dashboard/MethodologistPanel";
import CourseBuilder from "./pages/dashboard/CourseBuilder";
import BalanceTopUp from "./pages/dashboard/BalanceTopUp";

const queryClient = new QueryClient();

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/course/:courseSlug" element={<CourseDetail />} />

          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/dashboard/profile" element={<P><Profile /></P>} />
          <Route path="/dashboard/schedule" element={<P><Schedule /></P>} />
          <Route path="/dashboard/education" element={<P><EducationPage /></P>} />
          <Route path="/dashboard/students" element={<P><StudentsPage /></P>} />
          <Route path="/dashboard/settings" element={<P><SettingsPage /></P>} />
          <Route path="/dashboard/courses" element={<P><MyCourses /></P>} />
          <Route path="/dashboard/courses/:courseId" element={<P><CurrentCourse /></P>} />
          <Route path="/dashboard/courses/:courseId/lesson/:lessonId" element={<P><VideoLesson /></P>} />
          <Route path="/dashboard/courses/:courseId/assignment/:assignmentId" element={<P><AssignmentView /></P>} />
          <Route path="/dashboard/courses/:courseId/assignment/:assignmentId/submit" element={<P><AssignmentSubmit /></P>} />
          <Route path="/dashboard/courses/:courseId/assignment/:assignmentId/feedback" element={<P><AssignmentFeedback /></P>} />
          <Route path="/dashboard/progress" element={<P><CurrentCourse /></P>} />
          <Route path="/dashboard/projects" element={<P><MyProjects /></P>} />
          <Route path="/dashboard/community" element={<P><Community /></P>} />
          <Route path="/dashboard/achievements" element={<P><Achievements /></P>} />
          <Route path="/dashboard/balance" element={<P><BalanceTopUp /></P>} />

          {/* Admin-only routes */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/methodologist" element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <MethodologistPanel />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/course-builder/:courseId" element={
            <ProtectedRoute allowedRoles={["admin", "teacher"]}>
              <CourseBuilder />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
