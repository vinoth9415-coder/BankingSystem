package com.banking.system.controller;

import com.banking.system.dto.ApiResponse;
import com.banking.system.dto.DashboardStats;
import com.banking.system.dto.TransactionDTO;
import com.banking.system.service.AccountService;
import com.banking.system.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final AccountService accountService;
    private final TransactionService transactionService;

    public DashboardController(AccountService accountService, TransactionService transactionService) {
        this.accountService = accountService;
        this.transactionService = transactionService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getStats() {
        DashboardStats stats = accountService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched", stats));
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit) {
        List<TransactionDTO> transactions = transactionService.getRecentTransactions(limit);
        return ResponseEntity.ok(ApiResponse.success("Recent transactions fetched", transactions));
    }
}
