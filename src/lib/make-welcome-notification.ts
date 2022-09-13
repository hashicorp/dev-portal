import Cookies from 'js-cookie'
import { toast, ToastColor } from 'components/toast'

const WELCOME_COOKIE = 'dev-dot-welcome'
const DISMISS_COOKIE = 'dev-dot-dismiss-welcome'
const SESSION_ITEM = 'in-welcome-session'

export function makeWelcomeToast() {
	const dismissWelcomeCookie = Cookies.get(DISMISS_COOKIE)
	const inSession = sessionStorage.getItem(SESSION_ITEM)

	if (dismissWelcomeCookie || inSession) {
		return
	}

	const welcomeCookie = Cookies.get(WELCOME_COOKIE)

	// If welcome toast was first shown 3 months ago (in milliseconds), don't show again
	if (welcomeCookie && Date.now() - welcomeCookie >= 7889400000) {
		Cookies.set(DISMISS_COOKIE, true)
		return
	}

	if (!welcomeCookie) {
		Cookies.set(WELCOME_COOKIE, Date.now())
	}

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
