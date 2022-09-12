import { toast, ToastColor } from 'components/toast'

export function makeWelcomeToast() {
	toast({
		color: ToastColor.highlight,
		title: `Welcome to HashiCorp Developer!`,
		description:
			'Tutorial and Documentation content was recently migrated to Developer. Read about the migration by clicking Learn More in the banner on the top of the page.',
		autoDismiss: 15000,
	})
}
