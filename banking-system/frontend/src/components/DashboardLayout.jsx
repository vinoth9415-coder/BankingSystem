import { useState } from 'react';
import { FiMenu, FiBell, FiPlus, FiArrowDownCircle, FiArrowUpCircle, FiRepeat } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
        {/* Header Bar */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between flex-shrink-0 z-10 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <FiMenu size={22} />
            </button>
            <div>
              <p className="text-xs text-slate-400 font-medium">Welcome back,</p>
              <h2 className="text-sm font-bold text-white tracking-tight">{user?.fullName || 'User'}</h2>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex items-center gap-3">
            {/* Quick Action Shortcuts */}
            <div className="hidden md:flex items-center gap-2 pr-4 border-r border-slate-800">
              <Link
                to="/deposit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl text-xs font-semibold transition-all"
              >
                <FiArrowDownCircle size={14} /> Deposit
              </Link>
              <Link
                to="/withdraw"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl text-xs font-semibold transition-all"
              >
                <FiArrowUpCircle size={14} /> Withdraw
              </Link>
              <Link
                to="/transfer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl text-xs font-semibold transition-all"
              >
                <FiRepeat size={14} /> Transfer
              </Link>
            </div>

            <button className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800">
              <FiBell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30 uppercase border border-blue-400/20">
                {user?.username?.[0] || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
