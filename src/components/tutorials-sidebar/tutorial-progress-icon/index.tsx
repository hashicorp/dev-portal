import { TutorialProgressStatus } from 'lib/learn-client/types'
import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import { IconCircleHalf16 } from '@hashicorp/flight-icons/svg-react/circle-half-16'
import { IconCircle16 } from '@hashicorp/flight-icons/svg-react/circle-16'
import s from './tutorial-progress-icon.module.css'

const IS_DEV = process.env.NODE_ENV !== 'production'

function TutorialProgressIcon({ status }: { status: TutorialProgressStatus }) {
	if (status == 'complete') {
		return <IconCheckCircle16 className={s.iconComplete} />
	} else if (status == 'in_progress') {
		return <IconCircleHalf16 className={s.iconInProgress} />
	} else if (status == 'visited' && IS_DEV) {
		/**
		 * TODO: this should be removed before going to production,
		 * but is useful for dev testing.
		 */
		return <IconCircle16 className={s.iconVisited} />
	} else {
		return null
	}
}

export default TutorialProgressIcon
