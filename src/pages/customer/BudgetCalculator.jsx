import React, { useState } from 'react';
import { Calculator, IndianRupee, Plus, Minus, Check, AlertCircle } from 'lucide-react';

const medicines = [
  { name: 'Paracetamol 500mg', pricePerTab: 1.2, unit: 'tablet', dosagePerDay: 2 },
  { name: 'Metformin 500mg', pricePerTab: 2.5, unit: 'tablet', dosagePerDay: 2 },
  { name: 'Azithromycin 250mg', pricePerTab: 14.2, unit: 'capsule', dosagePerDay: 1 },
  { name: 'Atorvastatin 10mg', pricePerTab: 4.5, unit: 'tablet', dosagePerDay: 1 },
  { name: 'Omeprazole 20mg', pricePerTab: 2.1, unit: 'capsule', dosagePerDay: 1 },
  { name: 'Cetirizine 10mg', pricePerTab: 1.0, unit: 'tablet', dosagePerDay: 1 },
  { name: 'Amlodipine 5mg', pricePerTab: 1.8, unit: 'tablet', dosagePerDay: 1 },
  { name: 'Ibuprofen 400mg', pricePerTab: 2.2, unit: 'tablet', dosagePerDay: 3 },
];

export default function BudgetCalculator() {
  const [budget, setBudget] = useState('');
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState(null);

  const toggle = (med) => {
    setSelected(prev => {
      const exists = prev.find(m => m.name === med.name);
      if (exists) return prev.filter(m => m.name !== med.name);
      return [...prev, { ...med, days: 30 }];
    });
    setResults(null);
  };

  const updateDays = (name, delta) => {
    setSelected(prev => prev.map(m => m.name === name ? { ...m, days: Math.max(1, m.days + delta) } : m));
  };

  const calculate = () => {
    if (!budget || selected.length === 0) return;
    const b = parseFloat(budget);
    let remaining = b;
    const calcResults = [];
    for (const med of selected) {
      const costPerDay = med.pricePerTab * med.dosagePerDay;
      const maxDays = Math.floor(remaining / costPerDay);
      const affordedDays = Math.min(med.days, maxDays);
      const cost = costPerDay * affordedDays;
      remaining -= cost;
      calcResults.push({ ...med, affordedDays, cost: cost.toFixed(2), maxDays, affordable: affordedDays >= med.days });
    }
    setResults({ items: calcResults, totalSpent: (b - remaining).toFixed(2), remaining: remaining.toFixed(2), budget: b });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="section-title">Budget Calculator</h1>
        <p className="section-subtitle">Know exactly how many days of medicine you can afford</p>
      </div>

      {/* Budget Input */}
      <div className="glass-card p-6">
        <label className="block text-white font-semibold mb-3">Enter Your Budget</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
          <input
            type="number"
            value={budget}
            onChange={e => { setBudget(e.target.value); setResults(null); }}
            placeholder="e.g. 500"
            className="input-field pl-10 text-xl font-bold py-4"
          />
        </div>
        {budget && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {[100, 200, 500, 1000, 2000].map(v => (
              <button key={v} onClick={() => { setBudget(String(v)); setResults(null); }}
                className={`px-3 py-1 rounded-full text-sm transition-all ${parseFloat(budget) === v ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                ₹{v}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Medicine Selection */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold mb-4">Select Your Medicines</h3>
        <div className="space-y-2">
          {medicines.map(med => {
            const isSelected = selected.find(m => m.name === med.name);
            const sel = selected.find(m => m.name === med.name);
            return (
              <div key={med.name} className={`p-3 rounded-xl transition-all duration-200 border ${isSelected ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                <div className="flex items-center justify-between">
                  <button onClick={() => toggle(med)} className="flex items-center gap-3 flex-1 text-left">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'}`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-white font-medium text-sm">{med.name}</span>
                  </button>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    ₹{med.pricePerTab}/{med.unit}
                  </div>
                </div>
                {isSelected && sel && (
                  <div className="mt-3 flex items-center gap-3 pl-8">
                    <span className="text-gray-400 text-sm">Days needed:</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateDays(med.name, -5)} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-bold w-8 text-center">{sel.days}</span>
                      <button onClick={() => updateDays(med.name, 5)} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-gray-500 text-xs">Cost: ₹{(med.pricePerTab * med.dosagePerDay * sel.days).toFixed(2)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        disabled={!budget || selected.length === 0}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Calculator className="w-5 h-5" />
        Calculate Budget Allocation
      </button>

      {/* Results */}
      {results && (
        <div className="glass-card p-6 border border-emerald-500/30 animate-slide-up">
          <h3 className="text-white font-bold text-lg mb-4">Budget Breakdown</h3>
          <div className="space-y-3 mb-4">
            {results.items.map(item => (
              <div key={item.name} className={`p-3 rounded-xl border ${item.affordable ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-gray-400 text-xs">
                      {item.affordable
                        ? `Full ${item.days} days — ₹${item.cost}`
                        : `Only ${item.affordedDays} of ${item.days} days — ₹${item.cost}`}
                    </p>
                  </div>
                  {item.affordable
                    ? <Check className="w-5 h-5 text-emerald-400" />
                    : <AlertCircle className="w-5 h-5 text-orange-400" />
                  }
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Budget</span>
              <span className="text-white font-bold">₹{results.budget}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Spent</span>
              <span className="text-red-400 font-bold">₹{results.totalSpent}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Remaining</span>
              <span className="text-emerald-400 font-bold">₹{results.remaining}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
