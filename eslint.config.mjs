import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "delivery/**", // Legacy delivery folder uses CommonJS
  ]),
  {
    rules: {
      // Warn on console statements, but allow console.error/warn for critical server-side logging
      "no-console": [
        "warn",
        {
          allow: ["error", "warn"],
        },
      ],
    },
  },
  {
    // Allow console in API routes (server-side code where logging is acceptable)
    files: ["**/app/api/**/*.ts", "**/app/api/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
]);

export default eslintConfig;
