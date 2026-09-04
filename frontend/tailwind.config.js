export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'roti-dark': '#2A363B',
        'roti-primary': '#E84A5F',
        'roti-secondary': '#FF847C',
        'roti-cream': '#FECEA8',
        'roti-success': '#99B898',
        // Landing theme
        'stone-950': '#0a0a0a',
        'stone-900': '#121212',
        'stone-800': '#1a1a1a',
        'orange-vibrant': '#ff8c00',
        'gold': '#d4a843',
        'gold-light': '#f5d080',
      },
      fontFamily: {
        'script': ['Great Vibes', 'cursive'],
        'serif-display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4a843 0%, #f5d080 50%, #d4a843 100%)',
        'orange-gradient': 'linear-gradient(135deg, #ff8c00 0%, #e67e00 100%)',
      },
      animation: {
        'float': 'floatBounce 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'whatsapp-pulse': 'whatsapp-pulse 2s ease-in-out infinite',
        'slide-transition': 'slideTransition 0.7s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out 0.2s both',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(212, 168, 67, 0.4)',
        'orange': '0 4px 20px rgba(255, 140, 0, 0.35)',
        'orange-lg': '0 8px 40px rgba(255, 140, 0, 0.5)',
        'plate': '0 0 80px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}
