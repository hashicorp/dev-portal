import { DatagrailEvent, DatagrailPreferencesPayload } from './types'

// https://docs.datagrail.io/docs/consent/retrieve-consent-choices
declare global {
	interface Window {
		dgEvent: {
			event: DatagrailEvent
			params: (prefs: DatagrailPreferencesPayload) => void
		}[]
		DG_BANNER_API: {
			showConsentBanner: () => void
			// there's more to this object, but this is the only method we're using
		}
	}
}
