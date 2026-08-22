import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import { toast } from 'react-toastify';
import { FiRepeat, FiSearch, FiCheckCircle, FiArrowRight, FiFileText, FiPrinter } from 'react-icons/fi';

export default function TransferPage() {
  const [form, setForm] = useState({ fromAccountNumber: '', toAccountNumber: '', amount: '', description: '' });
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const searchAccount = async (field, accountNumber) => {
    if (!accountNumber.trim()) {
      toast.warning('Enter an account number to verify');
      return;
    }
    try {
      const res = await accountService.getAccount(accountNumber.trim());
      if (field === 'from') {
        setFromAccount(res.data.data);
        toast.success('Sender account verified');
      } else {
        setToAccount(res.data.data);
        toast.success('Receiver account verified');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Account not found');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!fromAccount || !toAccount) {
      toast.warning('Please search and verify both sender and receiver accounts first');
      return;
    }
    if (fromAccount.accountNumber === toAccount.accountNumber) {
      toast.error('Source and Destination cannot be the exact same account');
      return;
    }
    const numAmt = Number(form.amount);
    if (!form.amount || numAmt <= 0) {
      toast.warning('Enter a valid positive transfer amount');
      return;
    }
    if (numAmt > fromAccount.balance) {
      toast.error(`Sender has insufficient funds. Available balance: ₹${Number(fromAccount.balance).toLocaleString('en-IN')}`);
      return;
    }

    setLoading(true);
    setReceipt(null);
    try {
      const res = await transactionService.transfer({
        fromAccountNumber: fromAccount.accountNumber,
        toAccountNumber: toAccount.accountNumber,
        amount: numAmt,
        description: form.description || 'Fund Transfer'
      });
      const txns = res.data.data;
      setReceipt({
        txId: Array.isArray(txns) ? txns[0].id : 'TXN' + Date.now(),
        fromAcc: fromAccount.accountNumber,
        toAcc: toAccount.accountNumber,
        amount: numAmt,
        date: new Date().toLocaleString(),
      });
      toast.success(`🎉 ₹${numAmt.toLocaleString('en-IN')} transferred successfully!`);
      setFromAccount(null);
      setToAccount(null);
      setForm({ fromAccountNumber: '', toAccountNumber: '', amount: '', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 text-white text-xl">
            <FiRepeat />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Interbank Fund Transfer</h1>
            <p className="text-slate-400 text-xs">Execute real-time transfers between bank accounts</p>
          </div>
        </div>

        {/* Card Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sender Account */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-400">
                1. Sender Account (Debit) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.fromAccountNumber}
                  onChange={(e) => setForm({ ...form, fromAccountNumber: e.target.value })}
                  placeholder="Sender Account No."
                  className="flex-1 px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-white font-mono-code text-xs focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => searchAccount('from', form.fromAccountNumber)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700"
                >
                  Verify
                </button>
              </div>

              {fromAccount && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-xs space-y-1">
                  <p className="font-bold text-white">{fromAccount.holderName}</p>
                  <p className="text-slate-400 font-mono-code">{fromAccount.accountNumber}</p>
                  <p className="text-rose-400 font-mono-code font-bold pt-1">
                    Avail: ₹{Number(fromAccount.balance).toLocaleString('en-IN')}
                  </p>
                </div>
              )}
            </div>

            {/* Receiver Account */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400">
                2. Receiver Account (Credit) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.toAccountNumber}
                  onChange={(e) => setForm({ ...form, toAccountNumber: e.target.value })}
                  placeholder="Receiver Account No."
                  className="flex-1 px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-white font-mono-code text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => searchAccount('to', form.toAccountNumber)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700"
                >
                  Verify
                </button>
              </div>

              {toAccount && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs space-y-1">
                  <p className="font-bold text-white">{toAccount.holderName}</p>
                  <p className="text-slate-400 font-mono-code">{toAccount.accountNumber}</p>
                  <p className="text-emerald-400 font-mono-code font-bold pt-1">
                    Avail: ₹{Number(toAccount.balance).toLocaleString('en-IN')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Amount Form */}
          <form onSubmit={handleTransfer} className="space-y-4 pt-4 border-t border-slate-800">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Transfer Amount (₹) *
                </label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter transfer amount"
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-purple-400 font-mono-code font-bold text-base focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Remark / Note
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g., Project payment, Loan repayment"
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !fromAccount || !toAccount || !form.amount}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiRepeat size={18} /> Execute Transfer
                </>
              )}
            </button>
          </form>

          {/* Transfer Receipt */}
          {receipt && (
            <div className="mt-6 p-5 bg-slate-900 rounded-2xl border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <FiFileText size={14} /> Official Transfer Receipt
                </span>
                <button onClick={() => window.print()} className="text-slate-400 hover:text-white p-1 text-xs flex items-center gap-1">
                  <FiPrinter size={14} /> Print
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono-code">
                <div><span className="text-slate-500">Txn Reference:</span> <p className="text-blue-400 font-bold">{receipt.txId}</p></div>
                <div><span className="text-slate-500">Transferred Amount:</span> <p className="text-emerald-400 font-bold">₹{Number(receipt.amount).toLocaleString('en-IN')}</p></div>
                <div><span className="text-slate-500">From Account:</span> <p className="text-rose-400 font-bold">{receipt.fromAcc}</p></div>
                <div><span className="text-slate-500">To Account:</span> <p className="text-emerald-400 font-bold">{receipt.toAcc}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
