# Production Deployment Guide (Vercel, Railway, Render)

This document provides instructions for deploying your secure contact form backend and connecting it with your frontend on `shivamraut.me`.

---

## 1. GitHub Security Checklist Before Deploying

1. **Verify `.gitignore`**:
   Ensure `.env` and `.env.*` are included in your `.gitignore` file before running `git add`.
   ```bash
   git status
   ```
   Confirm that `.env` never shows up under `Untracked files` or `Changes to be committed`.

2. **Commit only template files**:
   Always commit `.env.example` so other collaborators or deployment runners know the required keys without exposing real values.

3. **Verify Git History**:
   Ensure you haven't committed raw secrets previously. If you accidentally pushed a real Gmail App Password or Secret Key, immediately revoke it in your Google / reCAPTCHA account.

---

## 2. Option A: Deploying on Vercel

If your portfolio is hosted on Vercel, you can deploy the backend as a Serverless Function.

### Step 1: Add a Vercel Serverless Function
Create the file `api/contact.js` in your repository:
```javascript
// api/contact.js
import app from "../api-route.js";
export default app;
```

### Step 2: Configure Environment Variables in Vercel
1. Go to your **Vercel Dashboard** -> Select your Project -> **Settings** -> **Environment Variables**.
2. Add the following variables for **Production** and **Preview**:
   - `EMAIL_USER`: `shivamraut747@gmail.com`
   - `EMAIL_PASS`: `your_16_character_app_password`
   - `RECIPIENT_EMAIL`: `shivamraut747@gmail.com`
   - `RECAPTCHA_SECRET_KEY`: `your_google_recaptcha_secret_key`
   - `RECAPTCHA_MIN_SCORE`: `0.5`
   - `CLIENT_ORIGIN`: `https://shivamraut.me`
   - `NODE_ENV`: `production`

3. Redeploy your project. The endpoint will be live at `https://shivamraut.me/api/contact`.

---

## 3. Option B: Deploying on Railway

Railway is an ideal cloud platform for running persistent Express APIs with automated HTTPS.

### Step 1: Connect Repository
1. Log in to [Railway.app](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.

### Step 2: Set Environment Variables
1. Go to your service's **Variables** tab in Railway.
2. Add all keys from your `.env`:
   - `PORT`: `3001`
   - `NODE_ENV`: `production`
   - `CLIENT_ORIGIN`: `https://shivamraut.me`
   - `EMAIL_USER`: `shivamraut747@gmail.com`
   - `EMAIL_PASS`: `your_16_character_app_password`
   - `RECIPIENT_EMAIL`: `shivamraut747@gmail.com`
   - `RECAPTCHA_SECRET_KEY`: `your_google_recaptcha_secret_key`
   - `RECAPTCHA_MIN_SCORE`: `0.5`

### Step 3: Generate Public Domain
1. In the service **Settings** tab, scroll to **Networking** -> click **Generate Domain**.
2. Copy your new URL (e.g. `https://portfolio-contact-api.up.railway.app`).
3. In `contact-form.html`, update `API_ENDPOINT`:
   ```javascript
   const API_ENDPOINT = "https://portfolio-contact-api.up.railway.app/api/contact";
   ```

---

## 4. Option C: Deploying on Render

Render offers free web services suitable for Node.js APIs.

### Step 1: Create Web Service
1. Log in to [Render.com](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter

### Step 2: Add Environment Variables
Scroll to **Environment Variables** and add:
- `EMAIL_USER`: `shivamraut747@gmail.com`
- `EMAIL_PASS`: `your_16_character_app_password`
- `RECIPIENT_EMAIL`: `shivamraut747@gmail.com`
- `RECAPTCHA_SECRET_KEY`: `your_recaptcha_secret_key`
- `CLIENT_ORIGIN`: `https://shivamraut.me`
- `NODE_ENV`: `production`

### Step 3: Connect Frontend
Copy your assigned Render URL (e.g. `https://my-contact-api.onrender.com`) and update `API_ENDPOINT` in `contact-form.html`.

---

## 5. Post-Deployment Verification Checklist

- [ ] Submit a valid form on `shivamraut.me` and confirm email arrival in `shivamraut747@gmail.com`.
- [ ] Verify that invalid inputs show clear, accessible inline error messages.
- [ ] Test the honeypot field using cURL to ensure bots are stopped silently.
- [ ] Test rate limiting to confirm that brute-force attempts are blocked with HTTP `429`.
- [ ] Check server logs in your deployment dashboard to confirm that client IPs are masked (`192.168.1.xxx`) and no passwords or messages appear in plain text logs.
