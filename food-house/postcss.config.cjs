// postcss.config.js
module.exports = {
  plugins: [
    require("@tailwindcss/postcss"), // Plugin riêng của Tailwind v4 :contentReference[oaicite:2]{index=2}
    require("autoprefixer"),
  ],
};
