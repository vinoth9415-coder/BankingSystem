import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FiHome, FiGrid, FiUserPlus, FiArrowDownCircle, FiArrowUpCircle,
  FiRepeat, FiSearch, FiList, FiClock, FiLogOut,
  FiX, FiSun, FiMoon, FiChevronRight, FiShield, FiCheckCircle
} from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', label: 'Dashboard Overview', icon: <FiGrid />, roles: ['admin', 'user'] },
  { path: '/all-accounts', label: 'All Bank Accounts', icon: <FiList />, roles: ['admin'] },
  { path: '/search-account', label: 'Account Lookup', icon: <FiSearch />, roles: ['admin', 'user'] },
  { path: '/create-account', label: 'Open New Account', icon: <FiUserPlus />, roles: ['admin', 'user'] },
  { path: '/deposit', label: 'Deposit Money', icon: <FiArrowDownCircle />, roles: ['admin', 'user'] },
  { path: '/withdraw', label: 'Withdraw Cash', icon: <FiArrowUpCircle />, roles: ['admin', 'user'] },
  { path: '/transfer', label: 'Fund Transfer', icon: <FiRepeat />, roles: ['admin', 'user'] },
  { path: '/transactions', label: 'Transaction Ledger', icon: <FiClock />, roles: ['admin', 'user'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userRole = user?.role || 'admin';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 z-40
        bg-slate-900 border-r border-slate-800
        shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header Branding */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-lg tracking-wider">SB</span>
            </div>
            <div>
              <h1 className="text-white font-extrabold text-lg tracking-tight">SecureBank</h1>
              <p className="text-blue-400 text-xs font-medium">Enterprise Banking</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 bg-slate-800/60 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md uppercase">
              {user?.username?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-bold truncate">{user?.fullName || 'Administrator'}</p>
              <div className="flex items-center gap-1.5 text-xs text-blue-400 mt-0.5">
                <FiShield size={12} />
                <span className="capitalize font-semibold">{userRole} Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-3 px-3">
            Banking Portal
          </div>
          {navItems
            .filter(item => item.roles.includes(userRole))
            .map(({ path, label, icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <span className={`text-xl flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-blue-400'}`}>
                    {icon}
                  </span>
                  <span className="text-sm flex-1">{label}</span>
                  {isActive && <FiChevronRight className="text-white text-sm" />}
                </Link>
              );
            })}
        </nav>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800/40 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Demo Mode</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <FiCheckCircle size={10} /> Active
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              {isDark ? <FiSun className="text-amber-400" /> : <FiMoon className="text-indigo-400" />}
              <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-sm font-semibold"
          >
            <FiLogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
