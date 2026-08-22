package com.banking.system;

import com.banking.system.entity.Admin;
import com.banking.system.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BankingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankingSystemApplication.class, args);
    }

    @Bean
    public CommandLineRunner initAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.findByUsername("admin").isEmpty()) {
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setEmail("admin@bankingsystem.com");
                admin.setFullName("System Administrator");
                admin.setRole("admin");
                adminRepository.save(admin);
                System.out.println("✅ Default admin created: username=admin, password=Admin@123");
            }
            if (adminRepository.findByUsername("vinoth").isEmpty()) {
                Admin user = new Admin();
                user.setUsername("vinoth");
                user.setPassword(passwordEncoder.encode("Vinoth@123"));
                user.setEmail("vinoth@bankingsystem.com");
                user.setFullName("Vinoth Kumar");
                user.setRole("user");
                adminRepository.save(user);
                System.out.println("✅ Default user created: username=vinoth, password=Vinoth@123");
            }
        };
    }
}
