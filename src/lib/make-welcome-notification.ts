import { toast, ToastColor } from 'components/toast'

export function makeWelcomeToast() {
	toast({
		color: ToastColor.highlight,
		title: `Welcome to our new developer experience!`,
		description: 'Your destination for documentation and tutorials.',
		autoDismiss: 15000,
	})
}
