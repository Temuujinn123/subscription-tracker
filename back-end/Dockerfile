version: '3.8'

services:
  # Redis
  redis:
    image: redis:7-alpine
    container_name: subscription-tracker-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network
    restart: unless-stopped

  # PostgreSQL
  postgres:
    image: postgres:15
    container_name: subscription-tracker-db
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: subscription_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d subscription_tracker"]
      interval: 30s
      timeout: 10s
      retries: 5

  # Backend API
  backend:
    build: ./backend
    container_name: subscription-tracker-backend
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=admin
      - DB_PASSWORD=password
      - DB_NAME=subscription_tracker
      - DB_SSLMODE=disable
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_CACHE_TTL=3600
    depends_on:
      - postgres
      - redis
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge