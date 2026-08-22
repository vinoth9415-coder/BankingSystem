package com.banking.system.dto;

public class LoginResponse {
    private String token;
    private String tokenType = "Bearer";
    private String username;
    private String fullName;
    private String email;
    private String role;
    private long expiresIn;

    // No-Args Constructor
    public LoginResponse() {
    }

    // All-Args Constructor
    public LoginResponse(String token, String tokenType, String username, String fullName, String email, String role, long expiresIn) {
        this.token = token;
        this.tokenType = tokenType;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.expiresIn = expiresIn;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // Builder pattern implementation
    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public static class LoginResponseBuilder {
        private String token;
        private String tokenType = "Bearer";
        private String username;
        private String fullName;
        private String email;
        private String role;
        private long expiresIn;

        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public LoginResponseBuilder tokenType(String tokenType) {
            this.tokenType = tokenType;
            return this;
        }

        public LoginResponseBuilder username(String username) {
            this.username = username;
            return this;
        }

        public LoginResponseBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public LoginResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public LoginResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public LoginResponseBuilder expiresIn(long expiresIn) {
            this.expiresIn = expiresIn;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(token, tokenType, username, fullName, email, role, expiresIn);
        }
    }
}
