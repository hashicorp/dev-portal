/**
 * Return `true` if `window` is defined,
 * `false` otherwise.
 */
export function isBrowser(): boolean {
	return typeof window !== 'undefined'
}
