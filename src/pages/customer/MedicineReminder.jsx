import React, { useState } from 'react';
import { Bell, Plus, Trash2, Clock, AlertTriangle, Check, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const initialReminders = [
  {
    id: 1, medicine: 'Blood Pressure Tab (Amlodipine 5mg)',
    dosage: '1 tab', frequency: 'Daily', totalQty: 30, remaining: 8,
    purchaseDate: '2024-01-01', refillDays: 3, color: 'red'
  },
  {
    id: 2, medicine: 'Vitamin D3 (60K)',
    dosage: '1 capsule', frequency: 'Weekly', totalQty: 4, remaining: 1,
    purchaseDate: '2024-01-10', refillDays: 7, color: 'yellow'
  },
  {
    id: 3, medicine: 'Metformin 500mg',
    dosage: '1 tab', frequency: 'Twice daily', totalQty: 60, remaining: 24,
    purchaseDate: '2024-01-05', refillDays: 12, color: 'green'
  },
  {
    id: 4, medicine: 'Atorvastatin 10mg',
    dosage: '1 tab', frequency: 'Daily', totalQty: 30, remaining: 20,
    purchaseDate: '2024-01-10', refillDays: 20, color: 'green'
  },
];

const urgencyConfig = {
  red: { label: 'Urgent', badge: 'badge-red', bar: 'bg-red-400' },
  yellow: { label: 'Soon', badge: 'badge-yellow', bar: 'bg-yellow-400' },
  green: { label: 'OK', badge: 'badge-green', bar: 'bg-emerald-400' },
};

function ReminderCard({ reminder, onDelete }) {
  const pct = Math.round((reminder.remaining / reminder.totalQty) * 100);
  const cfg = urgencyConfig[reminder.color];

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold">{reminder.medicine}</h3>
            <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
          </div>
          <p className="text-gray-400 text-sm mt-0.5">{reminder.dosage} • {reminder.frequency}</p>
        </div>
        <button onClick={() => onDelete(reminder.id)} className="text-gray-600 hover:text-red-400 p-1 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{reminder.remaining}/{reminder.totalQty} remaining</span>
          <span>{pct}% left</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${cfg.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-4 h-4" />
          Refill in <span className={`font-bold ml-1 ${reminder.color === 'red' ? 'text-red-400' : reminder.color === 'yellow' ? 'text-yellow-400' : 'text-emerald-400'}`}>{reminder.refillDays} days</span>
        </div>
        {reminder.refillDays <= 5 && (
          <div className="flex items-center gap-1 text-orange-400 text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            Buy soon!
          </div>
        )}
      </div>
    </div>
  );
}

export default function MedicineReminder() {
  const [reminders, setReminders] = useState(initialReminders);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ medicine: '', dosage: '', frequency: 'Daily', totalQty: '', remaining: '' });

  const urgent = reminders.filter(r => r.color === 'red');
  const soon = reminders.filter(r => r.color === 'yellow');

  const addReminder = () => {
    if (!form.medicine || !form.totalQty) { toast.error('Please fill all fields'); return; }
    const pct = parseInt(form.remaining) / parseInt(form.totalQty);
    const color = pct < 0.25 ? 'red' : pct < 0.5 ? 'yellow' : 'green';
    const daysPerUnit = form.frequency === 'Twice daily' ? 0.5 : form.frequency === 'Weekly' ? 7 : 1;
    const refillDays = Math.round(parseInt(form.remaining) * daysPerUnit);
    setReminders(prev => [...prev, {
      id: Date.now(), ...form,
      totalQty: parseInt(form.totalQty),
      remaining: parseInt(form.remaining || form.totalQty),
      purchaseDate: new Date().toISOString().split('T')[0],
      refillDays, color,
    }]);
    setForm({ medicine: '', dosage: '', frequency: 'Daily', totalQty: '', remaining: '' });
    setShowForm(false);
    toast.success('Reminder added!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title">Medicine Reminders</h1>
          <p className="section-subtitle">Smart alerts calculated from dosage & quantity</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Reminder
        </button>
      </div>

      {/* Alert Banner */}
      {urgent.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-bold">{urgent.length} medicine{urgent.length > 1 ? 's' : ''} urgently need refill!</p>
            <p className="text-gray-400 text-sm">{urgent.map(r => r.medicine.split('(')[0].trim()).join(', ')}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Medicines', value: reminders.length, color: 'text-white', bg: 'bg-white/10' },
          { label: 'Urgent Refill', value: urgent.length, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Refill Soon', value: soon.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`glass-card p-4 text-center ${bg}`}>
            <div className={`text-3xl font-black ${color}`}>{value}</div>
            <div className="text-gray-400 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-card p-6 border border-emerald-500/30">
          <h3 className="text-white font-bold mb-4">New Medicine Reminder</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.medicine} onChange={e => setForm(f => ({ ...f, medicine: e.target.value }))} placeholder="Medicine Name" className="input-field" />
            <input value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} placeholder="Dosage (e.g. 1 tab)" className="input-field" />
            <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} className="input-field">
              <option>Daily</option>
              <option>Twice daily</option>
              <option>Weekly</option>
            </select>
            <input type="number" value={form.totalQty} onChange={e => setForm(f => ({ ...f, totalQty: e.target.value }))} placeholder="Total Quantity Purchased" className="input-field" />
            <input type="number" value={form.remaining} onChange={e => setForm(f => ({ ...f, remaining: e.target.value }))} placeholder="Current Remaining Qty" className="input-field" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addReminder} className="btn-primary flex items-center gap-2"><Check className="w-4 h-4" /> Save Reminder</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="grid md:grid-cols-2 gap-4">
        {reminders.map(r => (
          <ReminderCard
            key={r.id}
            reminder={r}
            onDelete={(id) => { setReminders(prev => prev.filter(r => r.id !== id)); toast.success('Reminder removed'); }}
          />
        ))}
      </div>
    </div>
  );
}
