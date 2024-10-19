import { DatagrailEvent, DatagrailPreferencesPayload } from './types'
import Cookies from 'js-cookie'

export const CONSENT_COOKIE_KEY = 'has_configured_dg_consent'

export const isOnClient = () => typeof window !== 'undefined'
export const datagrailHasMounted = () =>
	isOnClient() && window.hasOwnProperty('DG_BANNER_API')

export const showBanner = () => {
	if (!datagrailHasMounted()) return
	window.DG_BANNER_API.showConsentBanner()
}

export const hasConfiguredConsent = (): boolean => {
	return datagrailHasMounted() && !!Cookies.get(CONSENT_COOKIE_KEY)
}

export const addDatagrailEventListener = (
	event: DatagrailEvent,
	callback: (preferences: DatagrailPreferencesPayload) => void
) => {
	if (!isOnClient()) return

	window.dgEvent = window.dgEvent || []
	window.dgEvent.push({ event, params: callback })
}

// no need to remove individual listeners because the array is reset on mount
// ie we can just reset the array
export const removeDatagrailEventListeners = () => {
	if (!isOnClient()) return
	window.dgEvent = []
}

const POLL_INTERVAL_MS = 100
const MOUNT_TIMEOUT_MS = 5000

export const onDatagrailMount = (callback: () => void): (() => void) => {
	if (!isOnClient()) return () => {}
	if (datagrailHasMounted()) {
		callback()
		return () => {}
	}

	const intervalId = setInterval(() => {
		if (datagrailHasMounted()) {
			callback()
			cleanup()
		}
	}, POLL_INTERVAL_MS)

	const timeoutId = window.setTimeout(() => {
		console.error(
			'[@web/consent-manager]: Timeout exceeded. Failed to mount consent banner'
		)
		cleanup()
	}, MOUNT_TIMEOUT_MS)

	function cleanup() {
		clearInterval(intervalId)
		window.clearTimeout(timeoutId)
	}

	return cleanup
}
