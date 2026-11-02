// @nerajno/dialects ships its Tailwind preset as untyped CommonJS.
declare module '@nerajno/dialects/tailwind-preset' {
  import type { Config } from 'tailwindcss'
  const preset: Partial<Config>
  export default preset
}
