/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "radial-app":
          "radial-gradient(circle, rgba(238, 174, 202, 1) 4%, rgba(148, 230, 233, 1) 78%)",
      },
      colors: {
        primary: {
          DEFAULT: "#1E3A8A",
          90: "#1E3A8Acc", // cc = ~80% opacity
        },
        secondary: "#F59E0B", // Warm yellow for accents
        accent: "#10B981", // Green for success states
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          800: "#1F2937",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        lg: "0.5rem",
      },
    },
  },
  plugins: [],
};
