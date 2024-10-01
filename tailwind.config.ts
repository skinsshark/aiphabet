import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        mobile: {
          raw: '(max-height: 725px) and (max-width:400px)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
