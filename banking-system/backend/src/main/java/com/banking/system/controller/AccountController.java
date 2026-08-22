package com.banking.system.controller;

import com.banking.system.dto.AccountDTO;
import com.banking.system.dto.ApiResponse;
import com.banking.system.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountDTO>> createAccount(@Valid @RequestBody AccountDTO accountDTO) {
        AccountDTO created = accountService.createAccount(accountDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AccountDTO>>> getAllAccounts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<AccountDTO> accounts = accountService.getAllAccounts(search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Accounts fetched successfully", accounts));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<AccountDTO>> getAccount(@PathVariable String accountNumber) {
        AccountDTO account = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account found", account));
    }

    @PutMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<AccountDTO>> updateAccount(
            @PathVariable String accountNumber,
            @RequestBody AccountDTO accountDTO) {
        AccountDTO updated = accountService.updateAccount(accountNumber, accountDTO);
        return ResponseEntity.ok(ApiResponse.success("Account updated successfully", updated));
    }

    @DeleteMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable String accountNumber) {
        accountService.deleteAccount(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getTotalAccounts() {
        return ResponseEntity.ok(ApiResponse.success("Total accounts", accountService.getTotalAccounts()));
    }
}
