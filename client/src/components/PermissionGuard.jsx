import { ShieldAlert } from 'lucide-react';

/**
 * PermissionGuard — conditional render wrapper for RBAC.
 *
 * Usage examples:
 *   <PermissionGuard isSuperAdmin={isSuperAdmin}>
 *     <DeleteButton />
 *   </PermissionGuard>
 *
 *   <PermissionGuard isSuperAdmin={isSuperAdmin} fallback={<AccessBanner />}>
 *     <AdminSection />
 *   </PermissionGuard>
 *
 * Props:
 *   isSuperAdmin  — boolean from useAdminAuth
 *   fallback      — optional ReactNode shown when access denied (default: null)
 *   children      — content shown when access granted
 */
export function PermissionGuard({ isSuperAdmin, fallback = null, children }) {
  if (isSuperAdmin) return children;
  return fallback;
}

/**
 * AccessDeniedBanner — standard banner for sections restricted to Super Admin
 */
export function AccessDeniedBanner({ message }) {
  return (
    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4">
      <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={22} />
      <div>
        <p className="text-sm font-black text-foreground">Super Admin Access Required</p>
        <p className="text-xs font-medium text-muted-foreground mt-1 leading-relaxed">
          {message || 'This section is restricted to Super Admin accounts only.'}
        </p>
      </div>
    </div>
  );
}

export default PermissionGuard;
