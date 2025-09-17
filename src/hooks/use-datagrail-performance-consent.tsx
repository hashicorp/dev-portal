/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState } from 'react'
import {
	addDatagrailEventListener,
	removeDatagrailEventListeners,
} from 'lib/consent-manager/utils'

/**
 * Custom hook to manage the category performance consent state based on Datagrail preferences.
 *
 * This hook listens for `initial_preference_callback` and `preference_callback` events from Datagrail
 * and updates the `categoryPerformanceConsent` state based on the user's consent preferences.
 *
 * @returns {boolean} categoryPerformanceConsent - A boolean indicating whether the user has given
 * consent for category performance cookies. `true` if consent is granted, `false` otherwise.
 *
 * @example
 * const categoryPerformanceConsent = useDatagrailPerformanceConsent();
 * console.log(categoryPerformanceConsent); // true or false based on user consent
 */
const useDatagrailPerformanceConsent = (): boolean => {
	// This consent category that is used for performance cookies which determines if we can use posthog
	const consentCategory = 'dg-category-performance'
	const [categoryPerformanceConsent, setCategoryPerformanceConsent] =
		useState<boolean>(false)

	function formatPayload(preferences) {
		const payload = preferences.reduce((obj, item) => {
			obj[item.gtm_key] = item.isEnabled
			return obj
		}, {})
		return payload
	}

	useEffect(() => {
		addDatagrailEventListener('initial_preference_callback', (preferences) => {
			const payload = formatPayload(
				preferences?.consentPreferences?.cookieOptions
			)
			if (payload && payload[consentCategory]) {
				setCategoryPerformanceConsent(true)
			} else {
				setCategoryPerformanceConsent(false)
			}
		})

		addDatagrailEventListener('preference_callback', (preferences) => {
			const payload = formatPayload(
				preferences?.consentPreferences?.cookieOptions
			)
			if (payload && payload[consentCategory]) {
				setCategoryPerformanceConsent(true)
			} else {
				setCategoryPerformanceConsent(false)
			}
		})

		return () => {
			removeDatagrailEventListeners()
		}
	}, [])

	return categoryPerformanceConsent
}

export default useDatagrailPerformanceConsent
