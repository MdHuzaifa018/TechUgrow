# TechUGrow — Comprehensive Project Handoff & Documentation

> **Note for AI Assistant & Developer:** This document contains the full context, branding configuration, database setup, UI/UX changes, and running instructions for the **TechUGrow** MERN Stack project. Read this file whenever resuming work on this codebase.

---

## 🚀 1. Project Overview & Rebranding Context

* **Brand Name:** **TechUGrow** (formerly DigitalizeU)
* **Tagline:** AI-Powered Growth Systems for Modern Brands
* **Official Contact Email:** `hello@techugrow.com`
* **Architecture:** Full-Stack MERN (MongoDB, Express.js, React + Vite, Node.js)
* **Design & Styling:** Tailwind CSS, Framer Motion, Lucide React Icons, Next-Themes (Light/Dark Mode).

---

## 📁 2. Tech Stack & Directory Structure

```
Digital-tech-startup-web/
├── client/                     # React + Vite Frontend
│   ├── components/             # Reusable UI components (Navbar, Footer, Logo, etc.)
│   ├── sections/               # Homepage Sections (Hero, Services, Founders, Team, Packages, etc.)
│   ├── src/
│   │   ├── pages/              # Main Page routes & Admin Panel pages (/admin/*)
│   │   ├── api.js              # Axios API Client configured for http://localhost:5000/api
│   │   └── App.jsx             # Main router configuration
│   └── index.html              # Site Title & SEO Meta Tags (TechUGrow)
└── server/                     # Express + Node.js Backend API
    ├── config/db.js            # MongoDB Mongoose Connection
    ├── models/                 # Schemas (Service, Package, Founder, Team, Gallery, SiteSetting, Lead, etc.)
    ├── routes/                 # Express API routes
    ├── seed.js                 # Initial DB Seed Script (Admin, Services, Packages, Site Settings)
    ├── seed_extra.js           # Extra DB Seed Script (Founders, Team, Gallery)
    └── index.js                # Server entry point (Runs on Port 5000)
```

---

## 🎨 3. Key Completed Features & Recent Improvements

### A. Rebranding to "TechUGrow"
* Global replace of `DIGITALIZEU` / `digitalizeu.com` to `TechUGrow` / `techugrow.com`.
* Updated site `<title>` & metadata in `client/index.html`.
* Updated default models & seed scripts (`server/models/SiteSetting.js`, `server/seed.js`, `server/seed_extra.js`).
* Updated email notification sender in `server/utils/notifications.js`.

### B. Founder & Leadership Section Refinements (`client/sections/Founders.jsx`)
* **Photo Centering:** Image CSS updated from `object-top` to `object-center` so founder faces are perfectly centered in card frames.
* **Shadow Removal:** Removed heavy dark slate shadow overlay (`from-slate-950/90`), replaced with an ultra-soft subtle gradient (`from-black/50 to-transparent`) so photo colors stay vibrant in both Light & Dark modes.

### C. Services Section Improvements (`client/sections/Services.jsx`)
* **Light Mode Icon Visibility Fixed:** Created an explicit `gradientMap` and `textGradientMap` lookup to prevent Tailwind CSS dynamic utility class purging. Added solid fallback `bg-blue-600` so all 11 service icons remain brightly visible on white backgrounds.
* **GSAP ScrollTrigger Pinned Horizontal Scroll (100% the-snag.vercel.app identical architecture):** Integrated GSAP `ScrollTrigger` with `pin: true` in `client/sections/Services.jsx`. Locks vertical page scrolling completely while cards slide horizontally from right to left (`x: -getScrollAmount()`). Eliminates all blank/waste screen area by releasing the pin immediately when the last card appears.

### D. Packages Section & Badges (`client/sections/Packages.jsx` & `client/src/pages/admin/Packages.jsx`)
* Resolved badge cutoff issue on homepage cards by adjusting overflow boundaries.
* Relocated the "Popular" badge in the Admin Panel inline with the card title to prevent overlapping with Edit/Delete action buttons.

### F. Modern Capability & Stack Marquee (`client/sections/TrustedBy.jsx`)
* Replaced generic template logo cards with an ultra-modern dual-row infinite scrolling marquee (the-snag style).
* **Row 1 (Capabilities):** `META ADS` • `VIDEO PRODUCTION` • `FUNNEL AUTOMATION` • `UI/UX DESIGN` • `SEO` (Scrolls Left).
### G. Complete 12 Services List (Website Services at Starting 1 & 2)
* **Backend Database Seeding:** Updated `server/seed.js` with all 12 services from the design mockup:
  1. `Website Development` (Order 1 - Modern & High-Converting Websites)
  2. `Website Management` (Order 2 - Hassle-Free Maintenance)
  3. `AI Automation` (Order 3)
  4. `UI/UX Design` (Order 4)
  5. `Meta Ads` (Order 5)
  6. `Search Engine Optimization` (Order 6)
  7. `Content Writing` (Order 7)
  8. `Lead Generation` (Order 8)
  9. `International Projects` (Order 9)
  10. `Video Editing` (Order 10)
  11. `Brand Video Ads` (Order 11)
  12. `Podcast Editing` (Order 12)
* **Services Page Route (`client/components/Navbar.jsx`):** Updated Navbar link and dropdown items target route from anchor `/#services` to dedicated `/services` page route.

### J. 3-Tiered Pricing Packages Restored (`server/seed.js` & `client/sections/Packages.jsx`)
* Re-seeded database with 3 full tiered packages in Indian Rupees (₹ INR): `Starter` @ ₹19,999/mo, `Premium (Most Popular)` @ ₹49,999/mo, `Enterprise` @ ₹99,999/mo. Fixed badge clipping by enforcing single-line `whitespace-nowrap` text and clean top offset centering.

### L. Contact Form Sync to Admin Contacts Tab (`server/routes/contacts.js` & `client/src/pages/Contact.jsx`)
* Updated `/contact` page form submissions to post to `/api/contacts`.
### P. Master Hiring, Salary Benchmark & Interview Blueprint ([AGENCY_HIRING_INTERVIEW_AND_SALARY_GUIDE.md](file:///d:/Digital-tech-startup-web/AGENCY_HIRING_INTERVIEW_AND_SALARY_GUIDE.md))
* Created an in-depth agency owner playbook for recruiting, vetting, interviewing, and compensating talent across all 12 services.
* Included realistic freelancer project payouts (in ₹ INR & $ USD), monthly salary ranges, technical screening questions, and quality control checklists for agency owners.

---

## 🛠️ 4. How to Run the Application Locally

### 1. Start Backend Server (Node.js & MongoDB)
```bash
cd server
node index.js
```
* Runs on: `http://localhost:5000`
* Health Check: `http://localhost:5000/` -> returns `{"message": "TechUGrow API is running 🚀"}`

### 2. Start Frontend Dev Server (React + Vite)
```bash
cd client
npm run dev
```
* Runs on: `http://localhost:5173`

### 3. Re-seed Database (Optional / Reset Data)
```bash
cd server
node seed.js
node seed_extra.js
```

---

## 🔐 5. Default Credentials & Settings

* **Super Admin Login:** `admin@agency.com` / `password123`
* **Admin Route:** `http://localhost:5173/admin`
* **Default WhatsApp Number:** `919876543210`

---

## 📌 6. Note for Next Session

When you open a new session tomorrow, simply ask the AI assistant to refer to `PROJECT_SUMMARY.md` in the project root folder. All history, brand settings, and structure will be instantly available!
