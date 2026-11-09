# Local Deployment Manual

Follow these exact steps to run the application code locally from your terminal environment.

## Getting Started Locally
1. Extract the submission root folder contents.
2. Open your terminal application and execute package collection:
   ```bash
   npm install
   ```
3. Initialize and activate the application host environment:
   ```bash
   node server.js
   ```
4. Access the working dashboard interfaces at: http://localhost:3000

## Environment Architecture Keys Required
* `PORT=3000`
* `DATABASE_URL=sqlite://pharmacy.db`

## Pre-Configured Reviewer Login Test Accounts
* **Patient User Dashboard View:**
  * **Email:** patient@test.com
  * **Password:** password123
* **Pharmacist Control Deck View:**
  * **Email:** pharmacist@test.com
  * **Password:** password123
