# Lineup Generator Backend

Spring Boot API for the Lineup Generator application. Provides player search and formation data.

## Tech Stack

- Java 21
- Spring Boot 3.2.2
- Caffeine Cache
- Maven

## Local Development

```bash
# Build and run
./mvnw spring-boot:run

# Or build JAR
./mvnw clean package
java -jar target/lineup-generator-backend-1.0.0.jar
```

Server runs at `http://localhost:8080`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players/search` | Search players by name, team, or position |
| GET | `/api/formations` | Get all available formations |
| POST | `/api/export` | Export lineup as image |

### Search Players

```
GET /api/players/search?query=messi&limit=20
```

Query parameters:
- `query` - Search term (player name, team, nationality)
- `limit` - Max results (default: 20)
- `position` - Filter by position
- `team` - Filter by team

## Deploy to Render

### 1. Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select the repository

### 2. Configure Build Settings

| Setting | Value |
|---------|-------|
| Name | `lineup-generator-api` |
| Root Directory | `backend` |
| Runtime | `Docker` or `Java` |
| Build Command | `./mvnw clean package -DskipTests` |
| Start Command | `java -jar target/lineup-generator-backend-1.0.0.jar` |

### 3. Environment Variables

Add these environment variables in Render:

| Variable | Value |
|----------|-------|
| `PORT` | `10000` (Render assigns this) |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `LOG_LEVEL` | `INFO` |
| `JAVA_TOOL_OPTIONS` | `-Xmx512m` |

### 4. Using Docker (Recommended)

Create a `Dockerfile` (already included):

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 5. Health Check

Add health check path: `/api/players/search?query=test&limit=1`

## Project Structure

```
backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/lineupgenerator/
│       │       ├── config/         # CORS, Cache config
│       │       ├── controller/     # REST endpoints
│       │       ├── dto/            # Data transfer objects
│       │       ├── model/          # Domain models
│       │       └── service/        # Business logic
│       └── resources/
│           └── application.yml     # App configuration
└── pom.xml
```

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Server port |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Allowed CORS origins |
| `LOG_LEVEL` | `DEBUG` | Logging level |
