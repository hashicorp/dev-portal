import {
	ToastDisplayProps,
	ToastColor,
} from 'components/toast/components/toast-display/types'
import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'
import { IconCheck24 } from '@hashicorp/flight-icons/svg-react/check-24'
import { toast } from 'components/toast'
import s from './progress-toast.module.css'

function generateToastMessage(
	remainingTutorialsCount: number
): Omit<ToastDisplayProps, 'dismissSelf'> {
	if (remainingTutorialsCount == 0) {
		return {
			title: 'Collection complete!',
			description: `Great job, keep up the momentum!`,
			icon: <IconCheck24 className={s.collectionCompleteIcon} />,
			color: ToastColor.success,
		}
	} else {
		return {
			title: 'Tutorial complete!',
			description: `You have ${remainingTutorialsCount} tutorials left in this collection.`,
			icon: <IconCheckCircle24 className={s.tutorialCompleteIcon} />,
		}
	}
}

export default function makeProgressToast(remainingTutorialsCount) {
	toast({
		...generateToastMessage(remainingTutorialsCount),
		autoDismiss: 15000,
	})
}
