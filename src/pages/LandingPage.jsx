import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Bell, Camera, Calculator, Package, BarChart3,
  ShieldCheck, Zap, Users, TrendingUp, ArrowRight, Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: MapPin,
    title: 'Nearby Store Locator',
    desc: 'Find medical stores near you with real-time medicine availability.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Camera,
    title: 'Prescription Scanner',
    desc: 'Upload prescription photos — AI reads medicines and calculates costs automatically.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Calculator,
    title: 'Budget Calculator',
    desc: 'Know exactly how many days of medicine you can afford within your budget.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Bell,
    title: 'Medicine Reminders',
    desc: 'Smart push alerts before you run out — based on dosage and quantity.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Package,
    title: 'Vendor Inventory',
    desc: 'Pharmacy owners manage stock, expiry alerts, and sales analytics.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Area-wise Analytics',
    desc: 'Admins track demand by pin code, disease outbreaks, and top stores.',
    color: 'from-teal-500 to-green-500',
  },
];

const stats = [
  { label: 'Medical Stores', value: '2,400+', icon: Package },
  { label: 'Active Users', value: '18,000+', icon: Users },
  { label: 'Medicines Listed', value: '50,000+', icon: Activity },
  { label: 'Daily Orders', value: '3,200+', icon: TrendingUp },
];

const roles = [
  {
    role: 'customer',
    title: 'Patient / Customer',
    desc: 'Find medicines, scan prescriptions, set reminders, manage your budget.',
    gradient: 'from-emerald-600 to-teal-600',
    glow: 'shadow-emerald-500/30',
    icon: Users,
  },
  {
    role: 'vendor',
    title: 'Pharmacy Owner',
    desc: 'Manage inventory, track sales analytics, and get expiry alerts.',
    gradient: 'from-blue-600 to-cyan-600',
    glow: 'shadow-blue-500/30',
    icon: Package,
  },
  {
    role: 'admin',
    title: 'Platform Admin',
    desc: 'Master control panel — area analytics, trends, and full user management.',
    gradient: 'from-violet-600 to-purple-600',
    glow: 'shadow-violet-500/30',
    icon: ShieldCheck,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const handleDashboard = () => {
    if (userProfile?.role) {
      navigate(`/${userProfile.role}`);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-card rounded-none border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MedConnect</span>
          </div>
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button onClick={handleDashboard} className="btn-primary py-2 px-6 text-sm flex items-center gap-2">
                Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/auth')} className="btn-secondary py-2 text-sm px-5">
                  Sign In
                </button>
                <button onClick={() => navigate('/auth?mode=register')} className="btn-primary py-2 text-sm px-5">
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 text-sm text-emerald-400 mb-8">
            <Zap className="w-4 h-4" />
            Smart Pharmacy Platform — India's First Tri-Panel Solution
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Medicine at Your
            <span className="gradient-text block">Fingertips</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect patients, pharmacies, and administrators on one intelligent platform.
            Find medicines, scan prescriptions, and manage your health budget — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth?mode=register')}
              className="btn-primary flex items-center justify-center gap-2 text-lg py-4 px-8"
            >
              Start For Free <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="btn-secondary flex items-center justify-center gap-2 text-lg py-4 px-8"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <Icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-black gradient-text mb-1">{value}</div>
              <div className="text-gray-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A complete ecosystem for patients, pharmacies, and platform administrators.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div 
                key={title} 
                onClick={() => navigate('/auth?mode=register')}
                className="glass-card-hover p-6 cursor-pointer group hover:scale-[1.02] transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400/50 group-hover:text-emerald-400 transition-colors">
                  Try Feature <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Three Powerful Panels</h2>
            <p className="text-gray-400 text-lg">One platform, three specialized experiences.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map(({ role, title, desc, gradient, glow, icon: Icon }) => (
              <div
                key={role}
                onClick={() => navigate(`/auth?mode=register&role=${role}`)}
                className={`glass-card p-8 cursor-pointer hover:scale-[1.03] transition-all duration-300 shadow-xl ${glow} border border-white/5 hover:border-white/20`}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{desc}</p>
                <div className={`flex items-center gap-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-semibold text-sm`}>
                  Get Started <ArrowRight className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center glass-card p-16">
          <h2 className="text-4xl font-black mb-4">Ready to Transform Healthcare?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join thousands of patients and pharmacies already on MedConnect.</p>
          <button
            onClick={() => navigate('/auth?mode=register')}
            className="btn-primary text-lg py-4 px-10 flex items-center gap-2 mx-auto"
          >
            Join MedConnect <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-gray-500 text-sm">
        © 2024 MedConnect Platform. Built with ❤️ for better healthcare accessibility.
      </footer>
    </div>
  );
}
