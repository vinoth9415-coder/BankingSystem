package com.banking.system.repository;

import com.banking.system.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    boolean existsByAccountNumber(String accountNumber);

    boolean existsByAadhaar(String aadhaar);

    boolean existsByPan(String pan);

    boolean existsByEmail(String email);

    @Query("SELECT a FROM Account a WHERE " +
           "LOWER(a.holderName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "a.accountNumber LIKE CONCAT('%', :search, '%') OR " +
           "a.mobile LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(a.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Account> searchAccounts(@Param("search") String search, Pageable pageable);

    @Query("SELECT SUM(a.balance) FROM Account a")
    BigDecimal getTotalBalance();

    @Query("SELECT COUNT(a) FROM Account a WHERE a.accountType = :type")
    long countByAccountType(@Param("type") String type);
}
