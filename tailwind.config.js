const defaultSans = [
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

const defaultSerif = ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'];

module.exports = {
  purge: {
    mode: 'all',
    content: ['./components/**/*.{js,ts,jsx,tsx,css}', './pages/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: { deep: [/blur$/] },
    },
  },
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic color roles for design system
        primary: {
          DEFAULT: '#1F2B5D', // dark-blue - main brand color
          light: '#B2DCF4', // light-blue - headings, emphasis
        },
        accent: {
          DEFAULT: '#29AFBB', // teal - interactive elements, CTAs
          hover: '#238995', // darker teal for hover states
        },
        surface: {
          DEFAULT: '#F8FFF6', // cream - cards, containers
          dark: '#1F2B5D', // dark-blue - dark mode surfaces
        },
        danger: '#D70023', // dark-red - errors, alerts

        // Legacy color names (for backward compatibility)
        'dark-blue': '#1F2B5D',
        cream: '#F8FFF6',
        'dark-red': '#D70023',
        teal: '#29AFBB',
        'light-blue': '#B2DCF4',
      },
      fontSize: {
        // Fluid typography using clamp() for responsive scaling
        // Format: clamp(min, preferred, max)
        '7xl': '4.5rem',
        // Display headings: scale from 3rem (mobile) to 4.5rem (desktop)
        '6xl': 'clamp(3rem, 5vw + 1rem, 4.5rem)', // 48px -> 72px
        '5xl': 'clamp(2.5rem, 4vw + 1rem, 3.75rem)', // 40px -> 60px
        // Section headings: scale from 1.75rem to 2.5rem
        '4xl': 'clamp(1.75rem, 3vw + 1rem, 2.5rem)', // 28px -> 40px
        // Subsection headings: scale from 1.25rem to 1.75rem
        '2xl': 'clamp(1.25rem, 2vw + 0.75rem, 1.75rem)', // 20px -> 28px
        // Card headings: scale from 1.125rem to 1.5rem
        xl: 'clamp(1.125rem, 1.5vw + 0.75rem, 1.5rem)', // 18px -> 24px
      },
      spacing: {
        // 8px base spacing scale for consistency
        14: '3.5rem', // 56px (7 * 8px)
        18: '4.5rem', // 72px (9 * 8px)
        22: '5.5rem', // 88px (11 * 8px)
        26: '6.5rem', // 104px (13 * 8px)
      },
      // Design System: Animation Tokens

      // Design System: Animation Tokens
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-out equivalent
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.dark-blue'),
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
            },
            'ol > li::before': {
              color: theme('colors.gray.700'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.700'),
            },
          },
        },

        dark: {
          css: {
            color: theme('colors.gray.100'),
            'ol > li::before': {
              color: theme('colors.gray.300'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.300'),
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            h5: {
              color: theme('colors.gray.100'),
            },
            h6: {
              color: theme('colors.gray.100'),
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            code: {
              color: theme('colors.gray.100'),
            },
            figcaption: {
              color: theme('colors.gray.100'),
            },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.gray.200'),
            },
          },
        },
      }),
    },
    fontFamily: {
      display: ['Open Sans', ...defaultSans],
      body: ['Merriweather', ...defaultSerif],
    },
  },
  plugins: [require('@tailwindcss/typography')],
  variants: {
    extend: {
      typography: ['dark'],
    },
  },
};
