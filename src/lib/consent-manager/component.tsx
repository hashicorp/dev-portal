import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { GoogleTagManager } from '@next/third-parties/google'
import {
	showBanner,
	addDatagrailEventListener,
	onDatagrailMount,
	removeDatagrailEventListeners,
	CONSENT_COOKIE_KEY,
	hasConfiguredConsent,
} from './utils'
import { DatagrailEvent, DatagrailPreferencesPayload } from './types'

/**
 * Datagrail has its own logic for determining whether consent has been configured based on IP address.
 * However, we need a bit more granularity to determine whether the user has set preferences.
 */

type ConsentManagerProps = {
	gtmId: string
}
export const ConsentManager = ({ gtmId }: ConsentManagerProps) => {
	useEffect(() => {
		const cleanupFn = onDatagrailMount(() => {
			if (!hasConfiguredConsent()) {
				showBanner()
			}

			const datagrailEventHandler = (_: DatagrailPreferencesPayload) => {
				const sixMonths = 365 / 2
				Cookies.set(CONSENT_COOKIE_KEY, 'true', { expires: sixMonths })
			}

			const preferenceChangeEvents: DatagrailEvent[] = [
				'initial_preference_callback',
				'preference_callback',
			]
			preferenceChangeEvents.forEach((e) => {
				addDatagrailEventListener(e, datagrailEventHandler)
			})
		})

		return () => {
			cleanupFn()
			removeDatagrailEventListeners()
		}
	}, [])

	return <GoogleTagManager gtmId={gtmId} />
}
