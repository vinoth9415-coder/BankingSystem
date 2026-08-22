import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateAccountPage from './pages/CreateAccountPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import TransferPage from './pages/TransferPage';
import SearchAccountPage from './pages/SearchAccountPage';
import AllAccountsPage from './pages/AllAccountsPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            {/* Admin-only Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'user']}><DashboardPage /></ProtectedRoute>} />
            <Route path="/all-accounts" element={<ProtectedRoute allowedRoles={['admin']}><AllAccountsPage /></ProtectedRoute>} />
            <Route path="/search-account" element={<ProtectedRoute allowedRoles={['admin', 'user']}><SearchAccountPage /></ProtectedRoute>} />

            {/* Customer & Admin Routes */}
            <Route path="/create-account" element={<ProtectedRoute allowedRoles={['admin', 'user']}><CreateAccountPage /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute allowedRoles={['admin', 'user']}><DepositPage /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute allowedRoles={['admin', 'user']}><WithdrawPage /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute allowedRoles={['admin', 'user']}><TransferPage /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute allowedRoles={['admin', 'user']}><TransactionHistoryPage /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="colored"
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
