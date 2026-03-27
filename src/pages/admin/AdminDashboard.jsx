import React from 'react';
import { Users, Store, TrendingUp, Map, ShieldCheck, ArrowUpRight, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const growth = [
  { month: 'Aug', users: 8200, vendors: 180 },
  { month: 'Sep', users: 9400, vendors: 210 },
  { month: 'Oct', users: 11200, vendors: 240 },
  { month: 'Nov', users: 13800, vendors: 285 },
  { month: 'Dec', users: 16500, vendors: 340 },
  { month: 'Jan', users: 18200, vendors: 410 },
];

const topAreas = [
  { area: 'Andheri, Mumbai', orders: 4820, demand: 'High', trending: 'Dengue Meds' },
  { area: 'Koramangala, Bangalore', orders: 3960, demand: 'High', trending: 'Antibiotics' },
  { area: 'Connaught Place, Delhi', orders: 3210, demand: 'Medium', trending: 'Antacids' },
  { area: 'T Nagar, Chennai', orders: 2880, demand: 'Medium', trending: 'Vitamins' },
  { area: 'Salt Lake, Kolkata', orders: 2340, demand: 'Medium', trending: 'Cardiac' },
];

const topVendors = [
  { name: 'Apollo Pharmacy, Bandra', revenue: '₹8.2L', rating: 4.9, sales: 1240 },
  { name: 'Medplus, Andheri', revenue: '₹6.8L', rating: 4.7, sales: 980 },
  { name: 'Wellness Forever, Pune', revenue: '₹5.4L', rating: 4.6, sales: 820 },
];

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f9fafb' }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white">Master Control Panel 🛡️</h1>
        <p className="text-gray-400 mt-1">Platform-wide overview — users, vendors, and real-time analytics.</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '18,240', icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', change: '+12%' },
          { label: 'Active Vendors', value: '410', icon: Store, color: 'text-blue-400', bg: 'bg-blue-500/10', change: '+8%' },
          { label: 'Platform Revenue', value: '₹2.4Cr', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: '+22%' },
          { label: 'Medicines Listed', value: '52,400', icon: Package, color: 'text-orange-400', bg: 'bg-orange-500/10', change: '+5%' },
        ].map(({ label, value, icon: Icon, color, bg, change }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-gray-400 text-sm mt-0.5">{label}</div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-1">
              <ArrowUpRight className="w-3 h-3" /> {change} this month
            </div>
          </div>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4">Platform Growth — Users & Vendors</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={growth}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} name="Users" />
            <Line type="monotone" dataKey="vendors" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} name="Vendors" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-6 mt-3 justify-center text-sm">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-violet-500" /> Users</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500" /> Vendors</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Areas */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Map className="w-5 h-5 text-violet-400" /> Top Demand Areas
          </h2>
          <div className="space-y-3">
            {topAreas.map((area, i) => (
              <div key={area.area} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{area.area}</p>
                  <p className="text-gray-500 text-xs">Trending: {area.trending}</p>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-bold">{area.orders.toLocaleString()}</div>
                  <span className={`badge text-xs ${area.demand === 'High' ? 'badge-red' : 'badge-yellow'}`}>{area.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-400" /> Top Performing Vendors
          </h2>
          <div className="space-y-3">
            {topVendors.map((v, i) => (
              <div key={v.name} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 font-black">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{v.name}</p>
                  <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                    <span>⭐ {v.rating}</span>
                    <span>{v.sales} sales</span>
                  </div>
                </div>
                <div className="text-emerald-400 font-bold">{v.revenue}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl text-sm text-center">
            <ShieldCheck className="w-5 h-5 text-violet-400 mx-auto mb-1" />
            <p className="text-gray-400">Total platform commission: <span className="text-violet-400 font-bold">₹24.3L</span> this month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
