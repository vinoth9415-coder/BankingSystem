@echo off
SET JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot
SET PATH=%JAVA_HOME%\bin;%PATH%
echo Starting Banking System Backend with Java 25...
java -version
mvnw.cmd spring-boot:run
pause
