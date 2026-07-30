# 🛡️ RBAC Implementation Plan — TechUGrow Admin Panel

## Overview

Existing codebase pe **zero breaking changes** karte hue ek professional RBAC system add karna hai. Current state: `Admin` model mein `role: 'admin' | 'superadmin'` already hai, basic `protect` + `restrictTo` middleware hai, aur Settings page mein basic `isSuperAdmin` guard hai.

**Goal:** Complete, production-grade RBAC system jo granular permission toggles, Audit Logs, Admin Management page, dynamic sidebar, aur 403 guard page provide kare.

---

## What's Already Working (Preserve 100%)

- Dashboard, Leads, Services, Packages, Blogs, Founders, Team, Gallery, Testimonials, Contacts, SEO Settings, General Settings
- JWT Authentication flow (login, register, `/me`, `update-profile`)
- `protect` + `restrictTo('superadmin')` middleware
- Basic role badge display in AdminLayout header
- Multi-admin create/delete (Super Admin only)

---

## User Review Required

> [!IMPORTANT]
> **Admin Management Page** will be a completely new route `/admin/admin-management` — sidebar mein only Super Admins ko dikhega.

> [!IMPORTANT]
> **Audit Logs Page** will be a new route `/admin/audit-logs` — only Super Admins ko accessible hoga.

> [!WARNING]
> **Admin schema extend kiya jaayega** (existing schema ko replace nahi, sirf fields add): `permissions`, `status`, `department`, `phone`, `profileImage`, `lastLogin`, `createdBy`. Existing `name`, `email`, `password`, `avatar`, `role`, `timestamps` sab unchanged rahenge.

> [!WARNING]
> **AuditLog** ek naya separate Mongoose model/collection hoga (`AuditLog`). Existing collections untouched.

> [!CAUTION]
> Existing API routes ke HTTP methods aur URLs bilkul nahi badlenge. Sirf permission-checking middleware **add** hogi, existing behavior preserve rahega.

---

## Open Questions

None — requirements completely clear hain, implementation direct hai.

---

## Proposed Changes

### A. Database Layer

---

#### [MODIFY] [Admin.js](file:///d:/Digital-tech-startup-web/server/models/Admin.js)

Existing fields `name, email, password, avatar, role, timestamps` **unchanged**. Sirf new fields append:

```
+ status: { type: String, enum: ['active', 'suspended'], default: 'active' }
+ department: { type: String, default: '' }
+ phone: { type: String, default: '' }
+ profileImage: { type: String, default: '' }   // alias for avatar for consistency
+ lastLogin: { type: Date }
+ createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null }
+ permissions: {
    dashboard:   { type: Boolean, default: true },
    leads:       { type: Boolean, default: true },
    contacts:    { type: Boolean, default: true },
    blogs:       { type: Boolean, default: true },
    services:    { type: Boolean, default: true },
    packages:    { type: Boolean, default: true },
    gallery:     { type: Boolean, default: true },
    testimonials:{ type: Boolean, default: true },
    team:        { type: Boolean, default: true },
    founders:    { type: Boolean, default: true },
    seo:         { type: Boolean, default: true },
    analytics:   { type: Boolean, default: false },  // Admin = false default
    settings:    { type: Boolean, default: false },  // Admin = false default
    adminManagement: { type: Boolean, default: false },
    backup:      { type: Boolean, default: false },
    security:    { type: Boolean, default: false },
    billing:     { type: Boolean, default: false },
  }
```

---

#### [NEW] [AuditLog.js](file:///d:/Digital-tech-startup-web/server/models/AuditLog.js)

New mongoose model for tracking all important actions:
```
{ admin, adminName, adminRole, action, resource, resourceId,
  oldValue, newValue, ipAddress, userAgent, timestamp }
```

---

### B. Backend Middleware

---

#### [MODIFY] [middleware/auth.js](file:///d:/Digital-tech-startup-web/server/middleware/auth.js)

Add 2 new middleware functions (existing `protect` + `restrictTo` unchanged):

**`checkPermission(permissionKey)`** — Admin ka `permissions[key]` check karta hai. Super Admin ko automatically pass karta hai.

**`logAudit(action, resource)`** — Route handler ke baad audit log DB mein save karta hai. Request info (IP, user-agent) automatically capture karta hai.

**`checkSuspended()`** — Login ke baad har request mein admin status check karta hai. Suspended admin ka token reject hoga.

---

### C. Backend Routes

---

#### [MODIFY] [routes/auth.js](file:///d:/Digital-tech-startup-web/server/routes/auth.js)

