# Local Setup & Configuration Guide

This guide walks you through setting up the 8-layer secure contact form backend and frontend on your local development machine.

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- A **Google / Gmail Account** with 2-Step Verification enabled.

---

## 2. Installation

1. Open your terminal in the directory where `package.json` is located:
   ```bash
   cd contact-form-package
   ```

2. Install all required production and development dependencies:
   ```bash
   npm install
   ```

---

## 3. Gmail App Password Setup (For Nodemailer)

Google requires an **App Password** to send emails via SMTP securely without exposing your main Google Account password.

1. Go to your **Google Account**: [https://myaccount.google.com/](https://myaccount.google.com/)
2. Navigate to the **Security** tab on the left.
3. Under **How you sign in to Google**, verify that **2-Step Verification** is turned ON.
4. Search for or navigate directly to **App Passwords**: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
5. Enter an App Name (e.g. `Portfolio Contact Form`) and click **Create**.
6. Google displays a **16-character code** (e.g. `dkxo hwir kdzr rlzs`).
7. Copy this password and strip all spaces: `dkxohwirkdzrrlzs`.

---

## 4. Google reCAPTCHA v3 Setup (Invisible Bot Protection)

1. Open the **Google reCAPTCHA Admin Console**: [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Click the **+ (Create)** button in the top right.
3. Fill out the registration form:
   - **Label**: `Shivam Raut Portfolio`
   - **reCAPTCHA type**: Choose **Score based (v3)**
   - **Domains**:
     - `shivamraut.me`
     - `localhost` (for testing locally)
     - `127.0.0.1`
4. Accept the Terms of Service and click **Submit**.
5. Copy your **Site Key** (Public) and **Secret Key** (Private).

---

## 5. Environment Variables Configuration

1. Create a `.env` file from the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your real credentials:
   ```env
   PORT=3001
   NODE_ENV=development
   CLIENT_ORIGIN=http://localhost:3000

   VITE_RECAPTCHA_SITE_KEY=your_actual_public_site_key
   RECAPTCHA_SECRET_KEY=your_actual_private_secret_key
   RECAPTCHA_MIN_SCORE=0.5

   EMAIL_USER=shivamraut747@gmail.com
   EMAIL_PASS=your_16_character_gmail_app_password
   RECIPIENT_EMAIL=shivamraut747@gmail.com
   ```

3. In `contact-form.html`, replace `YOUR_RECAPTCHA_SITE_KEY` with your actual public Site Key:
   - Line 13 in the `<script>` tag.
   - Line 310 in the JavaScript configuration.

---

## 6. Running Locally

1. Start the backend API server with auto-reload:
   ```bash
   npm run dev
   ```
   You should see:
   ```
   [INFO] Secure Contact Form API running on http://localhost:3001
   ```

2. Open `contact-form.html` in your browser:
   - Either open directly with Live Server in VS Code, or:
   - Serve using `npx serve .`

---

## 7. Testing Security Layers via cURL / Terminal

### A. Test Successful Submission
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Shivam Raut","email":"shivamraut747@gmail.com","message":"Hello! This is a test message to verify email dispatch."}'
```
**Expected response**: `200 OK`
```json
{"success":true,"message":"Thank you! Your message has been sent successfully."}
```

### B. Test Honeypot Trap (Bot Simulation)
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot Spammer","email":"bot@spam.com","message":"Buy casino chips online!","website":"http://spam-link.com"}'
```
**Expected response**: `200 OK` (Silently consumed, no email sent)

### C. Test Input Validation Rejection
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"invalid-email","message":"short"}'
```
**Expected response**: `400 Bad Request` with field error breakdown.

### D. Test Rate Limiting
Run the test command 6 times consecutively. On the 6th attempt:
**Expected response**: `429 Too Many Requests`
```json
{"success":false,"error":"Too many contact requests from this IP. Please retry in 60 minutes."}
```
