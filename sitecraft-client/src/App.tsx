import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { TemplateDetailsPage } from './pages/templates/TemplateDetailsPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { ProjectDetailsPage } from './pages/projects/ProjectDetailsPage';

// Temporary Landing Page
const LandingPage = () => (
  <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8 relative overflow-hidden">
    {/* Effects */}
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#F6C453]/10 rounded-full blur-[150px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#F6C453]/5 rounded-full blur-[150px]" />

    <div className="max-w-4xl w-full relative z-10">
      <div className="text-center mb-16">
        <div className="inline-block p-4 rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 mb-8 shadow-2xl skew-y-3">
          <div className="h-20 w-20 bg-gradient-to-br from-[#F6C453] to-[#CBA34E] rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(246,196,83,0.3)]">
            <span className="text-black text-5xl font-black italic">S</span>
          </div>
        </div>
        <h1 className="text-8xl font-black text-white mb-4 tracking-tighter italic">Site<span className="text-[#F6C453]">Craft</span></h1>
        <p className="text-2xl text-gray-500 font-medium tracking-[0.3em] uppercase">Premium AI Builder</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-[#111111] border border-white/10 rounded-[2.5rem] text-white hover:border-[#F6C453]/50 transition-all cursor-pointer group shadow-2xl" onClick={() => window.location.href = '/login'}>
          <div className="h-12 w-12 bg-[#F6C453] rounded-2xl flex items-center justify-center mb-6 text-black group-hover:scale-110 transition-transform">
            <ExternalLink className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Access Studio</h3>
          <p className="text-gray-500 text-sm font-medium">Continue your high-end project development.</p>
        </div>

        <div className="p-8 bg-gradient-to-br from-[#F6C453] to-[#CBA34E] rounded-[2.5rem] text-black hover:shadow-[0_0_50px_rgba(246,196,83,0.2)] transition-all cursor-pointer group shadow-2xl" onClick={() => window.location.href = '/register'}>
          <div className="h-12 w-12 bg-black rounded-2xl flex items-center justify-center mb-6 text-[#F6C453] group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Begin Crafting</h3>
          <p className="text-black/70 text-sm font-bold">Join the elite network of digital creators.</p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em]">SiteCraft v2.0 • Premium Tier Edition</p>
      </div>
    </div>
  </div>
);

// Helper Icon for Landing Page
const ExternalLink = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
);

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/templates/:id" element={<TemplateDetailsPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/profile" element={<div>Profile Page (UI Coming Soon)</div>} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
          {/* Toaster needs to be high z-index */}
        </div>
        <Toaster theme="dark" richColors position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
