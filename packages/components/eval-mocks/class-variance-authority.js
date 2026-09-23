// Build-time stand-in for `class-variance-authority`, used only while wyw-in-js
// evaluates `*.style.ts` files to extract their `css` blocks. The `cva()`
// result is never read during extraction, so a no-op avoids loading the
// package's CommonJS build through a `require()` fallback. The real package is
// still what ships in the bundle and runs in the browser and in tests.
export const cva = () => () => '';

export const cx = () => '';
