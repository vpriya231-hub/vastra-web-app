import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useUserStore } from '../store/userStore';

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { tier, remainingCredits } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VA</span>
            </div>
            <span className="text-xl font-bold text-gradient">V Astra Create</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</Link>
            <Link to="/generate" className="text-slate-300 hover:text-white transition">Generate</Link>
            <Link to="/subscription" className="text-slate-300 hover:text-white transition">Plans</Link>
            
            {/* Credits Badge */}
            <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-lg px-3 py-1 text-sm">
              <span className="text-indigo-300">{remainingCredits} Credits</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Link to="/settings" className="text-slate-300 hover:text-white transition">
                <Settings size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-white transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/generate"
              className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Generate
            </Link>
            <Link
              to="/subscription"
              className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Plans
            </Link>
            <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/50 rounded">
              <span className="text-indigo-300 text-sm">{remainingCredits} Credits</span>
            </div>
            <Link
              to="/settings"
              className="block px-4 py-2 text-slate-300 hover:bg-slate-800 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
