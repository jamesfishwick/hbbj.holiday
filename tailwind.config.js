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
        '7xl': '4.5rem',
      },
      spacing: {
        // 8px base spacing scale for consistency
        14: '3.5rem', // 56px (7 * 8px)
        18: '4.5rem', // 72px (9 * 8px)
        22: '5.5rem', // 88px (11 * 8px)
        26: '6.5rem', // 104px (13 * 8px)
      },
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
