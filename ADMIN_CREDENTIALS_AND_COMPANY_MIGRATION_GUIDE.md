# 🔑 TechUGrow — Admin Credentials & Company Migration Master Guide

This master guide explains **how to change Admin Login Credentials in code** and provides a **step-by-step migration blueprint** for transitioning from your personal testing accounts to official company accounts (Domain, Email, Database, Server, and Hosting).

---

## 📑 TABLE OF CONTENTS
1. [How to Change Admin Email & Password](#1-how-to-change-admin-email--password)
   - [Method A: Changing Credentials via Code & Seed Script (Recommended)](#method-a-changing-credentials-via-code--seed-script-recommended)
   - [Method B: Changing Credentials via Admin Panel Settings](#method-b-changing-credentials-via-admin-panel-settings)
   - [Method C: Changing Credentials Directly in MongoDB Atlas](#method-c-changing-credentials-directly-in-mongodb-atlas)
2. [Step-by-Step Company Migration Guide (Personal Account ➡️ Official Company Accounts)](#2-step-by-step-company-migration-guide)
   - [Step 1: Domain & Official Business Email Setup (Google Workspace / Zoho)](#step-1-domain--official-business-email-setup)
   - [Step 2: Company MongoDB Atlas Database Setup](#step-2-company-mongodb-atlas-database-setup)
   - [Step 3: Company Cloudinary Media Account Setup](#step-3-company-cloudinary-media-account-setup)
   - [Step 4: Company Render Backend Deployment](#step-4-company-render-backend-deployment)
   - [Step 5: Company Vercel Frontend & Custom Domain Deployment](#step-5-company-vercel-frontend--custom-domain-deployment)
   - [Step 6: Company UptimeRobot 24/7 Keep-Alive Bot Setup](#step-6-company-uptimerobot-247-keep-alive-bot-setup)
   - [Step 7: Production Security Hardening Checklist](#step-7-production-security-hardening-checklist)

---

## 1. 🔑 How to Change Admin Email & Password

Currently, the system has **2 default Admin Accounts** configured in the seed database:
- **Email 1:** `hello@techugrow.com` | **Password:** `password123`
- **Email 2:** `admin@agency.com` | **Password:** `password123`

---

### Method A: Changing Credentials via Code & Seed Script (Recommended)

If you want to permanently change the admin email and password in the codebase so that running `node seed.js` seeds your new company credentials:

#### 1. Open `server/seed.js`
Navigate to lines **44-55** in [server/seed.js](file:///d:/Digital-tech-startup-web/server/seed.js#L44-L55):

```javascript
// 1. Create Admin Accounts
await Admin.create([
  {
    name: 'Super Admin',
    email: 'your_company_email@gmail.com', // 👈 Change your admin email here
    password: 'your_new_secure_password',   // 👈 Change your admin password here
    role: 'superadmin',
  }
]);
```

#### 2. Open `server/.env`
Navigate to line **7** in [server/.env](file:///d:/Digital-tech-startup-web/server/.env#L7):

```env
ADMIN_EMAIL=your_company_email@gmail.com
```

#### 3. Re-Seed Database
Run the following command in your terminal inside the `server` directory:

```bash
cd server
node seed.js
```

> **Note:** The backend automatically hashes passwords using `bcryptjs` upon saving to the database, ensuring 100% security.

---

### Method B: Changing Credentials Directly from Admin Panel UI (Easiest & Fastest)

We have built a dedicated **Admin Account Credentials Card** directly inside the Admin Panel!

1. Log in to your Admin Panel at `/admin/login` (e.g. `http://localhost:5173/admin` or `https://yourdomain.com/admin`).
2. Go to **General & Admin Settings** (`/admin/settings`).
3. Under the **🔐 Admin Account Credentials** card at the top:
   - Change your **Admin Login Email**.
   - Type your **Current Password**.
   - Type your **New Password** & **Confirm New Password**.
4. Click **Update Admin Credentials**.
5. *Result:* Your admin login email and password will be updated live in the database with `bcrypt` encryption!

---

### Method C: Changing Credentials Directly in MongoDB Atlas

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Database** -> **Browse Collections**.
3. Select database `techugrow` -> Collection `admins`.
4. Edit the target admin document:
   - Change `email` to your new email.
   - For password, if using manual edit, set the plain password or re-run `node seed.js`.

---

## 2. 🚀 Step-by-Step Company Migration Guide

When transitioning from your personal developer testing accounts to your **Official Company Accounts**, follow this 7-step deployment and handover sequence:

---

### Step 1: Domain & Official Business Email Setup
1. **Buy Company Custom Domain:** Register your domain (e.g., `techugrow.com`) on Namecheap, GoDaddy, or Cloudflare.
2. **Setup Official Email:** Setup Google Workspace or Zoho Mail for official emails (e.g., `hello@techugrow.com` / `contact@techugrow.com`).
3. **Generate Gmail App Password (For Email Alerts):**
   - Go to Google Account Security -> Enable **2-Step Verification**.
   - Search for **App Passwords**.
   - App Name: `TechUGrow Backend`.
   - Copy the generated 16-character code (e.g., `abcd efgh ijkl mnop`).
   - Paste into `server/.env`:
     ```env
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=hello@techugrow.com
     EMAIL_PASS=abcdefghijklmnop
     ```

---

### Step 2: Company MongoDB Atlas Database Setup
1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) using your company email (`hello@techugrow.com`).
2. Create a new **Free Shared Cluster (M0)** named `TechUGrow-Production`.
3. Under **Database Access**, create a user `company_admin` with a strong password.
4. Under **Network Access**, click **Add IP Address** -> Select `0.0.0.0/0` (Allow access from anywhere).
5. Copy connection string:
   ```
   mongodb+srv://company_admin:<password>@techugrow-prod.mongodb.net/techugrow?retryWrites=true&w=majority
   ```
6. Update `MONGO_URI` in `server/.env` and run `node seed.js` to initialize company data.

---

### Step 3: Company Cloudinary Media Account Setup
1. Create a free company account on [Cloudinary.com](https://cloudinary.com).
2. Go to Dashboard and copy:
   - `Cloud Name`
   - `API Key`
   - `API Secret`
3. Update `server/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=company_cloud_name
   CLOUDINARY_API_KEY=1234567890
   CLOUDINARY_API_SECRET=your_company_secret
   ```

---

### Step 4: Company Render Backend Deployment
1. Create a company account on [Render.com](https://render.com).
2. Connect your company **GitHub Organization / Repository**.
3. Create **New Web Service**:
   - **Name:** `techugrow-api`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. Add Environment Variables on Render:
   - `PORT` = `5000`
   - `MONGO_URI` = *Your Company MongoDB Connection String*
   - `JWT_SECRET` = *Your Strong 64-char Secret*
   - `CLIENT_URL` = `https://techugrow.com`
   - `ADMIN_EMAIL` = `hello@techugrow.com`
   - `WHATSAPP_NUMBER` = `8434890116`
   - `EMAIL_USER` = `hello@techugrow.com`
   - `EMAIL_PASS` = *Your Gmail 16-char App Password*
5. Copy Render URL (e.g. `https://techugrow-api.onrender.com`).

---

### Step 5: Company Vercel Frontend & Custom Domain Deployment
1. Create a company account on [Vercel.com](https://vercel.com).
2. Import project from GitHub.
3. Settings:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variable:** `VITE_API_URL` = `https://techugrow-api.onrender.com/api`
4. Click **Deploy**.
5. **Connect Custom Domain (`techugrow.com`):**
   - Go to Vercel Project -> Settings -> **Domains**.
   - Add `techugrow.com` and `www.techugrow.com`.
   - Update DNS records on your domain registrar (GoDaddy/Namecheap):
     - **A Record** (`@`) ➡️ `76.76.21.21`
     - **CNAME Record** (`www`) ➡️ `cname.vercel-dns.com`

---

### Step 6: Company UptimeRobot 24/7 Keep-Alive Bot Setup
Render free servers go to sleep after 15 mins of inactivity. Keep your company server 100% active 24/7:
1. Create account on [UptimeRobot.com](https://uptimerobot.com) under company email.
2. Click **+ Add New Monitor**.
3. Settings:
   - **Type:** `HTTP(s)`
   - **Friendly Name:** `TechUGrow 24/7 Keep-Alive Ping`
   - **URL:** `https://techugrow-api.onrender.com/health`
   - **Interval:** `5 minutes`
4. Save monitor. Now your backend server will never go to sleep!

---

### Step 7: Production Security Hardening Checklist

Before handing over to clients:
- [x] Change `JWT_SECRET` in `server/.env` and Render dashboard to a unique long random string.
- [x] Change default Admin Password from `password123` to a secure company password.
- [x] Verify CORS (`CLIENT_URL` on Render matches your exact `https://techugrow.com` frontend domain).
- [x] Re-seed production database using `node seed.js`.
- [x] Verify UptimeRobot ping receives `{ "status": "OK" }` response.

---
*Created for TechUGrow Digital Agency Operations* 🚀
