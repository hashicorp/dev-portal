import { TutorialProgressStatus } from 'lib/learn-client/types'
import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import { IconCircleHalf16 } from '@hashicorp/flight-icons/svg-react/circle-half-16'
import s from './tutorial-progress-icon.module.css'

function TutorialProgressIcon({ status }: { status: TutorialProgressStatus }) {
	if (status == 'complete') {
		return <IconCheckCircle16 className={s.iconComplete} />
	} else if (status == 'in_progress') {
		return <IconCircleHalf16 className={s.iconInProgress} />
	} else {
		return null
	}
}

export default TutorialProgressIcon
