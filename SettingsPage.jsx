import { useAuth } from '../hooks/useAuth';
import { User, Lock, Bell, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="w-16 h-16 rounded-full border-2 border-indigo-500"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.displayName}</h2>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button className="btn-secondary">Edit Profile</button>
        </div>

        {/* Account Settings */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <User size={20} />
            Account Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-slate-300">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-slate-300">Marketing Emails</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock size={20} />
            Security
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition">
              <p className="text-slate-300 font-medium">Change Password</p>
              <p className="text-sm text-slate-500">Update your password regularly</p>
            </button>
            <button className="w-full text-left p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition">
              <p className="text-slate-300 font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500">Add an extra layer of security</p>
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle size={20} />
            Support & Help
          </h2>
          <div className="space-y-3">
            <a
              href="https://sites.google.com/view/v-astra-create-privacy-policy/home"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition"
            >
              <p className="text-slate-300 font-medium">Privacy Policy</p>
              <p className="text-sm text-slate-500">Learn how we protect your data</p>
            </a>
            <a
              href="https://sites.google.com/view/v-astra-create-terms/home"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition"
            >
              <p className="text-slate-300 font-medium">Terms & Conditions</p>
              <p className="text-sm text-slate-500">Read our terms of service</p>
            </a>
            <a
              href="mailto:supportvastra@gmail.com"
              className="block p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition"
            >
              <p className="text-slate-300 font-medium">Contact Support</p>
              <p className="text-sm text-slate-500">supportvastra@gmail.com</p>
            </a>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-500/30 bg-red-500/5">
          <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <button className="w-full px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition font-semibold">
            Delete Account
          </button>
          <p className="text-xs text-slate-500 mt-2">This action cannot be undone. All your data will be permanently deleted.</p>
        </div>
      </div>
    </div>
  );
}
