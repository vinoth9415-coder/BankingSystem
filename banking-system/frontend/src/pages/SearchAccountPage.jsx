import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { accountService } from '../services/accountService';
import { toast } from 'react-toastify';
import { FiSearch, FiUser } from 'react-icons/fi';

export default function SearchAccountPage() {
  const [accountNumber, setAccountNumber] = useState('');
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!accountNumber.trim()) { toast.warning('Enter an account number'); return; }
    setLoading(true); setAccount(null);
    try {
      const res = await accountService.getAccount(accountNumber.trim());
      setAccount(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Account not found');
    } finally { setLoading(false); }
  };

  const Field = ({ label, value }) => (
    <div className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 flex flex-col sm:flex-row sm:items-center gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium w-44 flex-shrink-0">{label}</span>
      <span className="text-gray-900 dark:text-white font-semibold text-sm">{value || '—'}</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <FiSearch className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Search Account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Look up any account by account number</p>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex gap-3">
            <input
              type="text" value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number to search..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-70">
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <FiSearch />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Result */}
        {account && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FiUser className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-white font-black text-xl">{account.holderName}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-blue-200 text-sm">A/C: {account.accountNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${account.active ? 'bg-green-400/20 text-green-200' : 'bg-red-400/20 text-red-200'}`}>
                      {account.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-blue-200 text-xs">Balance</p>
                  <p className="text-white font-black text-2xl">₹{Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <Field label="Account Number" value={account.accountNumber} />
              <Field label="Account Type" value={account.accountType} />
              <Field label="Holder Name" value={account.holderName} />
              <Field label="Mobile Number" value={account.mobile} />
              <Field label="Email Address" value={account.email} />
              <Field label="Address" value={account.address} />
              <Field label="Gender" value={account.gender} />
              <Field label="Date of Birth" value={account.dob} />
              <Field label="Aadhaar Number" value={account.aadhaar ? '****' + account.aadhaar.slice(-4) : '—'} />
              <Field label="PAN Number" value={account.pan} />
              <Field label="Account Balance" value={`₹${Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} />
              <Field label="Opened On" value={account.createdAt ? new Date(account.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
