export const typography = {
  fontFamily: {
    sans: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
    display: 'var(--font-display), ui-sans-serif, system-ui, sans-serif'
  },
  fontSize: {
    caption: '0.75rem',
    bodySm: '0.875rem',
    body: '1rem',
    bodyLg: '1.125rem',
    h3: '1.25rem',
    h2: '1.75rem',
    h1: '2.25rem',
    display: '3.5rem'
  },
  lineHeight: {
    tight: '1.15',
    compact: '1.3',
    comfortable: '1.6',
    relaxed: '1.75'
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.03em',
    normal: '0',
    wide: '0.12em'
  }
} as const;
