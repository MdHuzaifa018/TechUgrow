# 🚀 TechUGrow — Ultimate A-to-Z Step-by-Step Setup, Customization & Deployment Master Guide

This document is the **100% complete, definitive master blueprint** for building, configuring, deploying, and maintaining the **TechUGrow Digital Agency** full-stack web application from scratch to live production.

---

## 📑 TABLE OF CONTENTS
1. [Step 1: Prerequisites & Required Tools](#step-1-prerequisites--required-tools)
2. [Step 2: MongoDB Atlas Cloud Database Setup](#step-2-mongodb-atlas-cloud-database-setup)
3. [Step 3: Cloudinary Account & API Credentials Setup (For Image Uploads)](#step-3-cloudinary-account--api-credentials-setup)
4. [Step 4: Gmail SMTP App Password Setup (For Automated Email Alerts)](#step-4-gmail-smtp-app-password-setup)
5. [Step 5: JWT Secret & Complete Environment Variables Configuration](#step-5-jwt-secret--complete-environment-variables-configuration)
6. [Step 6: Local Installation, Dependencies & Database Seeding](#step-6-local-installation-dependencies--database-seeding)
7. [Step 7: GitHub Repository Setup Strategy (Single Monorepo vs Dual Repos)](#step-7-github-repository-setup-strategy)
8. [Step 8: Backend Deployment to Render.com (Click-by-Click)](#step-8-backend-deployment-to-rendercom)
9. [Step 9: 24/7 Keep-Alive Bot Setup (Prevent Render Sleep Mode)](#step-9-247-keep-alive-bot-setup)
10. [Step 10: Frontend Deployment to Vercel.com (Click-by-Click)](#step-10-frontend-deployment-to-vercelcom)
11. [Step 11: Custom Domain Setup & CORS Security Alignment](#step-11-custom-domain-setup--cors-security-alignment)
12. [Step 12: Post-Deployment Verification & Admin Panel Handover](#step-12-post-deployment-verification--admin-panel-handover)

---

## Step 1: Prerequisites & Required Tools

Before starting, make sure you have created/installed the following free accounts & tools:
- **Node.js (v18 or higher):** [https://nodejs.org](https://nodejs.org)
- **Git Command Line:** [https://git-scm.com](https://git-scm.com)
- **GitHub Account:** [https://github.com](https://github.com)
- **MongoDB Atlas Account:** [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account:** [https://cloudinary.com](https://cloudinary.com)
- **Render.com Account:** [https://render.com](https://render.com)
- **Vercel.com Account:** [https://vercel.com](https://vercel.com)
- **UptimeRobot Account:** [https://uptimerobot.com](https://uptimerobot.com)

---

## Step 2: MongoDB Atlas Cloud Database Setup

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create a Deployment** -> Select **M0 Free Shared Cluster**.
3. Select a cloud provider region (e.g. AWS / Singapore or Frankfurt).
4. Under **Security Quickstart** -> **Database Access**:
   - Create a database user (e.g. User: `techadmin`, Password: `YourSecurePassword123`).
   - Click **Create Database User**.
5. Under **Network Access**:
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Click **Confirm**. *(Crucial so Render backend server can connect).*
6. Go back to **Database** tab -> Click **Connect** -> Select **Drivers** (Node.js).
7. Copy your connection string:
   ```
   mongodb+srv://techadmin:<password>@cluster0.hndhqrk.mongodb.net/techugrow?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your database password, and make sure `/techugrow` is set as the database name).*

---

## Step 3: Cloudinary Account & API Credentials Setup

Cloudinary handles all dynamic image uploads (Admin Panel logo uploads, Founder profile pictures, Team photos, and Blog images).

1. Sign up for a free account at [Cloudinary.com](https://cloudinary.com).
2. Log in to your Cloudinary **Dashboard**.
3. Look at the **Product Environment Credentials** box on the dashboard home:
   - Copy **Cloud Name** (e.g., `techugrow_cloud`)
   - Copy **API Key** (e.g., `123456789012345`)
   - Copy **API Secret** (e.g., `abcde_fghijk_lmnopqrstuvwxyz`)
4. Save these 3 values — you will paste them in your `server/.env` file.

---

## Step 4: Gmail SMTP App Password Setup

When a client submits a form on your website, the backend sends an instant email notification to your inbox.

1. Log in to your Google Account (e.g. `hello@techugrow.com` or your Gmail).
2. Go to [Google Account Security Settings](https://myaccount.google.com/security).
3. Ensure **2-Step Verification** is turned **ON**.
4. In the top search bar inside Google Security, search for **"App Passwords"**.
5. Click **App Passwords**:
   - **App Name:** `TechUGrow Agency Backend`
   - Click **Create**.
6. Google will generate a **16-character code** (e.g., `abcd efgh ijkl mnop`).
7. Save this 16-character code — this is your `EMAIL_PASS`.

---

## Step 5: JWT Secret & Complete Environment Variables Configuration

A **JWT Secret** is a private cryptographic string used to sign admin session tokens securely.

### Generating a Secure JWT Secret
You can use any long random string (min 32 chars). Example:
`JWT_SECRET=techugrow_super_secret_jwt_token_key_2026_x89q2m`

---

### 📄 Complete `server/.env` File Template

Create a file named `.env` inside your `server/` directory:

```env
# Server Port
PORT=5000

# Database Connection (MongoDB Atlas)
MONGO_URI=mongodb+srv://techadmin:YourPassword123@cluster0.mongodb.net/techugrow?retryWrites=true&w=majority

# JWT Token Security Secret Key & Expiration
JWT_SECRET=techugrow_super_secret_jwt_token_key_2026_x89q2m
JWT_EXPIRE=30d

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Admin Email & WhatsApp Number
ADMIN_EMAIL=hello@techugrow.com
WHATSAPP_NUMBER=8434890116

# Optional Gmail Automated Notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=hello@techugrow.com
EMAIL_PASS=abcdefghijklmnop

# Frontend Origin URL (For Local & Production CORS)
CLIENT_URL=http://localhost:5173
```

---

### 📄 Complete `client/.env` File Template

Create a file named `.env` inside your `client/` directory:

```env
# Local API URL (For Local Development)
VITE_API_URL=http://localhost:5000/api
```

*(Note: When deploying on Vercel, `VITE_API_URL` will be set to your Render backend URL).*

---

## Step 6: Local Installation, Dependencies & Database Seeding

Open your terminal or command prompt:

```bash
# 1. Navigate to project directory
cd d:/Digital-tech-startup-web

# 2. Install Backend Dependencies
cd server
npm install

# 3. Seed Database (Populates Admin, Services, Packages, Founders, Team, Blogs)
node seed.js

# 4. Install Frontend Dependencies
cd ../client
npm install

# 5. Start Backend Server (Terminal 1)
cd ../server
node index.js
# Output: 🚀 Server running on port 5000 | ✅ MongoDB Connected

# 6. Start Frontend App (Terminal 2)
cd ../client
npm run dev
# Output: 🚀 Local: http://localhost:5173/
```

---

## Step 7: GitHub Repository Setup Strategy

You have **two options** when pushing your code to GitHub before deployment:

### 🌟 OPTION A: Single GitHub Repository (Recommended & Easiest — Monorepo)
Keep both `client/` and `server/` inside one single GitHub repository.

#### Advantages:
- Single repository management, zero overhead.
- One-click `git push` updates both Frontend & Backend simultaneously.
- **Render.com** & **Vercel.com** both natively support Monorepos via Root Directory setting (`server` for Render, `client` for Vercel).

#### Commands for Single Repository Push:
```bash
cd d:/Digital-tech-startup-web
git init
git add .
git commit -m "Complete TechUGrow Agency Fullstack Project"
git remote add origin https://github.com/your-username/techugrow-fullstack.git
git branch -M main
git push -u origin main
```

---

### 📂 OPTION B: Two Separate GitHub Repositories (Dual Repos)
Push `client/` and `server/` to two independent GitHub repositories (`techugrow-frontend` and `techugrow-backend`).

#### Commands for Backend Repository (`techugrow-backend`):
```bash
cd d:/Digital-tech-startup-web/server
git init
git add .
git commit -m "TechUGrow Backend Server API"
git remote add origin https://github.com/your-username/techugrow-backend.git
git branch -M main
git push -u origin main
```

#### Commands for Frontend Repository (`techugrow-frontend`):
```bash
cd d:/Digital-tech-startup-web/client
git init
git add .
git commit -m "TechUGrow Frontend Web Client"
git remote add origin https://github.com/your-username/techugrow-frontend.git
git branch -M main
git push -u origin main
```

---

## Step 8: Backend Deployment to Render.com (Click-by-Click)

1. Push your project code to **GitHub**.
2. Log in to [Render.com](https://render.com).
3. Click **New +** (Top Right) -> Select **Web Service**.
4. Click **Build and deploy from a Git repository** -> Connect your GitHub repository.
5. Fill out the service configuration:
   - **Name:** `techugrow-backend`
   - **Region:** `Singapore` (or region closest to your users)
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** `Free`
6. Scroll down to **Environment Variables** -> Click **Add Environment Variable**:
   | Key | Value |
   | :--- | :--- |
   | `PORT` | `5000` |
   | `MONGO_URI` | `mongodb+srv://.../techugrow?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `techugrow_super_secret_jwt_token_key_2026_x89q2m` |
   | `JWT_EXPIRE` | `30d` |
   | `CLOUDINARY_CLOUD_NAME` | *your_cloud_name* |
   | `CLOUDINARY_API_KEY` | *your_api_key* |
   | `CLOUDINARY_API_SECRET` | *your_api_secret* |
   | `ADMIN_EMAIL` | `hello@techugrow.com` |
   | `WHATSAPP_NUMBER` | `8434890116` |
   | `EMAIL_USER` | `hello@techugrow.com` |
   | `EMAIL_PASS` | *your_16_char_app_password* |
   | `CLIENT_URL` | `https://techugrow.vercel.app` (or your domain) |
7. Click **Create Web Service**.
8. Render will compile and deploy your backend. Once completed, copy your backend URL:
   `https://techugrow-backend.onrender.com`

---

## Step 9: 24/7 Keep-Alive Bot Setup (Prevent Render Sleep Mode)

Render's free tier automatically goes into **sleep mode after 15 minutes of inactivity**, causing the next visitor to experience a 30-50 second delay ("cold start"). 

To solve this, we use an automated **24/7 Keep-Alive Ping Bot** that sends a lightweight request to your backend's `/health` endpoint every 5-10 minutes.

---

### 🌟 METHOD 1: UptimeRobot.com (100% Free & Most Reliable — Recommended)

1. Sign up for a free account at [UptimeRobot.com](https://uptimerobot.com).
2. Go to your Dashboard -> Click **+ Add New Monitor** (top left).
3. Configure the monitor fields exactly as follows:
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `TechUGrow 24/7 Server Bot`
   - **URL (or IP):** `https://techugrow-backend.onrender.com/health`
   - **Monitoring Interval:** `Every 5 minutes`
4. Click **Create Monitor**.
5. *Result:* UptimeRobot automatically sends an HTTP GET request to your backend `/health` endpoint every 5 minutes 24/7/365. Your Render server will **NEVER sleep** and will respond to website visitors in ~0.2 seconds!

---

### 🔄 METHOD 2: Cron-Job.org (100% Free Backup Method)

If you prefer Cron-Job.org:
1. Sign up at [cron-job.org](https://cron-job.org).
2. Click **Members** -> **Cronjobs** -> **Create Cronjob**.
3. Configure:
   - **Title:** `TechUGrow Keep Alive`
   - **URL:** `https://techugrow-backend.onrender.com/health`
   - **Execution schedule:** `Every 5 minutes`
4. Click **Create**.

---

## Step 10: Frontend Deployment to Vercel.com (Click-by-Click)

1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> Select **Project**.
3. Import your GitHub repository.
4. Configure Project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit to `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Expand **Environment Variables**:
   - `VITE_API_URL` = `https://techugrow-backend.onrender.com/api`
6. Click **Deploy**.
7. Vercel will build your React application in ~30 seconds and provide your live URL:
   `https://techugrow.vercel.app`

---

## Step 11: Custom Domain Setup & CORS Security Alignment

### Connecting Custom Domain on Vercel
1. Buy domain on GoDaddy / Namecheap (e.g. `techugrow.com`).
2. In Vercel Project Dashboard -> Go to **Settings** -> **Domains**.
3. Add `techugrow.com` and `www.techugrow.com`.
4. Update DNS Records at your domain registrar:
   - **A Record:** Host `@` ➡️ Value `76.76.21.21`
   - **CNAME Record:** Host `www` ➡️ Value `cname.vercel-dns.com`

### Aligning Render CORS Security
In Render Dashboard -> Go to `techugrow-backend` -> Environment Variables:
- Update `CLIENT_URL` = `https://techugrow.com`

---

## Step 12: Post-Deployment Verification & Admin Panel Handover

1. **Verify Backend Health Endpoint:**
   Open `https://techugrow-backend.onrender.com/health` in browser. Should return: `{"status":"OK"}`.
2. **Verify Admin Login:**
   Open `https://techugrow.vercel.app/admin` in browser:
   - Email: `hello@techugrow.com` (or `admin@agency.com`)
   - Password: `password123`
3. **Verify Hide/Show Password Toggle:**
   Click the Eye 👁️ icon on login and settings page to toggle visibility.
4. **Verify Dynamic File Uploads:**
   Go to Admin Panel -> **Settings** or **Services**, test image URL or logo upload.
5. **Verify Public Forms & WhatsApp Redirection:**
   Fill Contact form on website -> Check if toast popup displays, lead appears in `/admin/leads`, and browser redirects to WhatsApp!

---

*Master Deployment Guide Created & Maintained for TechUGrow Digital Agency* 🚀
