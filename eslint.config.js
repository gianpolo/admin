import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: [
      "**/*.{js,mjs,cjs,jsx}"
    ],
    plugins: {
      js
    },
    extends: [
      "js/recommended"
    ],
    "rules": {
      "jsx/react-in-jsx-scope": "off", // Not needed with React 17+
    }
  },
  {
    files: [
      "**/*.{js,mjs,cjs,jsx}"
    ],
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginReact.configs.flat.recommended,
]);
