import js from "@eslint/js";
import path from "node:path";
import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";

const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

const config = [
  ...compat.extends("prettier"),
  {
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
