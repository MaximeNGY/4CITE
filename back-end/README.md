![logo supmap](./docs/images/logo-full-white.png)

# SUPMAP - Backend

Welcome to the **[SUPMAP Backend](https://github.com/SUPMAP-DELTA-FORCE/supmap-backend.git)** repository! This project contains the source code for our backend and RESTful API built with **NestJS**.

---

## 📖 About This Repository

This repository hosts the backend services designed to provide a seamless experience for the SUPMAP application. The backend is built using modern development practices with NestJS, ensuring scalability and maintainability.

Features include:

- **Mapbox Navigation API Integration**
- **Firebase Authentication**
- **Vercel blob storage ( for production )**
- **MinIO S3 emulation ( for local dev, mocks Vercel blob )**
- **PostgreSQL Database**

---

## ✅ Prerequisites

To run the project locally, make sure you have the following installed and configured:

1. **Node.js** (>= 22.x) and **npm** (>= 8.x)
2. **Docker** > [install docker](https://www.docker.com/products/docker-desktop/)
3. **NestJS CLI** (optional, for running NestJS commands)

   ```bash
   npm install -g @nestjs/cli # install Nestjs CLI globally
   ```

4. **Environment Variables**:
   Configure your `.env` file for sensitive credentials and runtime configuration.

---

## ⚙️ Environment Variables

Before starting, create a `.env` file in the root directory.  
This file contains all sensitive configuration values required for the project.  
You can request access to the secrets management system by contacting [supmap-deltaforce@proton.me](mailto:supmap-deltaforce@proton.me).

We use **Proton pass** to store and share sensitive secrets and .env files

```sh
cp .env.example .env
```

---

## 🚀 Run the Project Locally

Follow these steps to set up and run the backend locally:

1. **Clone the Repository**:

   ```bash
   git clone git@github.com:SUPMAP-DELTA-FORCE/supmap-backend.git
   cd supmap-backend
   ```

2. **Install Dependencies**:

   ```bash
   npm i
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and populate it with the correct values.

4. **Run the Micro services**:

   ```bash
   docker compose up -d
   ```

   **Verify the Services are running**:

   - PostgreSQL: Available at `localhost:5432`
   - MinIO: File Storage API available at `http://localhost:9000`
   - MongoDB: Available at `localhost:27017`
   - Zookeeper for Kafka : `localhost:2181`
   - Kafka : `localhost:9092`
   - Kafka web UI : `localhost:8080`

5. **Run the Application**:

   ```bash
   npm run start:dev
   ```

6. **Test the API**:
   The API should be running at `http://localhost:3000`.

---

## 🐳 Using Docker Compose

For a simplified local development environment, use Docker Compose to run dependencies like PostgreSQL and MinIO (Vercel Blob Storage Emulator).

1. **Start the Services**:

   ```bash
   docker compose up -d
   ```

2. **Verify Services**:

   - PostgreSQL: Available at `localhost:5432`
   - MinIO: File Storage API available at `http://localhost:9000`
   - MongoDB: Available at `localhost:27017`
   - Zookeeper for Kafka : `localhost:2181`
   - Kafka : `localhost:9092`
   - Kafka web UI : `localhost:8080`

3. **Stop Services**:
   When finished, stop the services:
   ```bash
   docker compose down
   ```

---

## 🏛️ Architecture design

For a better understanding of the Supmap architecture please read the [Architecture design overview](./docs/architecture/ARCHITECTURE.md)

## 📚 OpenAPI Documentation

after having sucessfully run the app, you can head to the `localhost:3000/api` to discover the OpenAPI specification

for production documentation please refer to [api.supmap.fr/api](https://api.supmap.fr/api)

## 🚀 About Deployment

This project is deployed on [Railway](https://railway.com)
Continuous deployment is enabled on the `main` branch of the github repository

We encourage you to make Pull requests on the project
Upon merge of you pull request to the `main` branch, your changes shall be automatically deployed to `api.supmap.fr`

## 🤝 Contributing

We welcome contributions to improve this project!  
Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute.

---

### 📝 Additional Notes

- For production deployment, ensure sensitive environment variables like `DATABASE_PASSWORD` and `JWT_SECRET` are securely managed using a secrets manager.
- Docker Compose services use default ports. Modify the `docker-compose.yml` file if you experience port conflicts.
- A Discord bot has been enabled to monitor the most important events relative to this repository. Join the [Discord channel](https://discord.gg/8jjrztYUTZ)
