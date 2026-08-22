// Mock data store for client-side demo mode and offline fallback

const initialAccounts = [
  {
    id: 1,
    accountNumber: 'ACC100293841',
    holderName: 'Vinoth Kumar',
    email: 'vinoth@bankingsystem.com',
    phoneNumber: '+91 98765 43210',
    accountType: 'SAVINGS',
    balance: 148500.00,
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:30:00',
  },
  {
    id: 2,
    accountNumber: 'ACC100392842',
    holderName: 'Anita Sharma',
    email: 'anita.sharma@example.com',
    phoneNumber: '+91 98123 45678',
    accountType: 'CURRENT',
    balance: 520000.50,
    status: 'ACTIVE',
    createdAt: '2026-02-01T14:20:00',
  },
  {
    id: 3,
    accountNumber: 'ACC100483923',
    holderName: 'Apex Enterprises Tech Ltd',
    email: 'finance@apextech.com',
    phoneNumber: '+91 94444 33221',
    accountType: 'CURRENT',
    balance: 1250000.00,
    status: 'ACTIVE',
    createdAt: '2026-02-10T09:15:00',
  },
  {
    id: 4,
    accountNumber: 'ACC100574834',
    holderName: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phoneNumber: '+91 97777 88899',
    accountType: 'SAVINGS',
    balance: 75200.25,
    status: 'ACTIVE',
    createdAt: '2026-02-18T16:45:00',
  },
  {
    id: 5,
    accountNumber: 'ACC100683945',
    holderName: 'Priya Patel',
    email: 'priya.patel@example.com',
    phoneNumber: '+91 96666 55443',
    accountType: 'FIXED_DEPOSIT',
    balance: 300000.00,
    status: 'ACTIVE',
    createdAt: '2026-03-01T11:00:00',
  }
];

const initialTransactions = [
  {
    id: 'TXN90182301',
    accountNumber: 'ACC100293841',
    transactionType: 'DEPOSIT',
    amount: 50000.00,
    balanceAfter: 148500.00,
    description: 'Initial Salary Deposit',
    status: 'SUCCESS',
    createdAt: '2026-03-01T09:30:00',
  },
  {
    id: 'TXN90182302',
    accountNumber: 'ACC100392842',
    transactionType: 'TRANSFER_CREDIT',
    amount: 120000.00,
    balanceAfter: 520000.50,
    description: 'Client Project Advance Payment',
    status: 'SUCCESS',
    createdAt: '2026-03-01T11:15:00',
  },
  {
    id: 'TXN90182303',
    accountNumber: 'ACC100293841',
    transactionType: 'WITHDRAWAL',
    amount: 15000.00,
    balanceAfter: 133500.00,
    description: 'ATM Cash Withdrawal',
    status: 'SUCCESS',
    createdAt: '2026-03-01T15:45:00',
  },
  {
    id: 'TXN90182304',
    accountNumber: 'ACC100483923',
    transactionType: 'TRANSFER_DEBIT',
    amount: 45000.00,
    balanceAfter: 1250000.00,
    description: 'Vendor Transfer',
    status: 'SUCCESS',
    createdAt: '2026-03-01T17:00:00',
  }
];

const initialUsers = [
  {
    username: 'admin',
    password: 'Admin@123',
    fullName: 'System Administrator',
    email: 'admin@bankingsystem.com',
    role: 'admin'
  },
  {
    username: 'vinoth',
    password: 'Vinoth@123',
    fullName: 'Vinoth Kumar',
    email: 'vinoth@bankingsystem.com',
    role: 'user'
  }
];

const LOCAL_KEY_ACCOUNTS = 'mock_banking_accounts_v1';
const LOCAL_KEY_TXNS = 'mock_banking_transactions_v1';
const LOCAL_KEY_USERS = 'mock_banking_users_v1';

