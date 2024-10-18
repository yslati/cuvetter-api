# Cuvette Job Posting Board API

This is the backend for the Job Posting Board project, built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows companies to register, verify their accounts via email, post job openings, and send automated job-related emails to candidates.

## Features

- **User Registration (Company)**
  - Companies can register by providing basic details.
  - Email verification is required for account activation.
- **Company Login**
  - Login system using JWT authentication.
- **Job Posting**
  - Authenticated companies can create job postings.
- **Email Automation**
  - Companies can send automated job alerts or updates to candidates via email.
- **Logout**
  - JWT-based authentication with token expiration for security.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Automation**: Nodemailer
- **Environment Variables**: Managed using dotenv

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yslati/cuvetter-api.git
   cd cuvette-api
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the root directory and add the following variables:
   ```bash
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   EMAIL_USER=nodemailer_SMTP_email
   EMAIL_PASS=nodemailer_SMTP_password
   ```
4. Start the development server:
   ```bash
   node index.js
   ```
5. The API will be running at http://localhost:5000

## Folder Structure

- **index.js:** Entry point for the Express server.
- **models/:** Contains Mongoose models for MongoDB.
- **routes/:** Contains route handlers for authentication, job posting, etc.
- **.env:** Environment variables (not included in the repository, should be created manually).

## Author

- Yassin Slati
