
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import TutorList from "./pages/TutorList";
import TutorProfile from "./pages/TutorProfile";
import Messages from "./pages/Messages";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/tutor-dashboard" element={<TutorDashboard />} />
                <Route path="/tutors" element={<TutorList />} />
                <Route path="/tutors/:id" element={<TutorProfile />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/messages/:id" element={<Messages />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
