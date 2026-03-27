import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Package, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const reportData = {
  month: 'January 2024',
  totalRevenue: 61000,
  totalOrders: 540,
  totalProfit: 18300,
  profitMargin: 30,
  totalUnitsOut: 4820,
  newCustomers: 64,
  topMedicines: [
    { name: 'Paracetamol 500mg', sold: 820, revenue: 9840, profit: 2952 },
    { name: 'Metformin 500mg', sold: 640, revenue: 16000, profit: 4800 },
    { name: 'Vitamin C 1000mg', sold: 520, revenue: 10400, profit: 3120 },
    { name: 'Omeprazole 20mg', sold: 480, revenue: 10080, profit: 3024 },
    { name: 'Cetirizine 10mg', sold: 440, revenue: 4400, profit: 1320 },
  ],
  categoryBreakdown: [
    { category: 'Analgesic', revenue: 18000, profit: 5400 },
    { category: 'Antidiabetic', revenue: 16000, profit: 4800 },
    { category: 'Vitamins', revenue: 12000, profit: 3600 },
    { category: 'Antacid', revenue: 9000, profit: 2700 },
    { category: 'Antibiotic', revenue: 6000, profit: 1800 },
  ],
};

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState('january-2024');

  const handleDownload = () => {
    toast.success('Report downloaded as PDF (simulation)');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title">Automated Reports</h1>
          <p className="section-subtitle">Monthly sales, profits, and inventory reports</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="input-field w-auto text-sm">
            <option value="january-2024">January 2024</option>
            <option value="december-2023">December 2023</option>
            <option value="november-2023">November 2023</option>
          </select>
          <button onClick={handleDownload} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="glass-card p-6 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Monthly Report — {reportData.month}</h2>
        </div>
        <p className="text-gray-400 text-sm">Generated automatically on Feb 1, 2024 • Covers all transactions for January 2024</p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${reportData.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Net Profit', value: `₹${reportData.totalProfit.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Profit Margin', value: `${reportData.profitMargin}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Orders', value: reportData.totalOrders, icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Units Dispensed', value: reportData.totalUnitsOut.toLocaleString(), icon: Package, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'New Customers', value: reportData.newCustomers, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-gray-400 text-sm mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Top Medicines Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-white font-bold">Top Performing Medicines</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-gray-400 font-medium">#</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Medicine</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Units Sold</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Revenue</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Profit</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reportData.topMedicines.map((med, i) => (
                <tr key={med.name} className="hover:bg-white/5">
                  <td className="px-5 py-3 text-gray-500">#{i + 1}</td>
                  <td className="px-5 py-3 text-white font-medium">{med.name}</td>
                  <td className="px-5 py-3 text-gray-300">{med.sold}</td>
                  <td className="px-5 py-3 text-blue-400 font-bold">₹{med.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3 text-emerald-400 font-bold">₹{med.profit.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className="badge badge-green">30%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card p-6">
        <h3 className="text-white font-bold mb-4">Revenue by Category</h3>
        <div className="space-y-3">
          {reportData.categoryBreakdown.map(cat => {
            const maxRev = reportData.categoryBreakdown[0].revenue;
            const pct = Math.round((cat.revenue / maxRev) * 100);
            return (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{cat.category}</span>
                  <div className="flex gap-4">
                    <span className="text-blue-400">₹{cat.revenue.toLocaleString()}</span>
                    <span className="text-emerald-400">+₹{cat.profit.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
