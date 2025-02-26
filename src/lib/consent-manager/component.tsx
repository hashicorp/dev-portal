/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
	const STYLE_ID = 'dg-consent-custom-style'

	useEffect(() => {
		const cleanupFn = onDatagrailMount(() => {
			const styleNode = document.createElement('style')
			styleNode.id = STYLE_ID
			styleNode.innerHTML = `
			/*
				Hack to provide custom styles to the consent banner.
				This method is necessary since the consent banner is loaded in a shadow DOM.
				docs: https://docs.datagrail.io/docs/consent/consent-banner-customization
			*/

			:host(.dg-consent-banner) .dg-main-content {
				overflow-y: auto;
			}
			.language-dropdown-menu {
				overflow: auto;
				color-scheme: light;
			}
			`
			document.head.appendChild(styleNode)

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
			const styleNode = document.getElementById(STYLE_ID)
			if (styleNode) {
				styleNode.remove()
			}
		}
	}, [])

	return <GoogleTagManager gtmId={gtmId} />
}
