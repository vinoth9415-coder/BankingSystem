package com.banking.system.dto;

import java.math.BigDecimal;

public class DashboardStats {
    private long totalAccounts;
    private long savingsAccounts;
    private long currentAccounts;
    private BigDecimal totalBalance;
    private BigDecimal totalDeposits;
    private BigDecimal totalWithdrawals;
    private long totalTransactions;
    private long totalDepositsCount;
    private long totalWithdrawalsCount;
    private long totalTransfersCount;

    // No-Args Constructor
    public DashboardStats() {
    }

    // All-Args Constructor
    public DashboardStats(long totalAccounts, long savingsAccounts, long currentAccounts, BigDecimal totalBalance,
                          BigDecimal totalDeposits, BigDecimal totalWithdrawals, long totalTransactions,
                          long totalDepositsCount, long totalWithdrawalsCount, long totalTransfersCount) {
        this.totalAccounts = totalAccounts;
        this.savingsAccounts = savingsAccounts;
        this.currentAccounts = currentAccounts;
        this.totalBalance = totalBalance;
        this.totalDeposits = totalDeposits;
        this.totalWithdrawals = totalWithdrawals;
        this.totalTransactions = totalTransactions;
        this.totalDepositsCount = totalDepositsCount;
        this.totalWithdrawalsCount = totalWithdrawalsCount;
        this.totalTransfersCount = totalTransfersCount;
    }

    // Getters and Setters
    public long getTotalAccounts() {
        return totalAccounts;
    }

    public void setTotalAccounts(long totalAccounts) {
        this.totalAccounts = totalAccounts;
    }

    public long getSavingsAccounts() {
        return savingsAccounts;
    }

    public void setSavingsAccounts(long savingsAccounts) {
        this.savingsAccounts = savingsAccounts;
    }

    public long getCurrentAccounts() {
        return currentAccounts;
    }

    public void setCurrentAccounts(long currentAccounts) {
        this.currentAccounts = currentAccounts;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    public BigDecimal getTotalDeposits() {
        return totalDeposits;
    }

    public void setTotalDeposits(BigDecimal totalDeposits) {
        this.totalDeposits = totalDeposits;
    }

    public BigDecimal getTotalWithdrawals() {
        return totalWithdrawals;
    }

    public void setTotalWithdrawals(BigDecimal totalWithdrawals) {
        this.totalWithdrawals = totalWithdrawals;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public long getTotalDepositsCount() {
        return totalDepositsCount;
    }

    public void setTotalDepositsCount(long totalDepositsCount) {
        this.totalDepositsCount = totalDepositsCount;
    }

    public long getTotalWithdrawalsCount() {
        return totalWithdrawalsCount;
    }

    public void setTotalWithdrawalsCount(long totalWithdrawalsCount) {
        this.totalWithdrawalsCount = totalWithdrawalsCount;
    }

    public long getTotalTransfersCount() {
        return totalTransfersCount;
    }

    public void setTotalTransfersCount(long totalTransfersCount) {
        this.totalTransfersCount = totalTransfersCount;
    }

    // Builder pattern implementation
    public static DashboardStatsBuilder builder() {
        return new DashboardStatsBuilder();
    }

    public static class DashboardStatsBuilder {
        private long totalAccounts;
        private long savingsAccounts;
        private long currentAccounts;
        private BigDecimal totalBalance;
        private BigDecimal totalDeposits;
        private BigDecimal totalWithdrawals;
        private long totalTransactions;
        private long totalDepositsCount;
        private long totalWithdrawalsCount;
        private long totalTransfersCount;

        public DashboardStatsBuilder totalAccounts(long totalAccounts) {
            this.totalAccounts = totalAccounts;
            return this;
        }

        public DashboardStatsBuilder savingsAccounts(long savingsAccounts) {
            this.savingsAccounts = savingsAccounts;
            return this;
        }

        public DashboardStatsBuilder currentAccounts(long currentAccounts) {
            this.currentAccounts = currentAccounts;
            return this;
        }

        public DashboardStatsBuilder totalBalance(BigDecimal totalBalance) {
            this.totalBalance = totalBalance;
            return this;
        }

        public DashboardStatsBuilder totalDeposits(BigDecimal totalDeposits) {
            this.totalDeposits = totalDeposits;
            return this;
        }

        public DashboardStatsBuilder totalWithdrawals(BigDecimal totalWithdrawals) {
            this.totalWithdrawals = totalWithdrawals;
            return this;
        }

        public DashboardStatsBuilder totalTransactions(long totalTransactions) {
            this.totalTransactions = totalTransactions;
            return this;
        }

        public DashboardStatsBuilder totalDepositsCount(long totalDepositsCount) {
            this.totalDepositsCount = totalDepositsCount;
            return this;
        }

        public DashboardStatsBuilder totalWithdrawalsCount(long totalWithdrawalsCount) {
            this.totalWithdrawalsCount = totalWithdrawalsCount;
            return this;
        }

        public DashboardStatsBuilder totalTransfersCount(long totalTransfersCount) {
            this.totalTransfersCount = totalTransfersCount;
            return this;
        }

        public DashboardStats build() {
            return new DashboardStats(totalAccounts, savingsAccounts, currentAccounts, totalBalance, totalDeposits, totalWithdrawals,
                                      totalTransactions, totalDepositsCount, totalWithdrawalsCount, totalTransfersCount);
        }
    }
}
