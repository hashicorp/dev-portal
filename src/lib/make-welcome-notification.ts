import Cookies from 'js-cookie'
import { toast, ToastColor } from 'components/toast'

const WELCOME_DATE_COOKIE = 'dev-dot-welcome'
const DISMISS_COOKIE = 'dev-dot-dismiss-welcome'
const SESSION_ITEM = 'in-dev-dot-welcome-session'

const getCurrentMinutes = () => Date.now() / 60000

function permanentlyDismiss() {
	Cookies.set(DISMISS_COOKIE, true)
	Cookies.remove(WELCOME_DATE_COOKIE)
}

export function makeWelcomeToast() {
	const dismissWelcomeCookie = Cookies.get(DISMISS_COOKIE)
	const inSession = sessionStorage.getItem(SESSION_ITEM)

	// Don't show toast if it has been dismissed or session is still active
	if (dismissWelcomeCookie || inSession) {
		return
	}

	const welcomeCookie = Cookies.get(WELCOME_DATE_COOKIE)

	// If toast was first shown 3 months ago (in minutes), dismiss & don't show again
	if (welcomeCookie && getCurrentMinutes() - welcomeCookie >= 131400) {
		permanentlyDismiss()
		return
	}

	// If no cookie has been set, set cookie as current DateTime in minutes
	if (!welcomeCookie) {
		Cookies.set(WELCOME_DATE_COOKIE, getCurrentMinutes())
	}

	// Set session item to detect whether or not to display
	// We don't need a condition here since we will have returned if session item is defined (line 15)
	sessionStorage.setItem(SESSION_ITEM, 'yes')

	toast({
		color: ToastColor.highlight,
		title: `Welcome to our new developer experience!`,
		description:
			'Your destination for documentation and tutorials. Click the X to permanently dismiss these notifications.',
		autoDismiss: 15000,
		onDismissCallback: permanentlyDismiss,
	})
}
