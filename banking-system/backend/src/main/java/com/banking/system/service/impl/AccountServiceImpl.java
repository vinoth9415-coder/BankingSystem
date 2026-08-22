package com.banking.system.service.impl;

import com.banking.system.dto.AccountDTO;
import com.banking.system.dto.DashboardStats;
import com.banking.system.entity.Account;
import com.banking.system.exception.AccountNotFoundException;
import com.banking.system.exception.DuplicateAccountException;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.TransactionRepository;
import com.banking.system.service.AccountService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@Transactional
@SuppressWarnings("null")
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AccountServiceImpl(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public AccountDTO createAccount(AccountDTO dto) {
        if (accountRepository.existsByAccountNumber(dto.getAccountNumber())) {
            throw new DuplicateAccountException("Account number already exists: " + dto.getAccountNumber());
        }
        if (dto.getAadhaar() != null && accountRepository.existsByAadhaar(dto.getAadhaar())) {
            throw new DuplicateAccountException("Aadhaar number already registered");
        }
        if (dto.getPan() != null && accountRepository.existsByPan(dto.getPan())) {
            throw new DuplicateAccountException("PAN number already registered");
        }
        if (dto.getBalance() == null || dto.getBalance().compareTo(new BigDecimal("500")) < 0) {
            throw new IllegalArgumentException("Minimum initial deposit is ₹500");
        }

        Account account = mapToEntity(dto);
        Account saved = accountRepository.save(account);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountDTO getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));
        return mapToDTO(account);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AccountDTO> getAllAccounts(String search, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return accountRepository.searchAccounts(search.trim(), pageable).map(this::mapToDTO);
        }
        return accountRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    public AccountDTO updateAccount(String accountNumber, AccountDTO dto) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));

        account.setHolderName(dto.getHolderName());
        account.setMobile(dto.getMobile());
        account.setEmail(dto.getEmail());
        account.setAddress(dto.getAddress());
        account.setGender(dto.getGender());
        account.setAccountType(dto.getAccountType());
        if (dto.getDob() != null) account.setDob(dto.getDob());

        Account updated = accountRepository.save(account);
        return mapToDTO(updated);
    }

    @Override
    public void deleteAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));
        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new IllegalArgumentException("Cannot delete account with remaining balance of ₹" + account.getBalance() + ". Please withdraw all funds first.");
        }
        accountRepository.delete(account);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        long totalAccounts = accountRepository.count();
        long savingsAccounts = accountRepository.countByAccountType("SAVINGS");
        long currentAccounts = accountRepository.countByAccountType("CURRENT");
        BigDecimal totalBalance = accountRepository.getTotalBalance();
        BigDecimal totalDeposits = transactionRepository.getTotalDeposits();
        BigDecimal totalWithdrawals = transactionRepository.getTotalWithdrawals();
        long totalTransactions = transactionRepository.count();
        long depositCount = transactionRepository.countByTransactionType("DEPOSIT");
        long withdrawCount = transactionRepository.countByTransactionType("WITHDRAW");
        long transferCount = transactionRepository.countByTransactionType("TRANSFER_DEBIT");

        return DashboardStats.builder()
                .totalAccounts(totalAccounts)
                .savingsAccounts(savingsAccounts)
                .currentAccounts(currentAccounts)
                .totalBalance(totalBalance != null ? totalBalance : BigDecimal.ZERO)
                .totalDeposits(totalDeposits != null ? totalDeposits : BigDecimal.ZERO)
                .totalWithdrawals(totalWithdrawals != null ? totalWithdrawals : BigDecimal.ZERO)
                .totalTransactions(totalTransactions)
                .totalDepositsCount(depositCount)
                .totalWithdrawalsCount(withdrawCount)
                .totalTransfersCount(transferCount)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalAccounts() {
        return accountRepository.count();
    }

    private Account mapToEntity(AccountDTO dto) {
        return Account.builder()
                .accountNumber(dto.getAccountNumber())
                .holderName(dto.getHolderName())
                .mobile(dto.getMobile())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .aadhaar(dto.getAadhaar())
                .pan(dto.getPan())
                .dob(dto.getDob())
                .gender(dto.getGender())
                .accountType(dto.getAccountType())
                .balance(dto.getBalance())
                .active(true)
                .build();
    }

    private AccountDTO mapToDTO(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setHolderName(account.getHolderName());
        dto.setMobile(account.getMobile());
        dto.setEmail(account.getEmail());
        dto.setAddress(account.getAddress());
        dto.setAadhaar(account.getAadhaar());
        dto.setPan(account.getPan());
        dto.setDob(account.getDob());
        dto.setGender(account.getGender());
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setActive(account.isActive());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setUpdatedAt(account.getUpdatedAt());
        return dto;
    }
}
