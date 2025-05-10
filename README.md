# Notification Service

A microservice component of the E-Commerce platform responsible for handling order and payment-related notifications.

## Overview

The Notification Service processes events from the Order and Payment services and delivers notifications through email:

-   Order creation notifications
-   Order status update notifications
-   Order cancellation notifications
-   Payment success notifications
-   Payment failure notifications

## Prerequisites

-   Node.js 14 or higher
-   MongoDB 4.4 or higher
-   RabbitMQ 3.8 or higher
-   Docker and Docker Compose
-   Kubernetes cluster (for production)

## Quick Start

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-org/notification-service.git
    cd notification-service
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**
   Create a `.env` file:

    ```env
    PORT=8085
    MONGODB_URI=mongodb://localhost:27017/notificationdb
    RABBITMQ_URL=amqp://localhost:5672
    USER_SERVICE_URL=http://localhost:8081
    ORDER_SERVICE_URL=http://localhost:8083
    EMAIL_SERVICE=smtp
    EMAIL_HOST=smtp.mailtrap.io
    EMAIL_PORT=2525
    EMAIL_USER=your_mailtrap_user
    EMAIL_PASS=your_mailtrap_password
    EMAIL_FROM=noreply@ecommerce.com
    ```

4. **Start the Service**

    ```bash
    # Development
    npm run dev

    # Production
    npm start
    ```

## API Documentation

### Notification Endpoints

-   `GET /api/notifications` - Get all notifications (requires authentication)
-   `PUT /api/notifications/:id/read` - Mark a notification as read
-   `DELETE /api/notifications/:id` - Delete a notification
-   `GET /api/notifications/unread/count` - Get count of unread notifications
-   `GET /api/notifications/admin/stats` - Get notification statistics (admin only)

### Event Types

The service listens for the following events from RabbitMQ:

-   `order.created`: Sends order confirmation notification
-   `order.updated`: Sends order status update notification
-   `order.cancelled`: Sends order cancellation notification
-   `payment.successful`: Sends payment success notification
-   `payment.failed`: Sends payment failure notification

## Monitoring

-   Health check endpoint: `/health`
-   RabbitMQ connection status
-   Email service status
-   Notification delivery status
-   Error tracking and monitoring

## Troubleshooting

### Common Issues

1. RabbitMQ Connection Issues

    - Check RabbitMQ URL configuration
    - Verify RabbitMQ service is running
    - Check network connectivity

2. Email Service Issues

    - Verify SMTP configuration
    - Check email service credentials
    - Monitor email delivery status

3. Service Communication Issues
    - Verify User Service URL configuration
    - Verify Order Service URL configuration
    - Check service connectivity
