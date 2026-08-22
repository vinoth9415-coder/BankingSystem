package com.banking.system.service;

import com.banking.system.dto.AccountDTO;
import com.banking.system.dto.DashboardStats;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccountService {
    AccountDTO createAccount(AccountDTO accountDTO);
    AccountDTO getAccountByNumber(String accountNumber);
    Page<AccountDTO> getAllAccounts(String search, Pageable pageable);
    AccountDTO updateAccount(String accountNumber, AccountDTO accountDTO);
    void deleteAccount(String accountNumber);
    DashboardStats getDashboardStats();
    long getTotalAccounts();
}
