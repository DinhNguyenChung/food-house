# Dockerfile (đặt trong server/)
FROM eclipse-temurin:17-jdk-alpine

# Tùy biến nếu bạn thay đổi tên JAR
ARG JAR_FILE=build/libs/*.jar

# Copy file jar đã build vào container
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
