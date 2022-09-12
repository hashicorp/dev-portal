import TutorialProgressIcon from 'components/tutorial-progress-icon'
import { progressStatusToLabel } from 'lib/learn-client/api/progress'
import { TutorialProgressStatus } from 'lib/learn-client/types'
import s from './progress-icon-and-label.module.css'

function ProgressIconAndLabel({ status }: { status: TutorialProgressStatus }) {
	return (
		<span className={s.progressIconAndLabel}>
			<TutorialProgressIcon status={status} size={14} />
			<span className={s.progressLabel}>{progressStatusToLabel(status)}</span>
		</span>
	)
}

export default ProgressIconAndLabel
