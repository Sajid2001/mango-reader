/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundOpacity: {
        10: "0.1",
        20: "0.2",
        90: "0.9",
        95: "0.95",
      },
      colors: {
        text: "var(--text)",
        background: "var(--background)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        // Secondary color with various opacity levels
        ".bg-secondary-10": {
          backgroundColor: "rgba(var(--secondary-rgb), 0.1)",
        },
        ".bg-secondary-20": {
          backgroundColor: "rgba(var(--secondary-rgb), 0.2)",
        },
        ".bg-secondary-30": {
          backgroundColor: "rgba(var(--secondary-rgb), 0.3)",
        },
        ".bg-secondary-40": {
          backgroundColor: "rgba(var(--secondary-rgb), 0.4)",
        },
        ".bg-secondary-50": {
          backgroundColor: "rgba(var(--secondary-rgb), 0.5)",
        },
        ".bg-secondary-60": {
          backgroundColor: "rgba(var(--secondary-rgb), 0.6)",
        },
        ".bg-secondary-70": {
          backgroundColor: "rgba(var(--secondary-rgb), 0.7)",
        },
        ".bg-secondary-80": {
          backgroundColor: "rgba(var(--secondary-rgb), 0.8)",
        },
        ".bg-secondary-90": {
          backgroundColor: "rgba(var(--secondary-rgb), 0.9)",
        },
        // Primary color with various opacity levels
        ".bg-primary-10": {
          backgroundColor: "rgba(var(--primary-rgb), 0.1)",
        },
        ".bg-primary-20": {
          backgroundColor: "rgba(var(--primary-rgb), 0.2)",
        },
        ".bg-primary-30": {
          backgroundColor: "rgba(var(--primary-rgb), 0.3)",
        },
        ".bg-primary-40": {
          backgroundColor: "rgba(var(--primary-rgb), 0.4)",
        },
        ".bg-primary-50": {
          backgroundColor: "rgba(var(--primary-rgb), 0.5)",
        },
        ".bg-primary-60": {
          backgroundColor: "rgba(var(--primary-rgb), 0.6)",
        },
        ".bg-primary-70": {
          backgroundColor: "rgba(var(--primary-rgb), 0.7)",
        },
        ".bg-primary-80": {
          backgroundColor: "rgba(var(--primary-rgb), 0.8)",
        },
        ".bg-primary-90": {
          backgroundColor: "rgba(var(--primary-rgb), 0.9)",
        },
        // Accent color with various opacity levels
        ".bg-accent-10": {
          backgroundColor: "rgba(var(--accent-rgb), 0.1)",
        },
        ".bg-accent-20": {
          backgroundColor: "rgba(var(--accent-rgb), 0.2)",
        },
        ".bg-accent-30": {
          backgroundColor: "rgba(var(--accent-rgb), 0.3)",
        },
        ".bg-accent-40": {
          backgroundColor: "rgba(var(--accent-rgb), 0.4)",
        },
        ".bg-accent-50": {
          backgroundColor: "rgba(var(--accent-rgb), 0.5)",
        },
        ".bg-accent-60": {
          backgroundColor: "rgba(var(--accent-rgb), 0.6)",
        },
        ".bg-accent-70": {
          backgroundColor: "rgba(var(--accent-rgb), 0.7)",
        },
        ".bg-accent-80": {
          backgroundColor: "rgba(var(--accent-rgb), 0.8)",
        },
        ".bg-accent-90": {
          backgroundColor: "rgba(var(--accent-rgb), 0.9)",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
