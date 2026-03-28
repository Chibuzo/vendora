import { colors } from '@/shared/theme/colors';
import { shadows } from '@/shared/theme/shadows';
import { radii, spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

const colorVariables = {
  '--background': colors.semantic.background,
  '--foreground': colors.semantic.foreground,
  '--surface': colors.semantic.surface,
  '--surface-muted': colors.semantic['surface-muted'],
  '--surface-inverse': colors.semantic['surface-inverse'],
  '--border': colors.semantic.border,
  '--input': colors.semantic.input,
  '--ring': colors.semantic.ring,
  '--muted': colors.semantic.muted,
  '--muted-foreground': colors.semantic['muted-foreground'],
  '--secondary': colors.semantic.secondary,
  '--secondary-foreground': colors.semantic['secondary-foreground'],
  '--accent': colors.semantic.accent,
  '--accent-foreground': colors.semantic['accent-foreground'],
  '--success': colors.semantic.success,
  '--success-foreground': colors.semantic['success-foreground'],
  '--warning': colors.semantic.warning,
  '--warning-foreground': colors.semantic['warning-foreground'],
  '--danger': colors.semantic.danger,
  '--danger-foreground': colors.semantic['danger-foreground'],
  '--info': colors.semantic.info,
  '--info-foreground': colors.semantic['info-foreground'],
  '--card': colors.semantic.card,
  '--card-foreground': colors.semantic['card-foreground'],
  '--overlay': colors.semantic.overlay,
  '--primary': colors.primary[600],
  '--primary-foreground': '0 0% 100%'
} as const;

const scaleVariables = Object.fromEntries(
  (['neutral', 'primary', 'accent', 'info', 'success', 'warning', 'danger'] as const).flatMap((scale) =>
    Object.entries(colors[scale]).map(([step, value]) => [`--color-${scale}-${step}`, value])
  )
) as Record<`--color-${string}`, string>;

export const themeTokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows
} as const;

export const themeCssVariables = {
  ...colorVariables,
  ...scaleVariables,
  '--radius-sm': radii.sm,
  '--radius-md': radii.md,
  '--radius-lg': radii.lg,
  '--radius-xl': radii.xl,
  '--radius-2xl': radii['2xl'],
  '--radius-pill': radii.pill,
  '--space-4': spacing[4],
  '--space-6': spacing[6],
  '--space-8': spacing[8],
  '--space-10': spacing[10],
  '--space-12': spacing[12],
  '--shadow-soft-xs': shadows['soft-xs'],
  '--shadow-soft-sm': shadows['soft-sm'],
  '--shadow-soft-md': shadows['soft-md'],
  '--shadow-soft-lg': shadows['soft-lg'],
  '--shadow-focus': shadows.focus
} as const;

export type ThemeCssVariableName = keyof typeof themeCssVariables;

export function createTenantTheme(overrides: Partial<Record<ThemeCssVariableName, string>> = {}) {
  return {
    ...themeCssVariables,
    ...overrides
  };
}
