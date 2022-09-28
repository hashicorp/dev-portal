/// <reference types="@hashicorp/platform-types" />

declare module 'swingset/page' {
	const createPage: (opts: $TSFixMe) => $TSFixMe

	export default createPage
}

declare module 'swingset/server' {
	const createStaticPaths: $TSFixMe
	const createStaticProps: $TSFixMe

	export { createStaticPaths, createStaticProps }
}

declare module '@hashicorp/react-search'

/**
 * Application config, defined in environment-specific JSON files in `config/`
 */
declare const __config: Record<string, any>

declare module '*.png'

/**
 * Declare types for window.analytics from segment
 * NOTE: intended to override declaration from @hashicorp/platform-types
 */
interface Window {
	analytics: SegmentAnalytics.AnalyticsJS
	/**
	 * TODO: We could install @datadog/browser-rum to get types here, I think?
	 * https://www.npmjs.com/package/@datadog/browser-rum
	 */
	DD_RUM: $TSFixMe
}

/**
 * Custom utility that constructs a union of all possible property value types.
 *
 * ref: https://stackoverflow.com/a/49286056
 */
type ValueOf<T> = T[keyof T]

/**
 * Generated files
 */
declare module '.generated/opt-in-redirect-checks'
