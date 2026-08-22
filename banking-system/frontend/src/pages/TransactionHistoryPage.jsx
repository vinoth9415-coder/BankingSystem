import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { transactionService } from '../services/transactionService';
import { toast } from 'react-toastify';
import { FiClock, FiSearch, FiFilter, FiDownload, FiChevronLeft, FiChevronRight, FiFileText } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ accountNumber: '', type: '', search: '' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await transactionService.getAllTransactions({
        accountNumber: filters.accountNumber,
        type: filters.type,
        search: filters.search,
        page,
        size: 10
      });
      const data = res.data.data;
      setTransactions(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || (data.content ? data.content.length : 0));
    } catch (err) {
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const typeBadge = (type) => {
    if (type === 'DEPOSIT' || type === 'TRANSFER_CREDIT') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          + Credit ({type.replace('_', ' ')})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
        - Debit ({type.replace('_', ' ')})
      </span>
    );
  };

  const formatCurrency = (val) => '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  const exportPDF = () => {
    if (!transactions.length) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('SecureBank Enterprise - Transaction Ledger', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated On: ${new Date().toLocaleString('en-IN')}`, 14, 28);
    autoTable(doc, {
      startY: 35,
      head: [['Ref ID', 'Account No.', 'Type', 'Amount (₹)', 'Balance After', 'Date']],
      body: transactions.map(tx => [
        tx.id,
        tx.accountNumber,
        tx.transactionType.replace('_', ' '),
        `₹${Number(tx.amount).toLocaleString('en-IN')}`,
        `₹${Number(tx.balanceAfter).toLocaleString('en-IN')}`,
        new Date(tx.createdAt).toLocaleString('en-IN')
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save(`SecureBank_Ledger_${Date.now()}.pdf`);
    toast.success('Downloaded PDF Transaction Statement!');
  };

  const exportExcel = () => {
    if (!transactions.length) return;
    const data = transactions.map(tx => ({
      'Transaction Ref ID': tx.id,
      'Account Number': tx.accountNumber,
      'Type': tx.transactionType,
      'Amount (₹)': Number(tx.amount),
      'Balance After (₹)': Number(tx.balanceAfter),
      'Description': tx.description,
      'Timestamp': new Date(tx.createdAt).toLocaleString('en-IN'),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ledger');
    XLSX.writeFile(wb, `SecureBank_Ledger_${Date.now()}.xlsx`);
    toast.success('Downloaded Excel Transaction Sheet!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 text-white text-xl">
              <FiClock />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Transaction Ledger</h1>
              <p className="text-slate-400 text-xs">{totalElements} total logged transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 text-xs transition-all"
            >
              <FiFileText size={14} /> PDF Report
            </button>
            <button
              onClick={exportExcel}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-xs transition-all"
            >
              <FiDownload size={14} /> Excel Statement
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Account Filter
            </label>
            <input
              type="text"
              value={filters.accountNumber}
              onChange={(e) => { setFilters({ ...filters, accountNumber: e.target.value }); setPage(0); }}
              placeholder="Account number..."
              className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-white font-mono-code text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Transaction Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(0); }}
              className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="">All Types (Credit & Debit)</option>
              <option value="DEPOSIT">DEPOSIT</option>
              <option value="WITHDRAWAL">WITHDRAWAL</option>
              <option value="TRANSFER_CREDIT">TRANSFER CREDIT</option>
              <option value="TRANSFER_DEBIT">TRANSFER DEBIT</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Search Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(0); }}
                placeholder="Search description / Ref ID..."
                className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/90 border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Reference ID</th>
                      <th className="px-5 py-4">Account Number</th>
                      <th className="px-5 py-4">Type</th>
                      <th className="px-5 py-4">Description</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Balance After</th>
                      <th className="px-5 py-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                          No matching transactions recorded in the ledger.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-4 font-mono-code font-bold text-blue-400 text-xs">
                            {tx.id}
                          </td>
                          <td className="px-5 py-4 font-mono-code text-white text-xs font-bold">
                            {tx.accountNumber}
                          </td>
                          <td className="px-5 py-4">
                            {typeBadge(tx.transactionType)}
                          </td>
                          <td className="px-5 py-4 text-slate-300 text-xs max-w-xs truncate">
                            {tx.description || 'Standard Transaction'}
                          </td>
                          <td className="px-5 py-4 font-mono-code font-bold text-white">
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="px-5 py-4 font-mono-code font-semibold text-slate-300">
                            {formatCurrency(tx.balanceAfter)}
                          </td>
                          <td className="px-5 py-4 text-right text-xs text-slate-400">
                            {new Date(tx.createdAt).toLocaleString('en-IN')}
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
      </div>
    </DashboardLayout>
  );
}
