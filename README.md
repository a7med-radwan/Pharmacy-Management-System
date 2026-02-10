# Pharmacy Management System

A comprehensive Pharmacy Management System built with Node.js, Express, and MongoDB. This system helps manage drug inventory, including primary and alternative drugs, and ensures secure access through JWT authentication.

## Features

-   **User Authentication**: Secure login and registration using JWT (JSON Web Tokens).
-   **Drug Management**:
    -   Add, update, delete, and view drugs.
    -   Manage primary and alternative drugs.
    -   Link alternative drugs to primary drugs.
-   **RESTful API**: Well-structured API endpoints for frontend integration.
-   **MVC Architecture**: Clean code structure using Model-View-Controller pattern.
-   **Validation**: Input validation using Joi.

## Prerequisites

Before running this project, make sure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/YOUR_USERNAME/pharmacy-management-system.git
    cd pharmacy-management-system
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

    *Note: Replace `your_mongodb_connection_string` and `your_jwt_secret_key` with your actual credentials.*

4.  **Run the application:**

    ```bash
    npm start
    ```

    The server will start on `http://localhost:3000`.

## API Endpoints

(Add a brief list of key endpoints here if available, e.g., `/api/auth/login`, `/api/drugs`, etc.)

## Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB, Mongoose (if used, or native driver)
-   **Authentication**: JSON Web Token (JWT), bcryptjs
-   **Validation**: Joi
-   **Utilities**: dotenv, nodemon

## Author

**Ahmed Radwan** 

## License

This project is licensed under the ISC License.
