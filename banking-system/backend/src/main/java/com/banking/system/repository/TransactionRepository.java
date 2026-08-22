package com.banking.system.repository;

import com.banking.system.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByAccountNumber(String accountNumber, Pageable pageable);

    List<Transaction> findByAccountNumberOrderByCreatedAtDesc(String accountNumber);

    @Query("SELECT t FROM Transaction t WHERE " +
           "(:accountNumber IS NULL OR t.accountNumber = :accountNumber) AND " +
           "(:startDate IS NULL OR t.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR t.createdAt <= :endDate)")
    Page<Transaction> findWithFilters(
            @Param("accountNumber") String accountNumber,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.transactionType = 'DEPOSIT'")
    BigDecimal getTotalDeposits();

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.transactionType = 'WITHDRAW'")
    BigDecimal getTotalWithdrawals();

    @Query("SELECT t FROM Transaction t ORDER BY t.createdAt DESC")
    List<Transaction> findRecentTransactions(Pageable pageable);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.transactionType = :type")
    long countByTransactionType(@Param("type") String type);
}
