import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      colors: {
        fondo: '#08080a',
        panel: '#101014',
        panel2: '#17171d',
        linea: '#24242c',
        lineaFuerte: '#34343e',
        rojo: '#dc0b1c',
        rojoVivo: '#ff2e3e',
        rojoOscuro: '#a30813',
        verdeGeek: '#00b839',
        verdeVivo: '#17d452',
        wa: '#4dc247',
        texto: '#f2f2f5',
        textoSuave: '#c3c3cd',
        muted: '#92929f',
      },
    },
  },
  plugins: [],
};

export default config;
