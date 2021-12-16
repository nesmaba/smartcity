module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
    indent: ["off"],
    "max-len": ["off"],
  },
  parserOptions: {
    ecmaVersion: 8, // or 2017
  },
};
