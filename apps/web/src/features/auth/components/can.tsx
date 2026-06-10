import * as React from 'react';
import { useStore } from '@tanstack/react-store';
import { authStore, Role } from '../stores/use-auth-store';

const ROLE_HIERARCHY: Record<Role, number> = {
  GUEST: 0,
  USER: 1,
  ADMIN: 2,
};

interface CanProps {
  role: Role;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ role, children, fallback = null }: CanProps) {
  const currentRole = useStore(authStore, (state) => state.role);

  const hasAccess = ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[role];

  if (hasAccess) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
