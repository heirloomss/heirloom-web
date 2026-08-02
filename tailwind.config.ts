import type { Config } from 'tailwindcss';

/**
 * Heirloom design tokens — "Premium Paper Diorama" / soft luxury minimalism.
 * Canonical values from the Heirloom PRD design bible.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Foundation
        paper: '#F8F4EC', // Museum Paper — app background
        cotton: '#FFFDFC', // Cotton White — surfaces
        ivory: '#FFFDF8', // Handmade Ivory — elevated surfaces
        linen: '#ECE4D6', // Warm Linen — large quiet sections
        // Primary brand
        moss: {
          DEFAULT: '#4A6653', // Forest Moss — primary
          soft: '#5E7C67',
          deep: '#3B5343',
          wash: '#E7EDE8',
        },
        bronze: {
          DEFAULT: '#A97645', // Antique Bronze — secondary
          soft: '#BE9066',
          wash: '#F1E7DB',
        },
        gold: '#C8A24A', // Vintage Gold — used sparingly
        // Emotional + informational accents
        burgundy: {
          DEFAULT: '#7B4252', // Burgundy Ink — letters / memories
          deep: '#5F323F',
          wash: '#F0E4E7',
        },
        indigo: {
          DEFAULT: '#66749C', // Dusty Indigo — documents / status info
          wash: '#E6E9F0',
        },
        // Status
        success: '#4D8A64', // Evergreen
        warning: '#C59A45', // Harvest Gold
        error: '#A24B48',
        // Semantic ink
        ink: {
          DEFAULT: '#2E2A24', // primary text on paper
          soft: '#6B6459', // secondary text
          faint: '#9A9184', // tertiary / captions
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        input: '14px',
        button: '16px',
        image: '20px',
        card: '24px',
        dialog: '28px',
      },
      boxShadow: {
        // Soft paper depth — nothing aggressively floating
        'paper-1': '0 2px 6px rgba(0,0,0,0.05)',
        'paper-2': '0 8px 20px rgba(0,0,0,0.08)',
        'paper-3': '0 14px 34px rgba(0,0,0,0.10)',
        'paper-inset': 'inset 0 1px 0 rgba(255,255,255,0.6)',
        'seal-inset': 'inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.22)',
      },
      spacing: {
        // 8pt scale conveniences (72px, 88px)
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        content: '1440px',
        reading: '65ch',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // A soft shimmer sweeping across paper skeletons
        'paper-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease forwards',
        'paper-shimmer': 'paper-shimmer 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
