import Cookies from 'js-cookie'
import { toast, ToastColor } from 'components/toast'

const WELCOME_COOKIE = 'dev-dot-first-welcome-notification'
const INITIALIZATION_COOKIE = 'dev-dot-welcome-notification-initialized'
const DISMISS_COOKIE = 'dev-dot-dismiss-welcome'
const SESSION_COOKIE = 'dev-dot-welcome-session'

function permanentlyDismiss() {
	// Set dismiss cookie that expires after a year assuming we won't need these notifications in a year after GA
	Cookies.set(DISMISS_COOKIE, true, {
		expires: 365,
	})
	Cookies.remove(INITIALIZATION_COOKIE)
	Cookies.remove(WELCOME_COOKIE)
	Cookies.remove(SESSION_COOKIE)
}

export function makeWelcomeToast() {
	const dismissWelcomeToast = Cookies.get(DISMISS_COOKIE)
	const inSession = Cookies.get(SESSION_COOKIE)

	// Don't show toast if it has been dismissed or session is still active
	if (dismissWelcomeToast || inSession) {
		return
	}

	const welcomeToastCookie = Cookies.get(WELCOME_COOKIE)
	const toastInitialized = Cookies.get(INITIALIZATION_COOKIE)

	// Permanently remove the notification after 3 months by checking if:
	// 1. the notification has ever been viewed and
	// 2. the welcome cookie expired
	if (toastInitialized && !welcomeToastCookie) {
		permanentlyDismiss()
		return
	}

	// If no cookies have been set, set cookie that expires after 3 months
	// Also set cookie that shows initialization of notification
	if (!welcomeToastCookie && !toastInitialized) {
		Cookies.set(INITIALIZATION_COOKIE, true, {
			expires: 365,
		})
		Cookies.set(WELCOME_COOKIE, true, {
			expires: 90,
		})
	}

	// Set cookie that expires at end of session to detect whether or not to display
	// We don't need a condition here since we will have already returned if session is active
	Cookies.set(SESSION_COOKIE, true)

	toast({
		color: ToastColor.highlight,
		title: `Welcome to HashiCorp Developer!`,
		description: 'Your destination for documentation and tutorials.',
		autoDismiss: 15000,
		onDismissCallback: permanentlyDismiss,
	})
}
