import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CourseDetail from "./pages/CourseDetail";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import MyCourses from "./pages/dashboard/MyCourses";
import CurrentCourse from "./pages/dashboard/CurrentCourse";
import Schedule from "./pages/dashboard/Schedule";
import MyProjects from "./pages/dashboard/MyProjects";
import Community from "./pages/dashboard/Community";
import Profile from "./pages/dashboard/Profile";
import EducationPage from './Pages/EducationPage/EducationPage';
import StudentsPage from './Pages/StudentsPage/StudentsPage';
import SettingsPage from './Pages/SettingsPage/SettingsPage';
import VideoLesson from "./pages/dashboard/VideoLesson";
import AssignmentView from "./pages/dashboard/AssignmentView";
import AssignmentSubmit from "./pages/dashboard/AssignmentSubmit";
import AssignmentFeedback from "./pages/dashboard/AssignmentFeedback";
import Achievements from "./pages/dashboard/Achievements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/course/:courseSlug" element={<CourseDetail />} />
          
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/schedule" element={<Schedule />} />
              <Route path="/dashboard/education" element={<EducationPage />} />
              <Route path="/dashboard/students" element={<StudentsPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              <Route path="/dashboard/courses" element={<MyCourses />} />
              <Route path="/dashboard/courses/:courseId" element={<CurrentCourse />} />
              <Route path="/dashboard/courses/:courseId/lesson/:lessonId" element={<VideoLesson />} />
              <Route path="/dashboard/courses/:courseId/assignment/:assignmentId" element={<AssignmentView />} />
              <Route path="/dashboard/courses/:courseId/assignment/:assignmentId/submit" element={<AssignmentSubmit />} />
              <Route path="/dashboard/courses/:courseId/assignment/:assignmentId/feedback" element={<AssignmentFeedback />} />
              <Route path="/dashboard/progress" element={<CurrentCourse />} />
              <Route path="/dashboard/projects" element={<MyProjects />} />
              <Route path="/dashboard/community" element={<Community />} />
              
          <Route path="/dashboard/achievements" element={<Achievements />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