1. **POST `/login`** — `lastLogin` field update karo login pe. `status: 'suspended'` check karo, 403 return karo.
2. **GET `/admins`** — Pagination, search, filter support add karo (`?page=1&limit=10&search=xyz&role=admin&status=active`).
3. **POST `/admins`** — Naye fields accept karo: `department`, `phone`, `status`, `permissions`. `createdBy` set karo current admin ID.
4. **PUT `/admins/:id`** — [NEW endpoint] Edit admin (name, email, department, phone, status, role, permissions). Super Admin only.
5. **POST `/admins/:id/reset-password`** — [NEW endpoint] Super Admin kisi bhi admin ka password reset kar sake.
6. **PUT `/admins/:id/suspend`** — [NEW endpoint] Toggle suspend/activate.
7. **GET `/audit-logs`** — [NEW route file] Super Admin only. Pagination + filters.

---

#### [MODIFY] Existing Route Files (Add Permission Middleware)

**Minimal, additive change only — existing behavior unchanged:**

| Route | DELETE endpoint | New Middleware Added |
|-------|----------------|----------------------|
| `routes/leads.js` | `DELETE /:id` | `checkPermission('leads')` on GET/PUT; `restrictTo('superadmin')` on DELETE |
| `routes/contacts.js` | `DELETE /:id` | `restrictTo('superadmin')` on DELETE |
| `routes/blogs.js` | `DELETE /:id` | `restrictTo('superadmin')` on DELETE (published blog) |
| `routes/services.js` | `DELETE /:id` | `restrictTo('superadmin')` on DELETE |
| `routes/packages.js` | `DELETE /:id` | `restrictTo('superadmin')` on DELETE |
| `routes/gallery.js` | `DELETE /:id` | `restrictTo('superadmin')` on DELETE |
| `routes/testimonials.js` | `DELETE /:id` | `restrictTo('superadmin')` on DELETE |
| `routes/founders.js` | `POST /` + `DELETE /:id` | `restrictTo('superadmin')` |
| `routes/team.js` | `DELETE /:id` | `restrictTo('superadmin')` |
| `routes/settings.js` | `PUT /` | Already has `restrictTo('superadmin')` ✅ |

---

#### [NEW] [routes/audit-logs.js](file:///d:/Digital-tech-startup-web/server/routes/audit-logs.js)

```
GET /api/audit-logs  — Super Admin only, pagination + filters (action, resource, adminId, dateRange)
DELETE /api/audit-logs  — Clear old logs (Super Admin only)
```

---

#### [MODIFY] [server/index.js](file:///d:/Digital-tech-startup-web/server/index.js)

Add new route registration:
```js
app.use('/api/audit-logs', require('./routes/audit-logs'));
```

---

### D. Frontend — Utilities & Hooks

---

#### [NEW] `client/src/hooks/useAdminAuth.js`

```js
// Custom hook — returns { adminUser, isSuperAdmin, hasPermission(key), isLoaded }
// Used by all pages and AdminLayout
```

---

#### [NEW] `client/src/components/PermissionGuard.jsx`

```jsx
// <PermissionGuard permission="leads"> — wraps any element/section
// If no permission: renders nothing (or optional fallback)
// <PermissionGuard role="superadmin"> — role-only guard
// <PermissionGuard permission="leads" fallback={<AccessDeniedBanner />}>
```

---

#### [NEW] `client/src/pages/admin/Forbidden.jsx`

A 403 Unauthorized page matching existing admin UI design:
- Same card/border styling as existing pages
- Shield icon with red gradient
- "Access Restricted" heading
- Go Back button
- Shown when admin manually navigates to restricted URL

---

### E. Frontend — Admin Layout Updates

---

#### [MODIFY] [AdminLayout.jsx](file:///d:/Digital-tech-startup-web/client/src/pages/AdminLayout.jsx)

**Only additive changes:**

1. Import `useAdminAuth` hook instead of inline localStorage logic (same data, cleaner).
2. `sidebarItems` array mein 2 new items add karo (conditionally visible):
   - `{ name: "Admin Management", href: "/admin/admin-management", icon: <Shield>, superAdminOnly: true }`
   - `{ name: "Audit Logs", href: "/admin/audit-logs", icon: <ClipboardList>, superAdminOnly: true }`
3. Sidebar render loop mein filter: `if (item.superAdminOnly && !isSuperAdmin) return null`
4. All existing 12 sidebar items aur their styling **unchanged**.

---

### F. Frontend — New Pages

---

#### [NEW] `client/src/pages/admin/AdminManagement.jsx`

