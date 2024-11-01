# Cuvette Job Posting Board API

This is the backend API for the Job Posting Board project, developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). It enables companies to register, verify their accounts via email and SMS, post job listings, and send job-related emails to candidates automatically.

## Features

- **User Registration (Company)**
  - Companies can register by providing basic details.
  - Verifications via OTP for both email and phone are required before posting jobs.
- **Company Login**
  - Secure JWT-based authentication for login.
- **Job Posting**
  - Authenticated companies can post jobs, specifying job title, description, experience level, candidates’ emails, and application deadlines.
- **Automated Email Notifications**
  - Automated emails are sent to candidates with job details using Nodemailer.
- **Logout**
  - JWT-based authentication with token expiration for enhanced security.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Automation**: Nodemailer, Vonage (for SMS OTP)
- **Environment Variables**: dotenv for environment management

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
    EMAIL_USER=your_nodemailer_SMTP_email
    EMAIL_PASS=your_nodemailer_SMTP_password
    VONAGE_API_KEY=your_vonage_api_key
    VONAGE_API_SECRET=your_vonage_api_secret
   ```
4. Start the development server:
   ```bash
   node index.js
   ```
5. The API will be running at http://localhost:5000

## Folder Structure

- **index.js:** Entry point for the Express server.
- **models/:** Mongoose models defining the schemas for Company and Job.
- **routes/:** Contains route handlers for registration, verification, job posting, and automation.
- **utils/:** Utility files for token generation, OTP handling, and validation.
- **.env:** Environment variables file (should be created manually and not included in the repository).

## API Endpoints

- **Authentication Routes**

  - **POST /auth/register** - Register a new company.
  - **POST /auth/verify-email-otp** - Verify email OTP.
  - **POST /auth/verify-phone-otp** - Verify phone OTP.
  - **POST /auth/login** - Resend OTP or login after successful registration.
  - **POST /auth/refresh-token** - Generate a new access token.

- **Job Routes**

  - **POST /jobs/post-job** - Post a new job.
  - **GET /jobs/company-jobs** - Retrieve all jobs posted by the authenticated company.

## Author

- Yassin Slati
