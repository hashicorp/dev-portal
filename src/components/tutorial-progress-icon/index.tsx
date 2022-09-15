import classNames from 'classnames'
import { TutorialProgressStatus } from 'lib/learn-client/types'
import { IconCheckCircle16 } from '@hashicorp/flight-icons/svg-react/check-circle-16'
import { IconCircleHalf16 } from '@hashicorp/flight-icons/svg-react/circle-half-16'
import s from './tutorial-progress-icon.module.css'

function TutorialProgressIcon({
	status,
	size = 12,
}: {
	status: TutorialProgressStatus
	size?: 12 | 14
}) {
	const className = classNames(
		s.progressIcon,
		s[`size_${size}`],
		s[`status_${status}`]
	)
	if (status == 'complete') {
		return <IconCheckCircle16 className={className} />
	} else if (status == 'in_progress') {
		return <IconCircleHalf16 className={className} />
	} else {
		return null
	}
}

export default TutorialProgressIcon
