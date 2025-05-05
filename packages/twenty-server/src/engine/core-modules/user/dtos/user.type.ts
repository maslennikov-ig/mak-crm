// Типизация для User (core schema)
// Строго соответствует user.entity.ts

export type UserRole = 'admin' | 'employee' | 'partner' | 'franchisee' | 'guest';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  defaultAvatarUrl?: string;
  isEmailVerified: boolean;
  disabled: boolean;
  passwordHash?: string;
  canImpersonate: boolean;
  canAccessFullAdminPanel: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  locale: string;
  // Для мультиарендности
  workspaces: string[];
  role: UserRole;
  onboardingStatus?: string;
  currentWorkspace?: string;
  currentUserWorkspace?: string;
};
