package com.banking.system.service.impl;

import com.banking.system.dto.DepositWithdrawRequest;
import com.banking.system.dto.TransactionDTO;
import com.banking.system.dto.TransferRequest;
import com.banking.system.entity.Account;
import com.banking.system.entity.Transaction;
import com.banking.system.exception.AccountNotFoundException;
import com.banking.system.exception.InsufficientBalanceException;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.TransactionRepository;
import com.banking.system.service.EmailService;
import com.banking.system.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class TransactionServiceImpl implements TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionServiceImpl.class);
    private static final BigDecimal MINIMUM_BALANCE = new BigDecimal("500");

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final EmailService emailService;

    public TransactionServiceImpl(AccountRepository accountRepository, TransactionRepository transactionRepository, EmailService emailService) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.emailService = emailService;
    }

    @Override
    public TransactionDTO deposit(DepositWithdrawRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + request.getAccountNumber()));

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero");
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .accountNumber(account.getAccountNumber())
                .transactionType("DEPOSIT")
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .description("Cash deposit of ₹" + request.getAmount())
                .build();

        Transaction saved = transactionRepository.save(transaction);

        // Send email notification asynchronously
        emailService.sendTransactionEmail(account.getEmail(), account.getHolderName(),
                "DEPOSIT", request.getAmount(), account.getBalance(), account.getAccountNumber());

        log.info("Deposit of {} to account {} successful", request.getAmount(), account.getAccountNumber());
        return mapToDTO(saved);
    }

    @Override
    public TransactionDTO withdraw(DepositWithdrawRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + request.getAccountNumber()));

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be greater than zero");
        }

        BigDecimal balanceAfterWithdrawal = account.getBalance().subtract(request.getAmount());
        if (balanceAfterWithdrawal.compareTo(MINIMUM_BALANCE) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient balance. Current balance: ₹" + account.getBalance() +
                    ". Minimum balance of ₹500 must be maintained.");
        }

        account.setBalance(balanceAfterWithdrawal);
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .accountNumber(account.getAccountNumber())
                .transactionType("WITHDRAW")
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .description("Cash withdrawal of ₹" + request.getAmount())
                .build();

        Transaction saved = transactionRepository.save(transaction);

        emailService.sendTransactionEmail(account.getEmail(), account.getHolderName(),
                "WITHDRAWAL", request.getAmount(), account.getBalance(), account.getAccountNumber());

        log.info("Withdrawal of {} from account {} successful", request.getAmount(), account.getAccountNumber());
        return mapToDTO(saved);
    }

    @Override
    public List<TransactionDTO> transfer(TransferRequest request) {
        if (request.getFromAccountNumber().equals(request.getToAccountNumber())) {
            throw new IllegalArgumentException("Sender and receiver account numbers cannot be same");
        }

        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Sender account not found: " + request.getFromAccountNumber()));

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Receiver account not found: " + request.getToAccountNumber()));

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be greater than zero");
        }

        BigDecimal fromBalanceAfter = fromAccount.getBalance().subtract(request.getAmount());
        if (fromBalanceAfter.compareTo(MINIMUM_BALANCE) < 0) {
            throw new InsufficientBalanceException(
                    "Insufficient balance. Current balance: ₹" + fromAccount.getBalance() +
                    ". Minimum balance of ₹500 must be maintained.");
        }

        fromAccount.setBalance(fromBalanceAfter);
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        Transaction debitTx = Transaction.builder()
                .accountNumber(fromAccount.getAccountNumber())
                .transactionType("TRANSFER_DEBIT")
                .amount(request.getAmount())
                .balanceAfter(fromAccount.getBalance())
                .description("Transfer to account " + toAccount.getAccountNumber())
                .relatedAccount(toAccount.getAccountNumber())
                .build();

        Transaction creditTx = Transaction.builder()
                .accountNumber(toAccount.getAccountNumber())
                .transactionType("TRANSFER_CREDIT")
                .amount(request.getAmount())
                .balanceAfter(toAccount.getBalance())
                .description("Transfer from account " + fromAccount.getAccountNumber())
                .relatedAccount(fromAccount.getAccountNumber())
                .build();

        Transaction savedDebit = transactionRepository.save(debitTx);
        Transaction savedCredit = transactionRepository.save(creditTx);

        emailService.sendTransactionEmail(fromAccount.getEmail(), fromAccount.getHolderName(),
                "TRANSFER DEBIT", request.getAmount(), fromAccount.getBalance(), fromAccount.getAccountNumber());
        emailService.sendTransactionEmail(toAccount.getEmail(), toAccount.getHolderName(),
                "TRANSFER CREDIT", request.getAmount(), toAccount.getBalance(), toAccount.getAccountNumber());

        log.info("Transfer of {} from {} to {} successful", request.getAmount(),
                fromAccount.getAccountNumber(), toAccount.getAccountNumber());

        return List.of(mapToDTO(savedDebit), mapToDTO(savedCredit));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionDTO> getAllTransactions(String accountNumber, String startDate, String endDate, Pageable pageable) {
        LocalDateTime start = startDate != null && !startDate.isBlank()
                ? LocalDateTime.parse(startDate + "T00:00:00") : null;
        LocalDateTime end = endDate != null && !endDate.isBlank()
                ? LocalDateTime.parse(endDate + "T23:59:59") : null;
        String acc = accountNumber != null && !accountNumber.isBlank() ? accountNumber : null;

        return transactionRepository.findWithFilters(acc, start, end, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionDTO> getAccountTransactions(String accountNumber) {
        accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountNumber));
        return transactionRepository.findByAccountNumberOrderByCreatedAtDesc(accountNumber)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionDTO> getRecentTransactions(int limit) {
        return transactionRepository.findRecentTransactions(PageRequest.of(0, limit))
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private TransactionDTO mapToDTO(Transaction t) {
        return TransactionDTO.builder()
                .id(t.getId())
                .accountNumber(t.getAccountNumber())
                .transactionType(t.getTransactionType())
                .amount(t.getAmount())
                .balanceAfter(t.getBalanceAfter())
                .description(t.getDescription())
                .relatedAccount(t.getRelatedAccount())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