Super Admin only page. Features:
- **Admin List Table** — Name, Avatar, Email, Role badge, Department, Status badge (Active/Suspended), Last Login, Created Date, Actions
- **Search bar** — filter by name/email
- **Filter dropdowns** — by Role, by Status
- **Pagination** — 10 per page
- **"Create New Admin" button** — opens modal
- **Admin Card/Row actions**: Edit, Suspend/Activate, Reset Password, Delete, View Permissions
- **Create Admin Modal** with fields: Full Name, Email, Phone, Password, Role selector, Department, Profile Image uploader, Status toggle, Permission checkboxes (16 permission toggles)
- **Edit Admin Modal** — same fields, password optional
- **Permission Editor Modal** — 16 toggles in grid layout
- **Design**: Reuses existing card/button/modal styling exactly

---

#### [NEW] `client/src/pages/admin/AuditLogs.jsx`

Super Admin only page. Features:
- **Log table** — Admin Name, Role, Action badge (color-coded), Resource, IP Address, Browser, Timestamp
- **Filter by**: Action type, Resource, Admin, Date range
- **Search** — by action or resource
- **Pagination**
- **Clear Old Logs** button (with confirmation)
- **Design**: Reuses existing styling

---

### G. Frontend — App.jsx Routes

---

#### [MODIFY] [App.jsx](file:///d:/Digital-tech-startup-web/client/src/App.jsx)

Add 2 new admin routes (import + Route element):
```jsx
import AdminManagement from './pages/admin/AdminManagement';
import AuditLogs from './pages/admin/AuditLogs';
...
<Route path="admin-management" element={<AdminManagement />} />
<Route path="audit-logs" element={<AuditLogs />} />
```

---

### H. Frontend — Existing Pages (Minimal Guards)

---

#### [MODIFY] Existing admin pages — only wrap DELETE buttons with `<PermissionGuard role="superadmin">`

Pages affected:
- `Leads.jsx` — Delete button hidden for regular admin
- `Contacts.jsx` — Delete button hidden
- `Blogs.jsx` — Delete button hidden
- `Services.jsx` — Delete button hidden
- `Packages.jsx` — Delete button hidden
- `Gallery.jsx` — Delete button hidden
- `Testimonials.jsx` — Delete button hidden
- `Team.jsx` — Delete button hidden
- `Founders.jsx` — Delete + Create buttons hidden

**Approach**: Wrap each delete button with:
```jsx
{isSuperAdmin && <button onClick={handleDelete}>Delete</button>}
```
No component restructuring. No page rewrites.

---

#### [MODIFY] `Settings.jsx` — Already partially guarded. Extend:

- Already has `isSuperAdmin` check for Multi-Admin section ✅
- Add: General Brand Settings section also wrapped with `isSuperAdmin` check ✅ (already done)

#### [MODIFY] `SeoSettings.jsx` — Wrap SEO save button with `isSuperAdmin` check; show read-only view for regular admins with note about restricted access.

---

## File Count Summary

| Category | New Files | Modified Files |
|----------|-----------|----------------|
| Server Models | 1 (AuditLog) | 1 (Admin) |
| Server Middleware | 0 | 1 (auth.js) |
| Server Routes | 1 (audit-logs) | 9 existing routes + auth.js |
| Server Index | 0 | 1 |
| Frontend Hooks | 1 (useAdminAuth) | 0 |
| Frontend Components | 1 (PermissionGuard) | 0 |
| Frontend Pages | 3 (AdminManagement, AuditLogs, Forbidden) | 11 existing pages |
| Frontend Layout | 0 | 1 (AdminLayout) |
| Frontend Router | 0 | 1 (App.jsx) |
| **TOTAL** | **6** | **25** |

---

## Verification Plan

### Automated Build Test
```bash
cd client && npm run build
```
- Must complete with 0 errors
- Warnings acceptable

### Manual Verification

1. **Super Admin Login** → All 14 sidebar items visible → All sections accessible
2. **Regular Admin Login** → 12 items visible (no Admin Management, no Audit Logs) → Delete buttons hidden → Settings shows profile-only view
3. **Regular Admin → manually visit `/admin/admin-management`** → 403 Forbidden page shown
4. **Super Admin → Create new Admin** → Admin appears in list → Login with new creds works
5. **Super Admin → Suspend admin** → Suspended admin login returns 403
6. **Super Admin → Audit Logs** → Actions tracked (e.g., after editing a blog)
7. **Regular Admin → try DELETE /api/leads/xyz** → 403 returned from backend

### Git Commit & Deploy
```bash
git commit -am "feat: Complete RBAC system — Admin Management, Audit Logs, Permission Guards"
git push origin main
```
