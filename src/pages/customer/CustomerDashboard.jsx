import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Camera, Bell, Calculator, ArrowRight, Pill, Clock, Heart } from 'lucide-react';

const quickActions = [
  { icon: MapPin, label: 'Find Store', sub: 'Nearby pharmacies', to: '/customer/stores', color: 'from-emerald-500 to-teal-500' },
  { icon: Search, label: 'Search Medicine', sub: 'Check availability', to: '/customer/search', color: 'from-blue-500 to-cyan-500' },
  { icon: Camera, label: 'Scan Rx', sub: 'Upload prescription', to: '/customer/prescription', color: 'from-violet-500 to-purple-500' },
  { icon: Bell, label: 'Reminders', sub: 'Medicine alerts', to: '/customer/reminders', color: 'from-orange-500 to-amber-500' },
  { icon: Calculator, label: 'Budget Calc', sub: 'Plan purchases', to: '/customer/budget', color: 'from-pink-500 to-rose-500' },
];

const recentMedicines = [
  { name: 'Paracetamol 500mg', stores: 12, status: 'In Stock', icon: '💊' },
  { name: 'Azithromycin 250mg', stores: 5, status: 'Low Stock', icon: '💉' },
  { name: 'Metformin 500mg', stores: 8, status: 'In Stock', icon: '🔵' },
  { name: 'Atorvastatin 10mg', stores: 3, status: 'Low Stock', icon: '🟡' },
];

const upcomingReminders = [
  { medicine: 'Blood Pressure Tab', time: 'Today 8:00 PM', daysLeft: 3, color: 'text-orange-400' },
  { medicine: 'Vitamin D3', time: 'Tomorrow', daysLeft: 7, color: 'text-yellow-400' },
  { medicine: 'Metformin', time: 'In 2 days', daysLeft: 12, color: 'text-green-400' },
];

export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">{greeting}, {currentUser?.displayName?.split(' ')[0] || 'User'} 👋</h1>
          <p className="text-gray-400 mt-1">Here's your health overview for today.</p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-emerald-400">
          <MapPin className="w-4 h-4" />
          Mumbai, MH
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Reminders', value: '3', icon: Bell, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Stores Nearby', value: '18', icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Prescriptions', value: '2', icon: Camera, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Last Order', value: '₹320', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-gray-400 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="section-title">Quick Actions</h2>
        <p className="section-subtitle">What do you need today?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map(({ icon: Icon, label, sub, to, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="glass-card-hover p-5 text-center group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-white font-semibold text-sm">{label}</div>
              <div className="text-gray-500 text-xs mt-0.5">{sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Medicines */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recently Searched</h2>
            <button onClick={() => navigate('/customer/search')} className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentMedicines.map((med) => (
              <div key={med.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                <span className="text-2xl">{med.icon}</span>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{med.name}</div>
                  <div className="text-gray-500 text-xs">{med.stores} stores nearby</div>
                </div>
                <span className={`badge ${med.status === 'In Stock' ? 'badge-green' : 'badge-yellow'}`}>
                  {med.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Upcoming Reminders</h2>
            <button onClick={() => navigate('/customer/reminders')} className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1">
              Manage <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingReminders.map((r) => (
              <div key={r.medicine} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5`}>
                  <Clock className={`w-5 h-5 ${r.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{r.medicine}</div>
                  <div className="text-gray-500 text-xs">{r.time}</div>
                </div>
                <div className={`text-xs font-bold ${r.color}`}>{r.daysLeft}d left</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-orange-400 text-sm font-medium">
              <Bell className="w-4 h-4" />
              Blood Pressure Tab is running low — refill in 3 days!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
