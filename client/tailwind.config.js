export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        gradientHero: "radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 26%), radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.14), transparent 28%)",
      },
    },
  },
  plugins: [],
};
