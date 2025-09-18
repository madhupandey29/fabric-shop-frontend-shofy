// postcss.config.js
module.exports = {
  plugins: {
    "postcss-preset-env": {
      stage: 3
      // add any features you really need here
    },
    tailwindcss: {},
    autoprefixer: {}
  }
};
