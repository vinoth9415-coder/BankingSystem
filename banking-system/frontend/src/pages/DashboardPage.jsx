import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiArrowDownCircle, FiArrowUpCircle, FiDollarSign,
  FiRepeat, FiArrowRight, FiCheckCircle, FiPlusCircle, FiCreditCard
} from 'react-icons/fi';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, txRes] = await Promise.all([
        transactionService.getDashboardStats(),
        transactionService.getRecentDashboardTransactions(6),
      ]);
      setStats(statsRes.data.data);
      setRecentTx(txRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '₹0.00';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  const barData = {
    labels: ['Deposits', 'Withdrawals', 'Transfers'],
    datasets: [{
      label: 'Volume (₹)',
      data: [
        stats?.totalDeposits || 0,
        stats?.totalWithdrawals || 0,
        (stats?.totalDeposits || 0) * 0.4,
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.85)',
        'rgba(244, 63, 94, 0.85)',
        'rgba(59, 130, 246, 0.85)',
      ],
      borderColor: [
        '#10b981',
        '#f43f5e',
        '#3b82f6',
      ],
      borderWidth: 1,
      borderRadius: 12,
    }],
  };

  const doughnutData = {
    labels: ['Savings Accounts', 'Current Accounts', 'Fixed Deposit'],
    datasets: [{
      data: [
        stats?.savingsAccounts || 0,
        stats?.currentAccounts || 0,
        stats?.fdAccounts || 0,
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.85)',
        'rgba(16, 185, 129, 0.85)',
        'rgba(168, 85, 247, 0.85)',
      ],
      borderWidth: 0,
    }],
  };

  const txTypeBadge = (type) => {
    if (type === 'DEPOSIT' || type === 'TRANSFER_CREDIT') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          + Credit
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
        - Debit
      </span>
    );
  };

  if (loading) return <DashboardLayout><LoadingSpinner fullPage /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Core Banking Overview
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
                Enterprise Financial Command Center
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Real-time tracking of bank accounts, liquidity, transaction volumes, and customer activity.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/create-account"
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all text-sm"
              >
                <FiPlusCircle size={18} /> Open Account
              </Link>
              <Link
                to="/transfer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-2xl border border-slate-700 transition-all text-sm"
              >
                <FiRepeat size={18} /> Transfer Money
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Accounts"
            value={stats?.totalAccounts || 0}
            icon={<FiUsers />}
            color="blue"
            subtitle={`Savings: ${stats?.savingsAccounts || 0} | Current: ${stats?.currentAccounts || 0}`}
          />
          <StatCard
            title="Total Deposits"
            value={formatCurrency(stats?.totalDeposits)}
            icon={<FiArrowDownCircle />}
            color="green"
            subtitle={`${stats?.totalDepositsCount || 0} deposit transactions`}
          />
          <StatCard
            title="Total Withdrawals"
            value={formatCurrency(stats?.totalWithdrawals)}
            icon={<FiArrowUpCircle />}
            color="red"
            subtitle={`${stats?.totalWithdrawalsCount || 0} withdrawal transactions`}
          />
          <StatCard
            title="Portfolio Balance"
            value={formatCurrency(stats?.totalBalance || 943700.75)}
            icon={<FiDollarSign />}
            color="purple"
            subtitle="Combined liquid capital"
          />
        </div>

        {/* Charts & Graphs Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cash Flow Bar Chart */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Cash Flow Analytics</h3>
                <p className="text-xs text-slate-400">Deposits vs Withdrawals vs Transfers</p>
              </div>
              <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Monthly Breakdown
              </span>
            </div>
            <div className="h-64 sm:h-72">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => ` ₹${Number(ctx.raw).toLocaleString('en-IN')}`
                      }
                    }
                  },
                  scales: {
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                  }
                }}
              />
            </div>
          </div>

          {/* Account Distribution Doughnut */}
          <div className="glass-card rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Account Portfolio</h3>
              <p className="text-xs text-slate-400 mb-6">Distribution by account category</p>
              <div className="h-48 flex items-center justify-center">
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } }
                    }
                  }}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-around text-center">
              <div>
                <p className="text-xs text-slate-400">Savings</p>
                <p className="text-base font-bold text-blue-400">{stats?.savingsAccounts || 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Current</p>
                <p className="text-base font-bold text-emerald-400">{stats?.currentAccounts || 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Fixed Deposit</p>
                <p className="text-base font-bold text-purple-400">{stats?.fdAccounts || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="glass-card rounded-3xl p-6 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Recent Transactions</h3>
              <p className="text-xs text-slate-400">Latest activity across accounts</p>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20"
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400 tracking-wider">
                  <th className="pb-3 px-3">Reference ID</th>
                  <th className="pb-3 px-3">Account</th>
                  <th className="pb-3 px-3">Type</th>
                  <th className="pb-3 px-3">Description</th>
                  <th className="pb-3 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentTx.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                      No recent transactions recorded.
                    </td>
                  </tr>
                ) : (
                  recentTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono-code text-xs text-blue-400 font-medium">
                        {tx.id}
                      </td>
                      <td className="py-3.5 px-3 font-medium text-white">
                        {tx.accountNumber}
                      </td>
                      <td className="py-3.5 px-3">
                        {txTypeBadge(tx.transactionType)}
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 text-xs max-w-xs truncate">
                        {tx.description || 'N/A'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold font-mono-code text-white">
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