export const getStoredUsers = () => {
  const data = localStorage.getItem(LOCAL_KEY_USERS);
  if (!data) {
    localStorage.setItem(LOCAL_KEY_USERS, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(data);
};

export const saveUsers = (users) => {
  localStorage.setItem(LOCAL_KEY_USERS, JSON.stringify(users));
};

export const getStoredAccounts = () => {
  const data = localStorage.getItem(LOCAL_KEY_ACCOUNTS);
  if (!data) {
    localStorage.setItem(LOCAL_KEY_ACCOUNTS, JSON.stringify(initialAccounts));
    return initialAccounts;
  }
  return JSON.parse(data);
};

export const saveAccounts = (accounts) => {
  localStorage.setItem(LOCAL_KEY_ACCOUNTS, JSON.stringify(accounts));
};

export const getStoredTransactions = () => {
  const data = localStorage.getItem(LOCAL_KEY_TXNS);
  if (!data) {
    localStorage.setItem(LOCAL_KEY_TXNS, JSON.stringify(initialTransactions));
    return initialTransactions;
  }
  return JSON.parse(data);
};

export const saveTransactions = (txns) => {
  localStorage.setItem(LOCAL_KEY_TXNS, JSON.stringify(txns));
};

export const mockStore = {
  registerUser: (userData) => {
    const users = getStoredUsers();
    const existing = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase());
    if (existing) {
      throw new Error(`Username "${userData.username}" is already registered`);
    }
    const newUser = {
      username: userData.username,
      password: userData.password,
      fullName: userData.fullName || userData.username,
      email: userData.email,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  },

  authenticateUser: (username, password) => {
    const users = getStoredUsers();
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!user) return null;
    return user;
  },

  getAccounts: (search = '') => {
    let list = getStoredAccounts();
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        a => a.accountNumber.toLowerCase().includes(q) ||
             a.holderName.toLowerCase().includes(q) ||
             a.email.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getAccount: (accNum) => {
    const list = getStoredAccounts();
    return list.find(a => a.accountNumber === accNum);
  },

  createAccount: (data) => {
    const list = getStoredAccounts();
    const newAcc = {
      id: Date.now(),
      accountNumber: 'ACC' + Math.floor(100000000 + Math.random() * 900000000),
      holderName: data.holderName,
      email: data.email,
      phoneNumber: data.phoneNumber || '+91 99999 88888',
      accountType: data.accountType || 'SAVINGS',
      balance: Number(data.initialBalance || data.balance || 0),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newAcc);
    saveAccounts(list);

    if (newAcc.balance > 0) {
      const txns = getStoredTransactions();
      txns.unshift({
        id: 'TXN' + Math.floor(10000000 + Math.random() * 90000000),
        accountNumber: newAcc.accountNumber,
        transactionType: 'DEPOSIT',
        amount: newAcc.balance,
        balanceAfter: newAcc.balance,
        description: 'Account Opening Initial Deposit',
        status: 'SUCCESS',
        createdAt: new Date().toISOString(),
      });
      saveTransactions(txns);
    }

    return newAcc;
  },

  updateAccountStatus: (accNum, status) => {
    const list = getStoredAccounts();
    const idx = list.findIndex(a => a.accountNumber === accNum);
    if (idx !== -1) {
      list[idx].status = status;
      saveAccounts(list);
      return list[idx];
    }
    throw new Error('Account not found');
  },

  deleteAccount: (accNum) => {
    let list = getStoredAccounts();
    list = list.filter(a => a.accountNumber !== accNum);
    saveAccounts(list);
  },

  deposit: ({ accountNumber, amount, description }) => {
    const accounts = getStoredAccounts();
    const acc = accounts.find(a => a.accountNumber === accountNumber);
    if (!acc) throw new Error('Account not found');
    if (acc.status === 'FROZEN') throw new Error('Account is frozen. Transactions prohibited.');

    const numAmt = Number(amount);
    acc.balance += numAmt;
    saveAccounts(accounts);

    const txns = getStoredTransactions();
    const newTxn = {
      id: 'TXN' + Math.floor(10000000 + Math.random() * 90000000),
      accountNumber,
      transactionType: 'DEPOSIT',
      amount: numAmt,
      balanceAfter: acc.balance,
      description: description || 'Cash / Online Deposit',
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    };
    txns.unshift(newTxn);
    saveTransactions(txns);
    return newTxn;
  },

  withdraw: ({ accountNumber, amount, description }) => {
    const accounts = getStoredAccounts();
    const acc = accounts.find(a => a.accountNumber === accountNumber);
    if (!acc) throw new Error('Account not found');
    if (acc.status === 'FROZEN') throw new Error('Account is frozen. Transactions prohibited.');

    const numAmt = Number(amount);
    if (acc.balance < numAmt) throw new Error(`Insufficient funds. Available balance: ₹${acc.balance.toLocaleString('en-IN')}`);

    acc.balance -= numAmt;
    saveAccounts(accounts);

    const txns = getStoredTransactions();
    const newTxn = {
      id: 'TXN' + Math.floor(10000000 + Math.random() * 90000000),
      accountNumber,
      transactionType: 'WITHDRAWAL',
      amount: numAmt,
      balanceAfter: acc.balance,
      description: description || 'Cash Withdrawal',
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    };
    txns.unshift(newTxn);
    saveTransactions(txns);
    return newTxn;
  },

  transfer: ({ fromAccountNumber, toAccountNumber, amount, description }) => {
    const accounts = getStoredAccounts();
    const source = accounts.find(a => a.accountNumber === fromAccountNumber);
    const target = accounts.find(a => a.accountNumber === toAccountNumber);

    if (!source) throw new Error('Source account not found');
    if (!target) throw new Error('Target account not found');
    if (source.status === 'FROZEN' || target.status === 'FROZEN') {
      throw new Error('Transaction rejected: One or both accounts are frozen.');
    }

    const numAmt = Number(amount);
    if (source.balance < numAmt) throw new Error(`Insufficient funds. Available balance: ₹${source.balance.toLocaleString('en-IN')}`);

    source.balance -= numAmt;
    target.balance += numAmt;
    saveAccounts(accounts);

    const txns = getStoredTransactions();
    const txn1 = {
      id: 'TXN' + Math.floor(10000000 + Math.random() * 90000000),
      accountNumber: fromAccountNumber,
      transactionType: 'TRANSFER_DEBIT',
      amount: numAmt,
      balanceAfter: source.balance,
      description: `Fund Transfer to ${toAccountNumber} - ${description || 'Transfer'}`,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    };
    const txn2 = {
      id: 'TXN' + Math.floor(10000000 + Math.random() * 90000000),
      accountNumber: toAccountNumber,
      transactionType: 'TRANSFER_CREDIT',
      amount: numAmt,
      balanceAfter: target.balance,
      description: `Fund Transfer from ${fromAccountNumber} - ${description || 'Transfer'}`,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    };

    txns.unshift(txn1, txn2);
    saveTransactions(txns);
    return [txn1, txn2];
  },

  getTransactions: ({ accountNumber, type, search }) => {
    let list = getStoredTransactions();
    if (accountNumber) {
      list = list.filter(t => t.accountNumber === accountNumber);
    }
    if (type) {
      list = list.filter(t => t.transactionType === type);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.id.toLowerCase().includes(q) || t.accountNumber.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return list;
  },

  getStats: () => {
    const accounts = getStoredAccounts();
    const txns = getStoredTransactions();

    const totalAccounts = accounts.length;
    const savingsAccounts = accounts.filter(a => a.accountType === 'SAVINGS').length;
    const currentAccounts = accounts.filter(a => a.accountType === 'CURRENT').length;
    const fdAccounts = accounts.filter(a => a.accountType === 'FIXED_DEPOSIT').length;

    const totalBalance = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

    const deposits = txns.filter(t => t.transactionType === 'DEPOSIT');
    const withdrawals = txns.filter(t => t.transactionType === 'WITHDRAWAL');

    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalAccounts,
      savingsAccounts,
      currentAccounts,
      fdAccounts,
      totalBalance,
      totalDeposits,
      totalDepositsCount: deposits.length,
      totalWithdrawals,
      totalWithdrawalsCount: withdrawals.length,
      totalTransactions: txns.length,
    };
  }
};
