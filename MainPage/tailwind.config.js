export default {
  content: ["./client/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "rgb(239 246 255)",
          100: "rgb(219 234 254)",
          500: "rgb(59 130 246)",
          600: "rgb(37 99 235)",
          700: "rgb(29 78 216)",
          900: "rgb(12 31 97)",
        },
        purple: {
          500: "rgb(168 85 247)",
          600: "rgb(147 51 234)",
          700: "rgb(126 34 206)",
          900: "rgb(59 7 100)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.4s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)" },
          "50%": { boxShadow: "0 0 0 10px rgba(59, 130, 246, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
