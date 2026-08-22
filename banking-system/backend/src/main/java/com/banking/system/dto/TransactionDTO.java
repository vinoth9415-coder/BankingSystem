package com.banking.system.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDTO {
    private Long id;
    private String accountNumber;
    private String transactionType;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String description;
    private String relatedAccount;
    private LocalDateTime createdAt;

    // No-Args Constructor
    public TransactionDTO() {
    }

    // All-Args Constructor
    public TransactionDTO(Long id, String accountNumber, String transactionType, BigDecimal amount, BigDecimal balanceAfter,
                          String description, String relatedAccount, LocalDateTime createdAt) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.transactionType = transactionType;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.description = description;
        this.relatedAccount = relatedAccount;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getBalanceAfter() {
        return balanceAfter;
    }

    public void setBalanceAfter(BigDecimal balanceAfter) {
        this.balanceAfter = balanceAfter;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRelatedAccount() {
        return relatedAccount;
    }

    public void setRelatedAccount(String relatedAccount) {
        this.relatedAccount = relatedAccount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Builder pattern implementation
    public static TransactionDTOBuilder builder() {
        return new TransactionDTOBuilder();
    }

    public static class TransactionDTOBuilder {
        private Long id;
        private String accountNumber;
        private String transactionType;
        private BigDecimal amount;
        private BigDecimal balanceAfter;
        private String description;
        private String relatedAccount;
        private LocalDateTime createdAt;

        public TransactionDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TransactionDTOBuilder accountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
            return this;
        }

        public TransactionDTOBuilder transactionType(String transactionType) {
            this.transactionType = transactionType;
            return this;
        }

        public TransactionDTOBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public TransactionDTOBuilder balanceAfter(BigDecimal balanceAfter) {
            this.balanceAfter = balanceAfter;
            return this;
        }

        public TransactionDTOBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TransactionDTOBuilder relatedAccount(String relatedAccount) {
            this.relatedAccount = relatedAccount;
            return this;
        }

        public TransactionDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public TransactionDTO build() {
            return new TransactionDTO(id, accountNumber, transactionType, amount, balanceAfter, description, relatedAccount, createdAt);
        }
    }
}
