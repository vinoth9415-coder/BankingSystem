package com.banking.system.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Value("${spring.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.username:noreply@bank.com}")
    private String fromEmail;

    @Async
    public void sendTransactionEmail(String toEmail, String holderName, String transactionType,
                                      BigDecimal amount, BigDecimal balance, String accountNumber) {
        if (!mailEnabled) {
            log.info("Email disabled. Skipping notification to {}", toEmail);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🏦 Transaction Alert - SecureBank");
            message.setText(String.format(
                """
                Dear %s,

                A %s transaction has been processed on your account.

                Account Number: %s
                Transaction Type: %s
                Amount: ₹%.2f
                Available Balance: ₹%.2f

                If you did not authorize this transaction, please contact us immediately.

                Thank you for banking with SecureBank.

                Best Regards,
                SecureBank Team
                """,
                holderName, transactionType, accountNumber,
                transactionType, amount, balance
            ));
            mailSender.send(message);
            log.info("Transaction email sent to {}", toEmail);
        } catch (org.springframework.mail.MailException e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }
}
