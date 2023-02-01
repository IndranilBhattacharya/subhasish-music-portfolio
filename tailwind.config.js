/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Ubuntu", "sans-serif"],
      },
      dropShadow: {
        highlight: "inset 0 1px 0 0 hsl(0deg 0% 100% / 5%)",
      },
      backgroundSize: {
        link: "200% 100%",
      },
      backgroundImage: {
        gradientLink: "linear-gradient(to right, #f15b5bf2 50%, whitesmoke 0%)",
      },
    },
  },
  plugins: [],
};
