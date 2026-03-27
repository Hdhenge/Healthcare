import React from 'react';
import { Package, TrendingUp, AlertTriangle, IndianRupee, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const salesData = [
  { day: 'Mon', sales: 4200, orders: 38 },
  { day: 'Tue', sales: 5800, orders: 52 },
  { day: 'Wed', sales: 3900, orders: 35 },
  { day: 'Thu', sales: 7200, orders: 64 },
  { day: 'Fri', sales: 8100, orders: 71 },
  { day: 'Sat', sales: 9600, orders: 88 },
  { day: 'Sun', sales: 6400, orders: 57 },
];

const topMeds = [
  { name: 'Paracetamol 500mg', sold: 312, revenue: 3744 },
  { name: 'Vitamin C 1000mg', sold: 245, revenue: 4900 },
  { name: 'Metformin 500mg', sold: 198, revenue: 4950 },
  { name: 'Omeprazole 20mg', sold: 176, revenue: 5280 },
  { name: 'Cetirizine 10mg', sold: 154, revenue: 1540 },
];

const expiryAlerts = [
  { name: 'Amoxicillin 500mg', expiry: '2024-02-01', qty: 24, days: 5 },
  { name: 'Insulin Glargine', expiry: '2024-02-08', qty: 6, days: 12 },
];

export default function VendorDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white">Welcome, {currentUser?.displayName?.split(' ')[0]} 🏪</h1>
        <p className="text-gray-400 mt-1">Here's your pharmacy overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: '₹9,600', icon: IndianRupee, change: '+12%', up: true, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Orders Today', value: '88', icon: Package, change: '+8%', up: true, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Total Stock', value: '1,248', icon: BarChart3, change: '-2%', up: false, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Expiry Alerts', value: '2', icon: AlertTriangle, change: 'Urgent', up: false, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(({ label, value, icon: Icon, change, up, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-gray-400 text-sm mt-0.5">{label}</div>
            <div className={`flex items-center gap-1 text-xs mt-1 ${up ? 'text-emerald-400' : 'text-orange-400'}`}>
              {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {change} vs last week
            </div>
          </div>
        ))}
      </div>

      {/* Expiry Alert Banner */}
      {expiryAlerts.length > 0 && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-bold">Expiry Alerts — Act Now!</span>
          </div>
          <div className="flex gap-4 flex-wrap">
            {expiryAlerts.map(a => (
              <div key={a.name} className="text-sm text-gray-300">
                <span className="text-orange-300 font-medium">{a.name}</span> — {a.qty} units expire in <span className="font-bold text-orange-400">{a.days} days</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/vendor/expiry')} className="mt-3 text-sm text-orange-400 hover:text-orange-300 underline">View all expiry alerts →</button>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Sales */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Weekly Sales (₹)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f9fafb' }}
                formatter={(v) => [`₹${v}`, 'Sales']}
              />
              <Bar dataKey="sales" fill="url(#blueGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Top Selling Medicines</h2>
          <div className="space-y-3">
            {topMeds.map((med, i) => {
              const max = topMeds[0].sold;
              const pct = (med.sold / max) * 100;
              return (
                <div key={med.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-300 truncate flex-1 mr-2">
                      <span className="text-gray-500 mr-2">#{i + 1}</span>{med.name}
                    </span>
                    <span className="text-blue-400 font-bold">{med.sold} sold</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
