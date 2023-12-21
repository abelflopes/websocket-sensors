/** @type import("eslint").Linter.Config */
const config = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint-config-standard", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/*.ts*"],
      extends: [
        "plugin:react-hooks/recommended",
        "ts-react-important-stuff",
        "standard-with-typescript",
        "plugin:prettier/recommended",
      ],
    },
  ],
  ignorePatterns: ["dist"],
};

module.exports = config;
