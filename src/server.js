require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/database");
const { connectToRabbitMQ, setupQueues } = require("./messaging");
const logger = require("./config/logger");

// Initialize Express
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

// Initialize RabbitMQ connection and queues
const initializeRabbitMQ = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            await connectToRabbitMQ();
            await setupQueues();
            logger.info("RabbitMQ initialization completed");
            return true;
        } catch (error) {
            retries--;
            logger.error(
                `Failed to initialize RabbitMQ (${retries} retries left):`,
                error
            );
            if (retries === 0) {
                throw error;
            }
            // Wait for 5 seconds before retrying
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
};

const validateEnvironmentVariables = () => {
    const requiredVars = [
        "PORT",
        "MONGODB_URI",
        "JWT_SECRET",
        "SERVICE_SECRET",
        "RABBITMQ_URL",
        "USER_SERVICE_URL",
        "ORDER_SERVICE_URL",
        "EMAIL_HOST",
        "EMAIL_PORT",
        "EMAIL_USER",
        "EMAIL_PASS",
        "EMAIL_FROM",
    ];

    requiredVars.forEach((varName) => {
        if (!process.env[varName]) {
            logger.error(`Environment variable ${varName} is not set.`);
        }
    });
};
// Start the server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        logger.info("Connected to MongoDB");

        validateEnvironmentVariables();

        // Initialize RabbitMQ
        await initializeRabbitMQ();

        // Start HTTP server
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            logger.info(`Notification Service running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on("SIGTERM", async () => {
    logger.info("SIGTERM received, shutting down gracefully");
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;
