/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { IconWand24 } from '@hashicorp/flight-icons/svg-react/wand-24'

import { toast, ToastColor } from 'components/toast'
import useAuthentication from 'hooks/use-authentication'

import { CmdCtrlIcon } from 'components/command-bar/components/cmd-ctrl-icon'
import { KIcon } from 'components/command-bar/components/k-icon'
import Badge from 'components/badge'

const COOKIE_IGNORE_AI_TOAST = 'dev-dot-ignore-ai-toast'
const COOKIE_HAS_SEEN_AI_TOAST = 'dev-dot-has-seen-ai-toast'
const COOKIE_EXPIRES_AT = new Date('12/25/2024') // arbitrary date

const TOAST_AUTO_DISMISS_MS = 15000

export function AIFeatureToast() {
	const { session } = useAuthentication()

	useEffect(() => {
		// skip toast if we're past the expiration date
		if (new Date() > COOKIE_EXPIRES_AT) {
			return
		}

		// skip toast if user has previously dismissed it
		if (Cookies.get(COOKIE_IGNORE_AI_TOAST)) {
			return
		}

		// skip toast if it's already been seen
		if (Cookies.get(COOKIE_HAS_SEEN_AI_TOAST)) {
			return
		}

		if (session?.meta.isAIEnabled) {
			toast({
				color: ToastColor.highlight,
				icon: <IconWand24 />,
				title: 'Welcome to the Developer AI closed beta',
				description: (
					<>
						Try it out in our{' '}
						<Badge
							ariaLabel="Command or control key"
							color="neutral-dark-mode"
							icon={<CmdCtrlIcon />}
							size="small"
						/>{' '}
						<Badge
							ariaLabel="K key"
							color="neutral-dark-mode"
							icon={<KIcon />}
							size="small"
						/>{' '}
						menu!
					</>
				),
				autoDismiss: TOAST_AUTO_DISMISS_MS,
				onDismissCallback: () => {
					// when user dismisses the toast, we should ignore it going forwards
					Cookies.set(COOKIE_IGNORE_AI_TOAST, true, {
						expires: COOKIE_EXPIRES_AT,
					})
					// remove extra cookie
					Cookies.remove(COOKIE_HAS_SEEN_AI_TOAST)
				},
				dismissOnRouteChange: false,
			})

			// if the user didn't explicitly dismiss the toast, show it again in 24 hours
			// this is a simple means to boost discoverability / awareness
			Cookies.set(COOKIE_HAS_SEEN_AI_TOAST, true, {
				expires: 1, // https://github.com/js-cookie/js-cookie?tab=readme-ov-file#expires
			})
		}
	}, [session?.meta.isAIEnabled])

	// no dom elements are needed for this component
	return null
}
