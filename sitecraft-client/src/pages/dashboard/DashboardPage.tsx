import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  User as UserIcon, 
  Settings, 
  Plus, 
  Database, 
  Building,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-400 flex font-sans selection:bg-[#F6C453] selection:text-black scrollbar-hide">
      {/* Premium Sidebar - Refined Width & Elevation */}
      <aside className="w-80 bg-[#0D0D0D] border-r border-white/5 flex flex-col relative z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-10">
          <div className="flex items-center gap-4 mb-2 group cursor-pointer" onClick={() => navigate('/')}>
             <div className="h-12 w-12 bg-gradient-to-br from-[#F6C453] to-[#CBA34E] rounded-[1.25rem] flex items-center justify-center shadow-[0_0_30px_rgba(246,196,83,0.2)] group-hover:scale-105 transition-all duration-500">
                <span className="text-black font-black italic text-2xl">S</span>
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tighter text-white italic leading-none">Site<span className="text-[#F6C453]">Craft</span></h1>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 mt-1.5">v2.0 Elite Edition</p>
             </div>
          </div>
        </div>

        <div className="px-8 mb-6">
           <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Studio Overview" active />
          <NavItem icon={<Plus size={18} />} label="Initialize Project" />
          <NavItem icon={<Database size={18} />} label="Asset Vault" />
          <NavItem icon={<UserIcon size={18} />} label="Elite Collaboration" />
          <div className="py-6 px-8 text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">Management</div>
          <NavItem icon={<Settings size={18} />} label="System Config" />
        </nav>

        <div className="p-8">
          <div className="bg-[#141414] rounded-[2.5rem] p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F6C453]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="bg-gradient-to-br from-[#F6C453] to-[#CBA34E] h-12 w-12 rounded-2xl flex items-center justify-center font-black text-black border border-white/20 shadow-xl">
                {user?.firstName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[13px] font-black text-white truncate tracking-tight">{user?.firstName} {user?.lastName}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-[#F6C453]/70 mt-0.5">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="relative z-10 flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 h-14 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 hover:border-red-500/20"
            >
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Premium Canvas - Expanded Gutters */}
      <main className="flex-1 overflow-auto p-16 lg:p-24 relative bg-[radial-gradient(circle_at_top_right,#141414_0%,#0A0A0A_100%)]">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#F6C453]/5 rounded-full blur-[180px] pointer-events-none" />

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 relative z-10 gap-8">
          <div className="animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#F6C453]/10 rounded-full border border-[#F6C453]/20 mb-6">
               <span className="h-1.5 w-1.5 rounded-full bg-[#F6C453] shadow-[0_0_8px_#F6C453] animate-pulse" />
               <span className="text-[9px] font-black text-[#F6C453] uppercase tracking-[0.3em]">Protocol Active</span>
            </div>
            <h2 className="text-7xl font-black text-white italic tracking-tighter leading-[0.9] mb-4">CRAFTING <span className="text-[#F6C453]">SUITE</span></h2>
            <p className="text-gray-500 font-medium tracking-wide text-xl max-w-xl">Welcome to your digital sanctuary, {user?.firstName}. Superior design awaits your command.</p>
          </div>
          
          <div className="flex gap-4 animate-in fade-in slide-in-from-right duration-1000">
            <div className="bg-[#111111]/80 backdrop-blur-2xl px-8 py-5 rounded-[2rem] border border-white/5 flex items-center gap-5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] group hover:border-[#F6C453]/20 transition-colors">
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#F6C453]/10 transition-colors">
                <Building className="h-4 w-4 text-[#F6C453]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-0.5">Primary Domain</p>
                <p className="text-xs font-black text-white uppercase tracking-[0.2em]">{user?.tenantId}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Premium Stats Grid - Balanced Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20 relative z-10">
          <StatCard label="Live Architectures" value="04" sub="Latest Sync: 12min ago" trend="+3.2%" />
          <StatCard label="Vault Capacity" value="64%" sub="6.4GB of 10GB utilized" trend="Optimized" />
          <StatCard label="Network Reach" value="1.2k" sub="Worldwide entry points" trend="+142" />
        </div>

        {/* Refined Empty State Canvas */}
        <div className="bg-[#0D0D0D]/50 rounded-[4rem] border border-white/5 p-24 text-center relative overflow-hidden group backdrop-blur-md min-h-[500px] flex items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#F6C453_0%,transparent_100%)] opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000" />
          
          <div className="max-w-xl mx-auto relative z-10">
            <div className="relative inline-block mb-12">
               <div className="absolute inset-0 bg-[#F6C453]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 opacity-50" />
               <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] h-40 w-40 rounded-[3.5rem] flex items-center justify-center mx-auto border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] rotate-12 group-hover:rotate-0 transition-all duration-700 relative z-10">
                 <Plus className="h-16 w-16 text-[#F6C453] group-hover:scale-110 transition-transform" />
               </div>
            </div>
            <h3 className="text-4xl font-black text-white mb-6 tracking-tight uppercase italic italic">START NEW <span className="text-[#F6C453]">CRAFT</span></h3>
            <p className="text-gray-500 mb-14 font-medium text-xl leading-relaxed">Your creative portfolio is waiting for its centerpiece. Initiate the AI architect to begin your legacy.</p>
            <button className="group relative bg-gradient-to-r from-[#F6C453] via-[#FFDFA0] to-[#CBA34E] text-black px-16 py-6 rounded-[2rem] font-black tracking-[0.3em] text-[12px] uppercase shadow-[0_30px_60px_rgba(246,196,83,0.25)] hover:shadow-[0_40px_80px_rgba(246,196,83,0.35)] transition-all transform hover:-translate-y-2 active:scale-95 overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-25deg]" />
              <span className="relative z-10">Initialize Architect</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <a href="#" className={`flex items-center gap-6 px-10 py-5 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${
    active ? 'text-[#F6C453]' : 'text-gray-600 hover:text-white'
  }`}>
    {active && (
      <div className="absolute inset-0 bg-gradient-to-r from-[#F6C453]/10 to-transparent border-l-[3px] border-[#F6C453]" />
    )}
    <span className={`${active ? 'text-[#F6C453]' : 'group-hover:text-[#F6C453] group-hover:scale-110'} transition-all duration-300 relative z-10`}>{icon}</span>
    <span className="text-[10px] font-black tracking-[0.2em] uppercase relative z-10">{label}</span>
  </a>
);

const StatCard = ({ label, value, sub, trend }: { label: string, value: string, sub: string, trend?: string }) => (
  <div className="bg-[#111111]/90 p-12 rounded-[3.5rem] border border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.4)] hover:border-[#F6C453]/30 transition-all duration-700 transform hover:-translate-y-3 group relative overflow-hidden backdrop-blur-2xl">
    <div className="absolute top-0 right-0 p-8">
       <div className={`text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 ${trend?.startsWith('+') ? 'text-green-500' : 'text-[#F6C453]'}`}>{trend}</div>
    </div>
    <p className="text-[10px] font-black text-[#F6C453] uppercase tracking-[0.4em] mb-8 opacity-70">{label}</p>
    <div className="flex items-baseline gap-4 mb-6">
      <p className="text-7xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform duration-700">{value}</p>
    </div>
    <div className="h-[1px] w-12 bg-[#F6C453]/30 mb-6 group-hover:w-full transition-all duration-1000" />
    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] truncate">{sub}</p>
  </div>
);
