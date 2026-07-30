import { useState, useEffect, useCallback } from 'react';
import api from '@/src/api';

/**
 * useAdminAuth — Central hook for admin authentication state.
 * Returns { adminUser, isSuperAdmin, hasPermission, isLoaded, refetch }
 *
 * Super Admin has ALL permissions regardless of the permissions object.
 * Regular Admin uses the permissions map stored in the DB.
 */
export function useAdminAuth() {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('adminInfo');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const refetch = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { setIsLoaded(true); return; }
    try {
      const res = await api.get('/auth/me');
      if (res.data) {
        setAdminUser(res.data);
        localStorage.setItem('adminInfo', JSON.stringify(res.data));
      }
    } catch {
      // Token expired or invalid — clear storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      setAdminUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const isSuperAdmin = adminUser?.role === 'superadmin';

  /**
   * hasPermission(key) — check if current admin has a specific permission.
   * Super Admin always returns true.
   * Regular Admin: checks permissions object, defaults to true if key missing.
   */
  const hasPermission = useCallback((key) => {
    if (!adminUser) return false;
    if (adminUser.role === 'superadmin') return true;
    if (!adminUser.permissions) return true;
    // If the key is explicitly false, deny; otherwise allow
    return adminUser.permissions[key] !== false;
  }, [adminUser]);

  return { adminUser, isSuperAdmin, hasPermission, isLoaded, refetch, setAdminUser };
}

export default useAdminAuth;
