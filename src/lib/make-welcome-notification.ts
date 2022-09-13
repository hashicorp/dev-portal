import Cookies from 'js-cookie'
import { toast, ToastColor } from 'components/toast'

const WELCOME_COOKIE = 'dev-dot-welcome'
const DISMISS_COOKIE = 'dev-dot-dismiss-welcome'
const SESSION_ITEM = 'in-welcome-session'

export function makeWelcomeToast() {
	const dismissWelcomeCookie = Cookies.get(DISMISS_COOKIE)
	const inSession = sessionStorage.getItem(SESSION_ITEM)

	// Do not show toast if it has been dismissed or if in same session as most recent displayed
	if (dismissWelcomeCookie || inSession) {
		return
	}

	const welcomeCookie = Cookies.get(WELCOME_COOKIE)

	// If welcome toast was first shown 3 months ago (in milliseconds), don't show again
	if (welcomeCookie && Date.now() - welcomeCookie >= 7889400000) {
		Cookies.set(DISMISS_COOKIE, true)
		return
	}

	// If no cookie has been set, set cookie as current date
	if (!welcomeCookie) {
		Cookies.set(WELCOME_COOKIE, Date.now())
	}

	// Set session item to detect whether or not to display
	// We don't need a condition here since we will return if there is already a session item in place (line 12)
	sessionStorage.setItem(SESSION_ITEM, 'yes')

	toast({
		color: ToastColor.highlight,
		title: `Welcome to our new developer experience!`,
		description:
			'Your destination for documentation and tutorials. Click the X to permanently dismiss these notifications.',
		autoDismiss: 15000,
		onDismissCallback: () => Cookies.set(DISMISS_COOKIE, true),
	})
}
