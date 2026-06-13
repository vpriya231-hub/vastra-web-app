import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserStore } from '../store/userStore';
import { Link } from 'react-router-dom';
import { Plus, Zap, Award, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, idToken } = useAuth();
  const { tier, remainingCredits, totalCredits, apps, getApps } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      if (idToken) {
        try {
          await getApps(idToken);
        } catch (error) {
          console.error('Failed to load apps:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadApps();
  }, [idToken, getApps]);

  const tierConfig = {
    free: { color: 'from-blue-500 to-cyan-500', icon: '🎯', maxApps: 2 },
    plus: { color: 'from-purple-500 to-pink-500', icon: '⭐', maxApps: 5 },
    pro: { color: 'from-orange-500 to-red-500', icon: '🔥', maxApps: 15 },
    ultra: { color: 'from-yellow-500 to-orange-500', icon: '👑', maxApps: 20 }
  };

  const config = tierConfig[tier] || tierConfig.free;
  const creditPercentage = (remainingCredits / totalCredits) * 100;

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.displayName?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-400">Create amazing apps with AI</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {/* Tier Card */}
          <div className={`card bg-gradient-to-br ${config.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Current Plan</p>
                <h3 className="text-2xl font-bold text-white capitalize">{tier}</h3>
              </div>
              <span className="text-4xl">{config.icon}</span>
            </div>
          </div>

          {/* Credits Card */}
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Credits Remaining</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold text-indigo-400">{remainingCredits}</h3>
              <p className="text-slate-500 text-sm mb-1">/ {totalCredits}</p>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${creditPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Apps Card */}
          <div className="card">
            <p className="text-slate-400 text-sm mb-2">Apps Created</p>
            <h3 className="text-3xl font-bold text-purple-400">{apps.length}</h3>
            <p className="text-slate-500 text-sm mt-2">Max: {config.maxApps}</p>
          </div>

          {/* Upgrade Card */}
          {tier === 'free' && (
            <Link to="/subscription" className="card hover:border-indigo-500 cursor-pointer">
              <p className="text-slate-400 text-sm mb-2">Upgrade Plan</p>
              <h3 className="text-lg font-bold text-indigo-400 mb-3">Get More Credits</h3>
              <button className="btn-primary text-sm py-2 px-3 w-full">
                Upgrade Now
              </button>
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/generate" className="card hover:border-indigo-500 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition">
                  <Plus size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Generate App</h3>
                  <p className="text-sm text-slate-400">Create new app</p>
                </div>
              </div>
            </Link>

            <Link to="/subscription" className="card hover:border-purple-500 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition">
                  <Zap size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Upgrade Plan</h3>
                  <p className="text-sm text-slate-400">Get more credits</p>
                </div>
              </div>
            </Link>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <Award size={24} className="text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Your Tier</h3>
                  <p className="text-sm text-slate-400 capitalize">{tier} member</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Apps */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Apps</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 mt-4">Loading apps...</p>
            </div>
          ) : apps.length === 0 ? (
            <div className="card text-center py-12">
              <TrendingUp size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No apps yet</h3>
              <p className="text-slate-400 mb-6">Create your first app to get started</p>
              <Link to="/generate" className="btn-primary inline-block">
                Create First App
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map((app) => (
                <div key={app.appId} className="card group cursor-pointer hover:border-indigo-500">
                  <h3 className="font-semibold text-white mb-2 truncate">{app.appName}</h3>
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">{app.prompt}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      {new Date(app.createdAt.seconds * 1000).toLocaleDateString()}
                    </span>
                    {app.published && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Published
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
