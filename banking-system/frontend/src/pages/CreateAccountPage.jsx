import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { accountService } from '../services/accountService';
import { toast } from 'react-toastify';
import { FiUserPlus, FiSave, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const generateAccNumber = () => 'ACC' + Math.floor(100000000 + Math.random() * 900000000);

const initialForm = {
  accountNumber: generateAccNumber(),
  holderName: '',
  mobile: '',
  email: '',
  address: '',
  aadhaar: '',
  pan: '',
  dob: '',
  gender: 'MALE',
  accountType: 'SAVINGS',
  balance: '1000',
};

export default function CreateAccountPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRefreshAccNumber = () => {
    setForm(prev => ({ ...prev, accountNumber: generateAccNumber() }));
  };

  const validate = () => {
    const e = {};
    if (!form.accountNumber) e.accountNumber = 'Account number is required';
    if (!form.holderName || form.holderName.trim().length < 3) e.holderName = 'Full name required (at least 3 chars)';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email address required';
    if (!form.accountType) e.accountType = 'Account type is required';
    if (!form.balance || Number(form.balance) < 500) e.balance = 'Minimum initial deposit is ₹500';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the highlighted errors before submitting');
      return;
    }
    setLoading(true);
    try {
      await accountService.createAccount({ ...form, initialBalance: Number(form.balance) });
      toast.success(`🎉 Account ${form.accountNumber} opened successfully!`);
      setForm({ ...initialForm, accountNumber: generateAccNumber() });
      setErrors({});
      navigate('/all-accounts');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white text-xl">
              <FiUserPlus />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Open New Account</h1>
              <p className="text-slate-400 text-xs">Enter customer information to register a new bank account</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-8">
          {/* Section 1: Account Specs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <FiCheckCircle size={14} /> 1. Account Specifications
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Account Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Account Number (Auto-Generated)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="accountNumber"
                    value={form.accountNumber}
                    readOnly
                    className="w-full pl-4 pr-10 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-blue-400 font-mono-code font-bold text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRefreshAccNumber}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    title="Generate new account number"
                  >
                    <FiRefreshCw size={16} />
                  </button>
                </div>
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Account Type *
                </label>
                <select
                  name="accountType"
                  value={form.accountType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="SAVINGS">Savings Account (Interest 4.5% p.a.)</option>
                  <option value="CURRENT">Current Account (Business Banking)</option>
                  <option value="FIXED_DEPOSIT">Fixed Deposit Account</option>
                </select>
              </div>

              {/* Initial Balance */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Initial Deposit Amount (₹) *
                </label>
                <input
                  type="number"
                  name="balance"
                  value={form.balance}
                  onChange={handleChange}
                  placeholder="Min ₹500"
                  className={`w-full px-4 py-3 bg-slate-900/90 border rounded-xl text-emerald-400 font-mono-code font-bold text-sm focus:outline-none ${errors.balance ? 'border-rose-500' : 'border-slate-800 focus:border-blue-500'}`}
                />
                {errors.balance && <p className="text-rose-400 text-xs mt-1">{errors.balance}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <FiCheckCircle size={14} /> 2. Customer Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="holderName"
                  value={form.holderName}
                  onChange={handleChange}
                  placeholder="e.g., Rajesh Kumar"
                  className={`w-full px-4 py-3 bg-slate-900/90 border rounded-xl text-white text-sm focus:outline-none ${errors.holderName ? 'border-rose-500' : 'border-slate-800 focus:border-blue-500'}`}
                />
                {errors.holderName && <p className="text-rose-400 text-xs mt-1">{errors.holderName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g., rajesh@example.com"
                  className={`w-full px-4 py-3 bg-slate-900/90 border rounded-xl text-white text-sm focus:outline-none ${errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-blue-500'}`}
                />
                {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Residential Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, City, Pin code"
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Controls */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setForm(initialForm)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 text-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiSave size={18} /> Complete Registration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
