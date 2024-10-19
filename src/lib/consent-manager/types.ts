/*
 * "what are these types?"
 * https://docs.datagrail.io/docs/consent/retrieve-consent-choices
 */

export type DatagrailEvent =
	| 'preference_callback'
	| 'initial_preference_callback'

type DatagrailCookieOption = { gtm_key: string; isEnabled: boolean }

export type DatagrailPreferencesPayload = {
	consentPreferences: {
		cookieOptions: DatagrailCookieOption[]
		isCustomized: boolean
	}
	action: 'essential_only' | 'accept_all' | 'DNT' | 'custom'
	uniqueID: string
	policyName: string
}
