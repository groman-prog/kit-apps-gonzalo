import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import betterTailwind from "eslint-plugin-better-tailwindcss"
import globals from "globals"

const PALETA =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white"
const PROPIEDAD = "bg|text|border|ring|fill|stroke|from|to|via|outline|decoration"

const restringidas = [
  { pattern: `(?:^|:)(?:${PROPIEDAD})-(?:${PALETA})(?:-\\d+)?(?:/\\d+)?!?$`, message: "paleta de Tailwind" },
  { pattern: "\\[(?:#|rgb|oklch)", message: "color arbitrario" },
  { pattern: "(?:^|:)shadow(?!-none(?:!)?)(?:-|$)", message: "sombra" },
  { pattern: "(?:^|:)drop-shadow", message: "sombra" },
  { pattern: "gradient|bg-linear-|bg-radial-|bg-conic-", message: "degradado" },
  { pattern: "(?:^|:)(?:from|via)-", message: "degradado" },
  { pattern: "(?:^|:)font-(?:serif|mono)(?:!)?$", message: "fuente no permitida" },
  { pattern: "backdrop-blur", message: "desenfoque de fondo" },
  { pattern: "(?:^|:)rounded-(?:xl|2xl|3xl)(?:!)?$", message: "radio excesivo" },
  { pattern: "(?:^|:)font-(?:bold|extrabold|black)(?:!)?$", message: "peso de fuente no permitido" },
  { pattern: "font-\\[\\d+\\]", message: "peso de fuente no permitido" },
  { pattern: "(?:^|:)transition-all(?:!)?$", message: "transición global" },
  { pattern: "divide-y", message: "línea entre elementos" },
  { pattern: "(?:^|:)animate-(?:bounce|pulse|ping)(?:!)?$", message: "animación vetada" },
  { pattern: "hover:scale", message: "escala en hover" },
  { pattern: "(?:^|:)tracking-(?:wide|wider|widest)(?:!)?$", message: "interletrado" },
  { pattern: "(?:^|:)uppercase(?:!)?$", message: "mayúsculas sostenidas" },
  { pattern: "(?:^|:)italic(?:!)?$", message: "cursiva" },
]

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "public/**",
      "capturas/**",
      "playwright-report/**",
      "test-results/**",
      "scripts/__fixtures__/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "better-tailwindcss": betterTailwind,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: "19.2" },
      "better-tailwindcss": { entryPoint: "src/index.css" },
    },
    rules: {
      ...react.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "better-tailwindcss/no-restricted-classes": ["error", { restrict: restringidas }],
    },
  },
  {
    files: ["registry/kit/atajos.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
)
