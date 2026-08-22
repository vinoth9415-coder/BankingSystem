package com.banking.system.service;

import com.banking.system.dto.DepositWithdrawRequest;
import com.banking.system.dto.TransactionDTO;
import com.banking.system.dto.TransferRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TransactionService {
    TransactionDTO deposit(DepositWithdrawRequest request);
    TransactionDTO withdraw(DepositWithdrawRequest request);
    List<TransactionDTO> transfer(TransferRequest request);
    Page<TransactionDTO> getAllTransactions(String accountNumber, String startDate, String endDate, Pageable pageable);
    List<TransactionDTO> getAccountTransactions(String accountNumber);
    List<TransactionDTO> getRecentTransactions(int limit);
}
