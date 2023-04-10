/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import Cookies from 'js-cookie'
import { toast, ToastColor } from 'components/toast'

const DISMISS_COOKIE = 'dev-dot-dismiss-dark-mode'
const SESSION_COOKIE = 'dev-dot-dark-mode-session'
const AUTO_DISMISS = 15000 // 15 seconds
const MAX_DATE = new Date('6/15/2023')

function permanentlyDismiss() {
	// Set dismiss cookie that expires after a year assuming we won't need these notifications in a year after GA
	Cookies.set(DISMISS_COOKIE, true, {
		expires: MAX_DATE,
	})
	Cookies.remove(SESSION_COOKIE)
}

export function makeDarkModeToast() {
	// If the current date is later than the last day we want to show the notifications, return
	if (new Date() > MAX_DATE) {
		return
	}

	// Don't show toast if it has been dismissed or session is still active
	const hasDismissedWelcomeToast = Cookies.get(DISMISS_COOKIE)
	const inSession = Cookies.get(SESSION_COOKIE)
	if (hasDismissedWelcomeToast || inSession) {
		return
	}

	// Set cookie that expires at end of session to detect whether or not to display
	// We don't need a condition here since we will have already returned if session is active
	Cookies.set(SESSION_COOKIE, true)

	// If welcome toast cookie has not expired and all other checks have passed, render toast
	toast({
		color: ToastColor.highlight,
		title: `Theme support is now available!`,
		description:
			'Switch between system, light, and dark themes from the profile dropdown in the top right corner of the page.',
		autoDismiss: AUTO_DISMISS,
		onDismissCallback: permanentlyDismiss,
		dismissOnRouteChange: false,
	})
}
