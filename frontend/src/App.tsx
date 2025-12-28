import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

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
          
              {/* Dashboard routes */}
              <Route path="/account" element={<Dashboard />} />
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/schedule" element={<Schedule />} />
              <Route path="/account/education" element={<EducationPage />} />
              <Route path="/account/students" element={<StudentsPage />} />
              <Route path="/account/settings" element={<SettingsPage />} />
              <Route path="/account/courses" element={<MyCourses />} />
              <Route path="/account/courses/:courseId" element={<CurrentCourse />} />
              <Route path="/account/progress" element={<CurrentCourse />} />
              <Route path="/account/projects" element={<MyProjects />} />
              <Route path="/account/community" element={<Community />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
