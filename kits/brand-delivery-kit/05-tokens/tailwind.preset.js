/** Drop into a Tailwind theme.extend. Replace values from tokens.css. */
export default {
  theme: {
    extend: {
      colors: {
        brand: { 500: '#3d5a45', 600: '#2e4434' },
        ink: { 900: '#0e1114', 600: '#4a524c' },
        paper: { 50: '#e7e3d6', 100: '#d9d3c3' },
        line: { 200: '#c3bcae' },
        brass: '#c9a227',
      },
      fontFamily: {
        display: ['Georgia', 'Iowan Old Style', 'Palatino Linotype', 'serif'],
        sans: ['Arial', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['Consolas', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '28px',
      },
    },
  },
}
