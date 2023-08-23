import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * This hook provides a state object that indicates `next/router` activity.
 *
 * In some cases, we may want to manipulate `window.location` outside of
 * the flow of `next/router`. In those cases, we want to ensure our
 * manipulation does not conflict with `next/router`.
 *
 * This hook helps avoid conflicts by providing state that indicates
 * whether `next/router` is in the middle of changing the route.
 *
 * It also indicates whether the `#hash` was just changed, which is intended
 * to allow consumers to avoid changing the `#hash` if it has just
 * been updated by an intentional link click.
 */
export function useRouteChangeState() {
	const router = useRouter()

	const [routeState, setRouteState] = useState<{
		isChanging: boolean
		wasHashJustChanged?: boolean
	}>({
		// We assume the route is changing during mount, trying to change
		// `window.location` during mount will likely conflict with `next/router`.
		isChanging: true,
		// We assume a hash change on initial load, as visitors may have
		// just landed on a URL with a hash link. This property is retained
		// even after mount, it's only reset to `false` once scroll starts.
		wasHashJustChanged: true,
	})

	useEffect(() => {
		// On mount, consider the initial route change completed
		setRouteState((p) => ({ ...p, isChanging: false }))

		// Monitor route change events
		const handleRouteChangeStart = () =>
			setRouteState({ isChanging: true, wasHashJustChanged: false })
		const handleRouteChangeComplete = () => {
			console.log('routeChangeComplete')
			setRouteState({ isChanging: false, wasHashJustChanged: false })
		}
		router.events.on('routeChangeStart', handleRouteChangeStart)
		router.events.on('routeChangeComplete', handleRouteChangeComplete)
		router.events.on('routeChangeError', handleRouteChangeComplete)

		// Monitor hash change events
		const handleHashChangeStart = () =>
			setRouteState({ isChanging: true, wasHashJustChanged: true })
		const handleHashChangeComplete = () =>
			setRouteState({ isChanging: false, wasHashJustChanged: true })
		router.events.on('hashChangeStart', handleHashChangeStart)
		router.events.on('hashChangeComplete', handleHashChangeComplete)

		// Unsubscribe from events on unmount
		return () => {
			router.events.off('routeChangeStart', handleRouteChangeStart)
			router.events.off('routeChangeComplete', handleRouteChangeComplete)
			router.events.off('routeChangeError', handleRouteChangeComplete)

			router.events.off('hashChangeStart', handleHashChangeStart)
			router.events.off('hashChangeComplete', handleHashChangeComplete)
		}
	}, [router])

	/**
	 * When the page is scrolled, we'll update `wasHashJustChanged` to `false`.
	 *
	 * Without this effect, after a hash change, consumers of this effect would
	 * receive inaccurate data that implies a hash change was _just_ completed,
	 * when in fact the user has taken subsequent action.
	 */
	useEffect(() => {
		function scrollEventHandler() {
			if (!routeState.isChanging && routeState.wasHashJustChanged) {
				setRouteState((p) => ({ ...p, wasHashJustChanged: false }))
			}
		}
		window.addEventListener('scroll', scrollEventHandler, { passive: true })
		return () => window.removeEventListener('scroll', scrollEventHandler)
	}, [routeState])

	// Return the routeState for the hook consumer
	return routeState
}
