import {
	ToastDisplayProps,
	ToastColor,
} from 'components/toast/components/toast-display/types'
import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'
import { IconCheckCircleFill24 } from '@hashicorp/flight-icons/svg-react/check-circle-fill-24'
import { toast } from 'components/toast'
import s from './progress-toast.module.css'

/**
 * Given the count of remaining tutorials in the current collection context,
 * Return props for a congratulatory progress toast.
 */
function generateProgressToast(
	remainingTutorialsCount: number
): Omit<ToastDisplayProps, 'dismissSelf'> {
	if (remainingTutorialsCount == 0) {
		return {
			title: 'Collection complete!',
			description: `Great job, keep up the momentum!`,
			icon: <IconCheckCircleFill24 className={s.collectionCompleteIcon} />,
			color: ToastColor.success,
		}
	} else {
		return {
			title: 'Tutorial complete!',
			description: `You have ${remainingTutorialsCount} tutorial${
				remainingTutorialsCount == 1 ? '' : 's'
			} left in this collection.`,
			icon: <IconCheckCircle24 className={s.tutorialCompleteIcon} />,
		}
	}
}

export default function makeProgressToast(remainingTutorialsCount: number) {
	toast({
		...generateProgressToast(remainingTutorialsCount),
		autoDismiss: 5000,
	})
}
