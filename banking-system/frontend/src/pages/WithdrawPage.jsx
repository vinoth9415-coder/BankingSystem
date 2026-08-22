import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import { toast } from 'react-toastify';
import { FiArrowUpCircle, FiSearch, FiCheckCircle, FiAlertCircle, FiPrinter, FiFileText } from 'react-icons/fi';

export default function WithdrawPage() {
  const [searchParams] = useSearchParams();
  const initialAccNum = searchParams.get('accountNumber') || '';

  const [form, setForm] = useState({ accountNumber: initialAccNum, amount: '', description: '' });
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (initialAccNum) {
      handleSearch(initialAccNum);
    }
  }, [initialAccNum]);

  const handleSearch = async (accNumToSearch) => {
    const accNum = accNumToSearch || form.accountNumber.trim();
    if (!accNum) {
      toast.warning('Please enter an account number');
      return;
    }
    setSearching(true);
    setAccount(null);
    setReceipt(null);
    try {
      const res = await accountService.getAccount(accNum);
      setAccount(res.data.data);
      toast.success('Account identified');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Account not found');
    } finally {
      setSearching(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!account) {
      toast.warning('Please search and select a valid account first');
      return;
    }
    const numAmount = Number(form.amount);
    if (!form.amount || numAmount <= 0) {
      toast.warning('Please enter a valid withdrawal amount (> 0)');
      return;
    }
    if (numAmount > account.balance) {
      toast.error(`Insufficient balance. Maximum available: ₹${Number(account.balance).toLocaleString('en-IN')}`);
      return;
    }

    setLoading(true);
    try {
      const res = await transactionService.withdraw({
        accountNumber: account.accountNumber,
        amount: numAmount,
        description: form.description || 'Cash Withdrawal'
      });
      const txn = res.data.data;
      setReceipt(txn);
      toast.success(`✅ ₹${numAmount.toLocaleString('en-IN')} withdrawn successfully!`);
      setAccount({ ...account, balance: txn.balanceAfter });
      setForm(prev => ({ ...prev, amount: '', description: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const remainingBalance = account && form.amount ? Number(account.balance) - Number(form.amount) : null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-rose-600 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 text-white text-xl">
            <FiArrowUpCircle />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Debit Withdrawal</h1>
            <p className="text-slate-400 text-xs">Debit cash funds from a customer bank account</p>
          </div>
        </div>

        {/* Withdrawal Card Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          {/* Account Search Bar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Account Number *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                placeholder="Enter 12-digit Account Number (e.g. ACC100293841)"
                className="flex-1 px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white font-mono-code font-bold text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={searching}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 text-xs transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {searching ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSearch size={16} /> Verify Account
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Account Details Box */}
          {account && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
                  <FiCheckCircle size={14} /> Account Verified & Active
                </span>
                <span className="text-xs font-mono-code text-slate-400">{account.accountType}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Account Holder</p>
                  <p className="text-sm font-bold text-white">{account.holderName}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">Available Balance</p>
                  <p className="text-base font-black text-rose-400 font-mono-code">
                    ₹{Number(account.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Withdrawal Amount Form */}
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Withdrawal Amount (₹) *
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter withdrawal amount (e.g. 2000)"
                disabled={!account}
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-rose-400 font-mono-code font-bold text-base focus:outline-none focus:border-rose-500 disabled:opacity-50"
              />
              {remainingBalance !== null && remainingBalance < 0 && (
                <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                  <FiAlertCircle /> Amount exceeds available balance (₹{account.balance.toLocaleString('en-IN')})
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Transaction Description / Remark
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g., ATM Cash withdrawal, Counter withdrawal"
                disabled={!account}
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !account || !form.amount || (remainingBalance !== null && remainingBalance < 0)}
              className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiArrowUpCircle size={18} /> Process Withdrawal
                </>
              )}
            </button>
          </form>

          {/* Transaction Receipt */}
          {receipt && (
            <div className="mt-6 p-5 bg-slate-900 rounded-2xl border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <FiFileText size={14} /> Official Withdrawal Receipt
                </span>
                <button onClick={() => window.print()} className="text-slate-400 hover:text-white p-1 text-xs flex items-center gap-1">
                  <FiPrinter size={14} /> Print
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono-code">
                <div><span className="text-slate-500">Ref ID:</span> <p className="text-blue-400 font-bold">{receipt.id}</p></div>
                <div><span className="text-slate-500">Account:</span> <p className="text-white">{receipt.accountNumber}</p></div>
                <div><span className="text-slate-500">Amount Debited:</span> <p className="text-rose-400 font-bold">₹{Number(receipt.amount).toLocaleString('en-IN')}</p></div>
                <div><span className="text-slate-500">Remaining Balance:</span> <p className="text-white font-bold">₹{Number(receipt.balanceAfter).toLocaleString('en-IN')}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
