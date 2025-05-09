import js from "@eslint/js";
import path from "node:path";
import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: ["dist/*", "node_modules/*"],
  },
  ...compat.extends("prettier"),
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      prettier,
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "prettier/prettier": "error",
      "func-style": ["error", "declaration"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default config;
