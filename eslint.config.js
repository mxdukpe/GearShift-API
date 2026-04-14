const typescriptParser = require("@typescript-eslint/parser");
const typescriptPlugin = require("@typescript-eslint/eslint-plugin");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  {
    files: ["src/**/*.{js,ts}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
