export const typography = {
  fontFamily: {
    sans: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
    display: 'var(--font-display), ui-sans-serif, system-ui, sans-serif'
  },
  fontSize: {
    label: '0.8125rem',
    bodySm: '0.875rem',
    body: '1rem',
    bodyLg: '1.125rem',
    headingMd: '1.5rem',
    headingLg: '2rem',
    headingXl: '2.75rem',
    display: '3.5rem'
  },
  lineHeight: {
    compact: '1.2',
    comfortable: '1.6',
    relaxed: '1.75'
  },
  letterSpacing: {
    tight: '-0.04em',
    normal: '0',
    wide: '0.18em'
  }
} as const;
