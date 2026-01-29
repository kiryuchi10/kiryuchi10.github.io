// Local PostCSS config so this app doesn't inherit parent Tailwind (avoids "content missing" warning).
// This app uses plain CSS; no Tailwind. Use .cjs because package.json has "type": "module".
module.exports = {
  plugins: {},
};
