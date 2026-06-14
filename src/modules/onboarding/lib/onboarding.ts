import type { Session, UserRole } from '@/lib/auth';
import { routes } from '@/shared/constants/routes';

export type OnboardingRole = 'buyer' | 'vendor';

export interface OnboardingSnapshot {
  selectedRole: OnboardingRole | null;
  vendorSetupCompleted: boolean;
  locationAdded: boolean;
  verificationSubmitted: boolean;
}

export function getSuggestedRole(role: UserRole): OnboardingRole {
  return role === 'vendor' ? 'vendor' : 'buyer';
}

export function isOnboardingComplete(state: OnboardingSnapshot) {
  if (!state.selectedRole) {
    return false;
  }

  if (state.selectedRole === 'buyer') {
    return true;
  }

  return state.vendorSetupCompleted && state.locationAdded && state.verificationSubmitted;
}

export function getNextOnboardingRoute(state: OnboardingSnapshot, session: Session | null) {
  if (!session || session.user.role === 'admin') {
    return null;
  }

  if (!state.selectedRole) {
    return routes.onboarding.role;
  }

  if (state.selectedRole === 'buyer') {
    return null;
  }

  if (!state.vendorSetupCompleted) {
    return routes.onboarding.vendorSetup;
  }

  if (!state.locationAdded) {
    return routes.onboarding.vendorLocation;
  }

  if (!state.verificationSubmitted) {
    return routes.onboarding.vendorVerification;
  }

  return null;
}

export function getAuthenticatedLandingRoute(session: Session | null, state: OnboardingSnapshot) {
  if (!session) {
    return routes.auth.login;
  }

  const nextOnboardingRoute = getNextOnboardingRoute(state, session);

  if (nextOnboardingRoute) {
    return nextOnboardingRoute;
  }

  if (session.user.role === 'vendor') {
    return routes.vendor.dashboard;
  }

  if (session.user.role === 'admin') {
    return routes.admin.dashboard;
  }

  return routes.buyer.home;
}
