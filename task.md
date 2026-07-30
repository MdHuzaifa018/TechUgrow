# RBAC Implementation Tasks

## Phase 1: Backend Models
- [/] Update Admin.js — add permissions, status, department, phone, lastLogin, createdBy fields
- [ ] Create AuditLog.js — new model for action tracking

## Phase 2: Backend Middleware
- [ ] Update middleware/auth.js — add checkPermission(), checkSuspended(), logAudit()

## Phase 3: Backend Routes
- [ ] Update routes/auth.js — lastLogin, suspend, reset-password, edit admin, pagination
- [ ] Create routes/audit-logs.js — GET + DELETE
- [ ] Update server/index.js — register audit-logs route
- [ ] Update routes/leads.js — restrictTo on DELETE
- [ ] Update routes/contacts.js — restrictTo on DELETE
- [ ] Update routes/blogs.js — restrictTo on DELETE
- [ ] Update routes/services.js — restrictTo on DELETE
- [ ] Update routes/packages.js — restrictTo on DELETE
- [ ] Update routes/gallery.js — restrictTo on DELETE
- [ ] Update routes/testimonials.js — restrictTo on DELETE
- [ ] Update routes/founders.js — restrictTo on DELETE + POST
- [ ] Update routes/team.js — restrictTo on DELETE

## Phase 4: Frontend Utilities
- [ ] Create hooks/useAdminAuth.js
- [ ] Create components/PermissionGuard.jsx
- [ ] Create pages/admin/Forbidden.jsx

## Phase 5: Frontend New Pages
- [ ] Create pages/admin/AdminManagement.jsx
- [ ] Create pages/admin/AuditLogs.jsx

## Phase 6: Frontend Updates
- [ ] Update App.jsx — add 2 new routes
- [ ] Update AdminLayout.jsx — add sidebar items, use useAdminAuth
- [ ] Update Leads.jsx — hide delete button
- [ ] Update Contacts.jsx — hide delete button
- [ ] Update Blogs.jsx — hide delete button
- [ ] Update Services.jsx — hide delete button
- [ ] Update Packages.jsx — hide delete button
- [ ] Update Gallery.jsx — hide delete button
- [ ] Update Testimonials.jsx — hide delete button
- [ ] Update Team.jsx — hide delete button
- [ ] Update Founders.jsx — hide delete + create buttons
- [ ] Update SeoSettings.jsx — read-only for regular admin

## Phase 7: Build & Deploy
- [ ] npm run build (client)
- [ ] git commit + push
