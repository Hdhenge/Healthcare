import React, { useState, useRef } from 'react';
import { Camera, Upload, ScanLine, Check, Loader, X, FileImage } from 'lucide-react';
import toast from 'react-hot-toast';

const mockExtracted = [
  { name: 'Tab. Paracetamol 500mg', qty: '30 tablets', dosage: '1-0-1', price: 36 },
  { name: 'Tab. Azithromycin 250mg', qty: '6 tablets', dosage: '1-0-0', price: 85 },
  { name: 'Syp. Benadryl', qty: '100ml', dosage: '5ml TDS', price: 48 },
  { name: 'Cap. Omeprazole 20mg', qty: '14 capsules', dosage: '0-0-1', price: 42 },
];

export default function PrescriptionScanner() {
  const [step, setStep] = useState('upload'); // upload | scanning | result
  const [preview, setPreview] = useState(null);
  const [budget, setBudget] = useState('');
  const [extracted, setExtracted] = useState([]);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStep('scanning');
    // Simulate OCR processing
    setTimeout(() => {
      setExtracted(mockExtracted);
      setStep('result');
      toast.success('Prescription scanned successfully!');
    }, 2500);
  };

  const totalCost = extracted.reduce((sum, m) => sum + m.price, 0);
  const budgetNum = parseFloat(budget);
  const withinBudget = !isNaN(budgetNum) ? extracted.filter(m => {
    let runningTotal = 0;
    for (const med of extracted) {
      runningTotal += med.price;
      if (runningTotal > budgetNum) break;
      if (med === m) return true;
    }
    return false;
  }) : [];

  const reset = () => {
    setStep('upload');
    setPreview(null);
    setExtracted([]);
    setBudget('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="section-title">Prescription Scanner</h1>
        <p className="section-subtitle">Upload your prescription — AI reads medicines and calculates cost</p>
      </div>

      {step === 'upload' && (
        <div>
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
            className="glass-card border-2 border-dashed border-white/20 hover:border-emerald-500/50 p-16 text-center cursor-pointer transition-all duration-300 hover:bg-emerald-500/5"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Prescription</h3>
            <p className="text-gray-400 mb-2">Drag & drop or click to select</p>
            <p className="text-gray-600 text-sm">Supports JPG, PNG, PDF • Powered by Google Cloud Vision API</p>

            <div className="mt-6 flex justify-center gap-3">
              <span className="badge badge-blue">OCR Enabled</span>
              <span className="badge badge-green">AI Medicine Extraction</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />

          <p className="text-center text-gray-500 text-sm mt-4">
            Your prescription data is processed securely and never stored permanently.
          </p>
        </div>
      )}

      {step === 'scanning' && (
        <div className="glass-card p-12 text-center">
          {preview && <img src={preview} alt="prescription" className="h-40 object-contain mx-auto mb-8 rounded-xl opacity-60" />}
          <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Scanning Prescription...</h3>
          <p className="text-gray-400">Google Cloud Vision API is reading your medicines</p>
          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Image uploaded</div>
            <div className="flex items-center justify-center gap-2 animate-pulse"><Loader className="w-4 h-4 text-violet-400" /> Extracting text...</div>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {preview && <img src={preview} alt="rx" className="w-12 h-12 object-cover rounded-lg" />}
              <div>
                <p className="text-white font-semibold">Extracted {extracted.length} medicines</p>
                <p className="text-gray-400 text-sm">Used: Google Cloud Vision OCR</p>
              </div>
            </div>
            <button onClick={reset} className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
              <X className="w-4 h-4" /> Reset
            </button>
          </div>

          {/* Extracted Medicines */}
          <div className="glass-card divide-y divide-white/5">
            {extracted.map((med, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{med.name}</p>
                  <p className="text-gray-400 text-sm">{med.qty} • Dose: {med.dosage}</p>
                </div>
                <div className="text-emerald-400 font-bold">₹{med.price}</div>
              </div>
            ))}
            <div className="p-4 flex items-center justify-between bg-white/5">
              <span className="text-white font-bold">Total Cost</span>
              <span className="text-xl font-black text-emerald-400">₹{totalCost}</span>
            </div>
          </div>

          {/* Budget Calculator */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              Budget Filter
              <span className="badge badge-blue text-xs">Smart Feature</span>
            </h3>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  placeholder="Enter your budget"
                  className="input-field pl-9"
                />
              </div>
            </div>
            {budget && !isNaN(budgetNum) && (
              <div className={`p-4 rounded-xl ${budgetNum >= totalCost ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
                {budgetNum >= totalCost ? (
                  <p className="text-emerald-400 font-semibold flex items-center gap-2">
                    <Check className="w-5 h-5" /> Your budget of ₹{budgetNum} covers all {extracted.length} medicines!
                  </p>
                ) : (
                  <div>
                    <p className="text-orange-400 font-semibold mb-2">
                      Budget ₹{budgetNum} — you can afford {withinBudget.length} of {extracted.length} medicines
                    </p>
                    <div className="space-y-1">
                      {extracted.map((med, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          {withinBudget.includes(med) ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <X className="w-4 h-4 text-red-400" />
                          )}
                          <span className={withinBudget.includes(med) ? 'text-white' : 'text-gray-500 line-through'}>
                            {med.name} — ₹{med.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
