import Cookies from 'js-cookie'
import { toast, ToastColor } from 'components/toast'

const WELCOME_COOKIE = 'dev-dot-first-welcome-notification'

const DISMISS_COOKIE = 'dev-dot-dismiss-welcome'
const SESSION_COOKIE = 'dev-dot-welcome-session'
const AUTO_DISMISS = 15000 // 15 seconds
const MAX_DATE = new Date('1/31/2023')

function permanentlyDismiss() {
	// Set dismiss cookie that expires after a year assuming we won't need these notifications in a year after GA
	Cookies.set(DISMISS_COOKIE, true, {
		expires: MAX_DATE,
	})
	Cookies.remove(WELCOME_COOKIE)
	Cookies.remove(SESSION_COOKIE)
}

const hasWelcomeToast = () => Cookies.get(WELCOME_COOKIE)

export function makeWelcomeToast() {
	// Don't show toast if it has been dismissed or session is still active
	const hasDismissedWelcomeToast = Cookies.get(DISMISS_COOKIE)
	const inSession = Cookies.get(SESSION_COOKIE)
	if (hasDismissedWelcomeToast || inSession) {
		return
	}

	// If no cookies have been set, set cookie that expires after 3 months from GA
	if (!hasWelcomeToast()) {
		Cookies.set(WELCOME_COOKIE, true, {
			expires: MAX_DATE,
		})
	}

	// Set cookie that expires at end of session to detect whether or not to display
	// We don't need a condition here since we will have already returned if session is active
	Cookies.set(SESSION_COOKIE, true)

	// If welcome toast cookie has not expired and all other checks have passed, render toast
	if (hasWelcomeToast()) {
		toast({
			color: ToastColor.highlight,
			title: `Welcome to HashiCorp Developer!`,
			description: 'Your destination for documentation and tutorials.',
			autoDismiss: AUTO_DISMISS,
			onDismissCallback: permanentlyDismiss,
			dismissOnRouteChange: false,
		})
	}
}
