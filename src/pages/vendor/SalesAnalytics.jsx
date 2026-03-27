import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const monthly = [
  { month: 'Aug', revenue: 42000, orders: 380 },
  { month: 'Sep', revenue: 48000, orders: 420 },
  { month: 'Oct', revenue: 38000, orders: 340 },
  { month: 'Nov', revenue: 55000, orders: 490 },
  { month: 'Dec', revenue: 72000, orders: 640 },
  { month: 'Jan', revenue: 61000, orders: 540 },
];

const topMeds = [
  { name: 'Paracetamol', revenue: 14400, sold: 3120 },
  { name: 'Vitamin C', revenue: 19600, sold: 980 },
  { name: 'Metformin', revenue: 18750, sold: 750 },
  { name: 'Omeprazole', revenue: 15840, sold: 528 },
  { name: 'Cetirizine', revenue: 6160, sold: 616 },
  { name: 'Azithromycin', revenue: 12100, sold: 144 },
];

const categoryData = [
  { name: 'Analgesic', value: 28, color: '#10b981' },
  { name: 'Antibiotic', value: 22, color: '#3b82f6' },
  { name: 'Antidiabetic', value: 18, color: '#f59e0b' },
  { name: 'Cardiac', value: 15, color: '#ef4444' },
  { name: 'Antacid', value: 12, color: '#8b5cf6' },
  { name: 'Other', value: 5, color: '#6b7280' },
];

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f9fafb' }
};

export default function SalesAnalytics() {
  const [period, setPeriod] = useState('6M');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title">Sales Analytics</h1>
          <p className="section-subtitle">Track revenue, orders, and top-performing medicines</p>
        </div>
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {['1M', '3M', '6M', '1Y'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${period === p ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹3,16,000', sub: '+12% vs last period' },
          { label: 'Total Orders', value: '2,814', sub: '+8% vs last period' },
          { label: 'Avg Order Value', value: '₹112', sub: '+4% vs last period' },
          { label: 'Best Month', value: 'December', sub: '₹72,000 revenue' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="stat-card">
            <div className="text-xl font-black text-white mb-1">{value}</div>
            <div className="text-gray-400 text-sm">{label}</div>
            <div className="text-emerald-400 text-xs mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4">Monthly Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Medicines Bar */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Top Medicines by Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topMeds} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} width={90} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="url(#blueGradV)" radius={[0, 6, 6, 0]} />
              <defs>
                <linearGradient id="blueGradV" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="40%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Share']} />
              <Legend
                layout="vertical" align="right" verticalAlign="middle"
                formatter={(value) => <span className="text-gray-400 text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
