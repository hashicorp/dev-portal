// ------------------------------------------------------------
// TypeScript helpers for PageComponents' `layout` property
// @see https://nextjs.org/docs/basic-features/layouts#with-typescript
// ------------------------------------------------------------
import type { NextPage } from 'next'

/**
 * @usage
 *
 * ```typescript
 * // ./src/page/my-page.tsx
 * import type { PageWithLayout } from "types/layouts"
 *
 * const Page: PageWithLayout = (props) => {
 *   // ...
 * }
 *
 * // Page.layout <-- will be typed
 * ```
 */
export type PageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
	P,
	IP
> & {
	layout?: React.FC
}
