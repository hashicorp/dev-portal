import Cookies from 'js-cookie'
import { toast, ToastColor } from 'components/toast'

const WELCOME_COOKIE = 'dev-dot-first-welcome-notification'
const INITIALIZATION_COOKIE = 'dev-dot-welcome-notification-initialized'
const DISMISS_COOKIE = 'dev-dot-dismiss-welcome'
const SESSION_COOKIE = 'dev-dot-welcome-session'

function permanentlyDismiss() {
	// Set dismiss cookie that expires after a year assuming we won't use these notifications in a year from now (9/13/22)
	Cookies.set(DISMISS_COOKIE, true, {
		expires: 365,
	})
	Cookies.remove(INITIALIZATION_COOKIE)
	Cookies.remove(WELCOME_COOKIE)
}

export function makeWelcomeToast() {
	const dismissWelcomeCookie = Cookies.get(DISMISS_COOKIE)
	const inSession = Cookies.get(SESSION_COOKIE)

	// Don't show toast if it has been dismissed or session is still active
	if (dismissWelcomeCookie || inSession) {
		return
	}

	const welcomeCookie = Cookies.get(WELCOME_COOKIE)
	const initializationCookie = Cookies.get(INITIALIZATION_COOKIE)

	// Permanently remove the notification after 3 months by checking if notification has ever been viewed
	// and if the initial cookie expired (max 3 months)
	if (initializationCookie && !welcomeCookie) {
		permanentlyDismiss()
	}

	// If no cookie has been set, set cookie that expires after 3 months
	// Set cookie that shows initialization of notification
	if (!welcomeCookie && !initializationCookie) {
		Cookies.set(INITIALIZATION_COOKIE, true, {
			expires: 180,
		})
		Cookies.set(WELCOME_COOKIE, true, {
			expires: 90,
		})
	}

	// Set cookie that expires at end of session to detect whether or not to display
	// We don't need a condition here since we will have returned if session item is defined (line 15)
	Cookies.set(SESSION_COOKIE, true)

	toast({
		color: ToastColor.highlight,
		title: `Welcome to our new developer experience!`,
		description:
			'Your destination for documentation and tutorials. Click the X to permanently dismiss these notifications.',
		autoDismiss: 15000,
		onDismissCallback: permanentlyDismiss,
	})
}
