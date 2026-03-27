import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Activity, Eye, EyeOff, User, Mail, Lock, Shield, Package, Users } from 'lucide-react';

const roles = [
  { id: 'customer', label: 'Patient / Customer', icon: Users, color: 'emerald' },
  { id: 'vendor', label: 'Pharmacy Owner', icon: Package, color: 'blue' },
  { id: 'admin', label: 'Platform Admin', icon: Shield, color: 'violet' },
];

const roleRedirects = { customer: '/customer', vendor: '/vendor', admin: '/admin' };

export default function AuthPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, currentUser, userProfile } = useAuth();

  const [isRegister, setIsRegister] = useState(params.get('mode') === 'register');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(params.get('role') || 'customer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (currentUser && userProfile) {
      navigate(roleRedirects[userProfile.role] || '/');
    }
  }, [currentUser, userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.email, form.password, form.name, selectedRole);
        toast.success('Account created! Welcome to MedConnect 🎉');
      } else {
        const cred = await login(form.email, form.password);
        toast.success(`Welcome back, ${cred.user.displayName || 'User'}!`);
      }
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', '').replace(/\(.*\)/, ''));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">MedConnect</h1>
          <p className="text-gray-400 text-sm mt-1">Smart Pharmacy Platform</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-1">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {isRegister ? 'Join MedConnect today' : 'Sign in to your account'}
          </p>

          {/* Role selector (register only) */}
          {isRegister && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedRole(id)}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      selectedRole === id
                        ? `bg-${color}-500/20 border-${color}-500/50 text-${color}-400`
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  className="input-field pl-11"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="input-field pl-11"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
                className="input-field pl-11 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(v => !v)}
              className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          By continuing, you agree to MedConnect's Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
