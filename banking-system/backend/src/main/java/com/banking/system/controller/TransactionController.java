package com.banking.system.controller;

import com.banking.system.dto.*;
import com.banking.system.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<TransactionDTO>> deposit(
            @Valid @RequestBody DepositWithdrawRequest request) {
        TransactionDTO result = transactionService.deposit(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Deposit successful", result));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<TransactionDTO>> withdraw(
            @Valid @RequestBody DepositWithdrawRequest request) {
        TransactionDTO result = transactionService.withdraw(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Withdrawal successful", result));
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> transfer(
            @Valid @RequestBody TransferRequest request) {
        List<TransactionDTO> result = transactionService.transfer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transfer successful", result));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransactionDTO>>> getAllTransactions(
            @RequestParam(required = false) String accountNumber,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<TransactionDTO> transactions = transactionService.getAllTransactions(accountNumber, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success("Transactions fetched", transactions));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getAccountTransactions(
            @PathVariable String accountNumber) {
        List<TransactionDTO> transactions = transactionService.getAccountTransactions(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account transactions fetched", transactions));
    }

    @GetMapping("/recent/{limit}")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getRecentTransactions(
            @PathVariable int limit) {
        List<TransactionDTO> transactions = transactionService.getRecentTransactions(limit);
        return ResponseEntity.ok(ApiResponse.success("Recent transactions fetched", transactions));
    }
}
