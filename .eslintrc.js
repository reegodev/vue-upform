module.exports = {
  root: true,
  env: {
      "browser": true,
      "node": true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", 'plugin:vue/vue3-recommended'],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: [
    "/**/dist/*.js",
    "/**/dist/*.d.ts",
    "rollup.config.js",
    ".eslintrc.js",
    "/**/*.html",
  ],
  rules: {
    "prettier/prettier": "error",
  },
};
