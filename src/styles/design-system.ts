// 🔥 Design System Kikecho adapté pour OpenBadge Reader
// Based on Kikecho Design System v1.0.0

export const kikechoTheme = {
  colors: {
    // Couleurs principales
    flame: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    solar: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },
    nature: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    passion: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },

    // Niveaux de chaleur pour badges
    heat: {
      frozen: '#3b82f6',  // blue-500
      cool: '#22c55e',    // green-500
      warm: '#eab308',    // yellow-500
      hot: '#f97316',     // orange-500
      blazing: '#ef4444', // red-500
    },

    // Status colors
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#3b82f6',

    // Neutres
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },

  typography: {
    fontFamily: {
      heading: ['Poppins', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
      accent: ['Archivo Black', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
    '5xl': '8rem',   // 128px
  },

  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Shadows colorées
    flame: '0 10px 30px -10px rgba(249, 115, 22, 0.4)',
    solar: '0 10px 30px -10px rgba(234, 179, 8, 0.4)',
    nature: '0 10px 30px -10px rgba(34, 197, 94, 0.4)',
    success: '0 0 20px rgba(34, 197, 94, 0.3)',
    warning: '0 0 20px rgba(234, 179, 8, 0.3)',
  },

  gradients: {
    flame: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    solar: 'linear-gradient(135deg, #eab308 0%, #fde047 100%)',
    nature: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
    passion: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    hero: 'linear-gradient(135deg, #f97316 0%, #eab308 50%, #22c55e 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
    warning: 'linear-gradient(135deg, #eab308 0%, #fde047 100%)',
  },

  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easings: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

// Utility function pour composer des classes
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// Helper pour obtenir une couleur selon le niveau de chaleur
export function getHeatColor(level: 'frozen' | 'cool' | 'warm' | 'hot' | 'blazing'): string {
  return kikechoTheme.colors.heat[level];
}

// Helper pour obtenir l'emoji selon le niveau
export function getHeatEmoji(level: 'frozen' | 'cool' | 'warm' | 'hot' | 'blazing'): string {
  const emojis = {
    frozen: '❄️',
    cool: '😎',
    warm: '🌤️',
    hot: '🔥',
    blazing: '💥',
  };
  return emojis[level];
}
