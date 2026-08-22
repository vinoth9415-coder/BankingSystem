package com.banking.system.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AccountDTO {

    private Long id;

    @NotBlank(message = "Account number is required")
    @Size(min = 6, max = 20, message = "Account number must be 6-20 characters")
    private String accountNumber;

    @NotBlank(message = "Account holder name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    private String holderName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter valid 10-digit Indian mobile number")
    private String mobile;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter valid email address")
    private String email;

    @NotBlank(message = "Address is required")
    private String address;

    @Pattern(regexp = "^\\d{12}$", message = "Aadhaar must be 12 digits")
    private String aadhaar;

    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN format (e.g., ABCDE1234F)")
    private String pan;

    private LocalDate dob;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Account type is required")
    private String accountType;

    @NotNull(message = "Initial deposit is required")
    @DecimalMin(value = "500.0", message = "Minimum initial deposit is ₹500")
    private BigDecimal balance;

    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // No-Args Constructor
    public AccountDTO() {
    }

    // All-Args Constructor
    public AccountDTO(Long id, String accountNumber, String holderName, String mobile, String email, String address,
                      String aadhaar, String pan, LocalDate dob, String gender, String accountType, BigDecimal balance,
                      boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.mobile = mobile;
        this.email = email;
        this.address = address;
        this.aadhaar = aadhaar;
        this.pan = pan;
        this.dob = dob;
        this.gender = gender;
        this.accountType = accountType;
        this.balance = balance;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAadhaar() {
        return aadhaar;
    }

    public void setAadhaar(String aadhaar) {
        this.aadhaar = aadhaar;
    }

    public String getPan() {
        return pan;
    }

    public void setPan(String pan) {
        this.pan = pan;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Builder pattern implementation
    public static AccountDTOBuilder builder() {
        return new AccountDTOBuilder();
    }

    public static class AccountDTOBuilder {
        private Long id;
        private String accountNumber;
        private String holderName;
        private String mobile;
        private String email;
        private String address;
        private String aadhaar;
        private String pan;
        private LocalDate dob;
        private String gender;
        private String accountType;
        private BigDecimal balance;
        private boolean active;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public AccountDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public AccountDTOBuilder accountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
            return this;
        }

        public AccountDTOBuilder holderName(String holderName) {
            this.holderName = holderName;
            return this;
        }

        public AccountDTOBuilder mobile(String mobile) {
            this.mobile = mobile;
            return this;
        }

        public AccountDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AccountDTOBuilder address(String address) {
            this.address = address;
            return this;
        }

        public AccountDTOBuilder aadhaar(String aadhaar) {
            this.aadhaar = aadhaar;
            return this;
        }

        public AccountDTOBuilder pan(String pan) {
            this.pan = pan;
            return this;
        }

        public AccountDTOBuilder dob(LocalDate dob) {
            this.dob = dob;
            return this;
        }

        public AccountDTOBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public AccountDTOBuilder accountType(String accountType) {
            this.accountType = accountType;
            return this;
        }

        public AccountDTOBuilder balance(BigDecimal balance) {
            this.balance = balance;
            return this;
        }

        public AccountDTOBuilder active(boolean active) {
            this.active = active;
            return this;
        }

        public AccountDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public AccountDTOBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public AccountDTO build() {
            return new AccountDTO(id, accountNumber, holderName, mobile, email, address, aadhaar, pan, dob, gender, accountType, balance, active, createdAt, updatedAt);
        }
    }
}
