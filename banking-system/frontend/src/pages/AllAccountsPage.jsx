import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { accountService } from '../services/accountService';
import { toast } from 'react-toastify';
import {
  FiList, FiSearch, FiTrash2, FiChevronLeft, FiChevronRight,
  FiChevronUp, FiChevronDown, FiCreditCard, FiLock, FiUnlock,
  FiPlusCircle, FiDownload, FiX, FiCheckCircle
} from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';

export default function AllAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const navigate = useNavigate();
  const pageSize = 10;

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountService.getAllAccounts({ search, page, size: pageSize, sortBy, sortDir });
      const data = res.data.data;
      setAccounts(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || (data.content ? data.content.length : 0));
    } catch (err) {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, [search, page, sortBy, sortDir]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
    setPage(0);
  };

  const handleToggleFreeze = async (acc) => {
    const newStatus = acc.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
    try {
      await accountService.updateAccountStatus(acc.accountNumber, newStatus);
      toast.success(`Account ${acc.accountNumber} set to ${newStatus}`);
      fetchAccounts();
      if (selectedAccount?.accountNumber === acc.accountNumber) {
        setSelectedAccount({ ...selectedAccount, status: newStatus });
      }
    } catch (err) {
      toast.error('Failed to update account status');
    }
  };

  const handleDelete = async () => {
    try {
      await accountService.deleteAccount(deleteTarget);
      toast.success('Account closed successfully');
      setDeleteTarget(null);
      fetchAccounts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete account');
      setDeleteTarget(null);
    }
  };

  const exportCSV = () => {
    if (!accounts.length) return;
    const headers = ['Account Number,Holder Name,Email,Phone,Type,Balance,Status'];
    const rows = accounts.map(a => `"${a.accountNumber}","${a.holderName}","${a.email}","${a.phoneNumber || ''}","${a.accountType}",${a.balance},"${a.status || 'ACTIVE'}"`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bank_Accounts_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info('Exported accounts report as CSV');
  };

  const formatCurrency = (val) => '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white text-xl">
              <FiList />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Account Registry</h1>
              <p className="text-slate-400 text-xs">{totalElements} accounts registered</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 text-xs transition-all"
            >
              <FiDownload size={14} /> Export CSV
            </button>
            <Link
              to="/create-account"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 text-xs transition-all"
            >
              <FiPlusCircle size={15} /> New Account
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search account number, holder name, email, or mobile..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors font-medium"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/90 border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Account Number</th>
                      <th className="px-5 py-4">Holder Name</th>
                      <th className="px-5 py-4">Account Type</th>
                      <th className="px-5 py-4">Balance</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {accounts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                          No matching bank accounts found.
                        </td>
                      </tr>
                    ) : (
                      accounts.map((acc) => (
                        <tr key={acc.accountNumber} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-4 font-mono-code font-bold text-blue-400 text-xs">
                            <button
                              onClick={() => setSelectedAccount(acc)}
                              className="hover:underline flex items-center gap-1.5"
                            >
                              <FiCreditCard size={14} /> {acc.accountNumber}
                            </button>
                          </td>
                          <td className="px-5 py-4 font-bold text-white">
                            {acc.holderName}
                            <span className="block text-xs font-normal text-slate-400">{acc.email}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300">
                              {acc.accountType}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono-code font-bold text-emerald-400">
                            {formatCurrency(acc.balance)}
                          </td>
                          <td className="px-5 py-4">
                            {acc.status === 'FROZEN' ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                                <FiLock size={12} /> Frozen
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                <FiCheckCircle size={12} /> Active
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleFreeze(acc)}
                              title={acc.status === 'FROZEN' ? 'Unfreeze Account' : 'Freeze Account'}
                              className={`p-2 rounded-xl transition-colors border ${
                                acc.status === 'FROZEN'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                              }`}
                            >
                              {acc.status === 'FROZEN' ? <FiUnlock size={14} /> : <FiLock size={14} />}
                            </button>
                            <button
                              onClick={() => setDeleteTarget(acc.accountNumber)}
                              title="Close Account"
                              className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Showing page {page + 1} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Account Details & Virtual Debit Card Modal */}
        {selectedAccount && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative">
              <button
                onClick={() => setSelectedAccount(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
              >
                <FiX size={20} />
              </button>

              <h2 className="text-lg font-black text-white mb-4">Account Portfolio View</h2>

              {/* Debit Card Mock Graphic */}
              <div className="bg-gradient-to-tr from-blue-700 via-indigo-800 to-slate-900 rounded-2xl p-6 mb-6 shadow-2xl border border-white/10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs text-blue-200 uppercase font-semibold">SecureBank Premium</p>
                    <p className="text-lg font-black tracking-wide">{selectedAccount.accountType}</p>
                  </div>
                  <span className="text-amber-300 font-bold text-sm tracking-wider">VISA</span>
                </div>
                <div className="mb-6 font-mono-code text-xl tracking-widest text-blue-100">
                  {selectedAccount.accountNumber}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase text-blue-200">Account Holder</p>
                    <p className="text-sm font-bold uppercase">{selectedAccount.holderName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-blue-200">Available Balance</p>
                    <p className="text-base font-black text-emerald-400 font-mono-code">
                      {formatCurrency(selectedAccount.balance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-3 text-xs bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-white">{selectedAccount.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-white">{selectedAccount.phoneNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-semibold text-emerald-400">{selectedAccount.status || 'ACTIVE'}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    const accNum = selectedAccount.accountNumber;
                    setSelectedAccount(null);
                    navigate(`/deposit?accountNumber=${accNum}`);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all"
                >
                  Quick Deposit
                </button>
                <button
                  onClick={() => {
                    const accNum = selectedAccount.accountNumber;
                    setSelectedAccount(null);
                    navigate(`/withdraw?accountNumber=${accNum}`);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all"
                >
                  Quick Withdraw
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="Confirm Account Closure"
          message={`Are you sure you want to permanently close account ${deleteTarget}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </DashboardLayout>
  );
}
